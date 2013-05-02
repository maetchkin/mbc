var sax  = require("sax"),
    cli  = require("cli"),
    fs   = require("fs"),
    path = require("path"),
    result = {},
    point  = result,
    options = cli.parse(
        {
            tpl     : ["t", "Source", "file"],
            output  : ["o", "Write result to FILE", "file"],
            enc     : ["e", "Source's enc ( utf8 default )", "string", "utf8"]
        }
    ),

    parser   = sax.parser( true , {xmlns:true,position:false} ),

    _$ = {
        attr  : function( name ){
            if ( ("attributes" in $.node) && ( name in $.node.attributes ) && ( "value" in $.node.attributes[name] ) ) {
                return $.node.attributes[name].value;
            }
            return false;
        },
        attrs : function(){
            var res = {}, a;
            for (a in $.node.attributes){
                res[a] = $.node.attributes[a].value;
            }
            return res;
        }
    },

    $ = function( node ){
        $.node = node;
        return _$;
    },

    proc = {
        "result" : {},

        "mvc_text_mode": false,
        "mvc_param_mode": false,

        /*"current": function(){
            return this.point.template in this.result.storage ? this.result.storage[ this.point.template ] : null;
        },*/

        "slot": function(){
            return this.point ? this.point.content : [];
        },

        "point"  : null,

        "mvc:templates": function( node ){
            this.result.storage = { count: 0 };
        },

        "/mvc:templates": function () {
            return true;
        },

        "mvc:template": function( node ){
            if (this.point !== null){
                cli.fatal( "Template format violation: mvc:template must be child of mvc:templates" );
            }

            var mtpl = {
                name: ($(node).attr('name') || 'default'),
                content:[],
                parent : this.point
            };

            this.point = this.result.storage[ mtpl.name ] = mtpl;
            this.result.storage.count ++ ;
        },

        "/mvc:template": function(){
            return this.point = null;
        },

        "mvc:param": function( node ){
            var param = { mvc:'param' };
            this.slot().push( param );
            this.mvc_param_mode = param;
        },

        "/mvc:param": function(){
            this.mvc_param_mode = false;
        },

        "mvc:text": function( node ){
            this.mvc_text_mode = true;
        },

        "/mvc:text": function(){
            this.mvc_text_mode = false;
        },

        "tag": function( node ){
            var tag = {
                    name    : node.name,
                    attrs   : $(node).attrs(),
                    content : [],
                    parent  : this.point
                };
            this.slot().push( tag );
            this.point = tag;
        },

        "/tag": function( node ){
            this.point = this.point.parent;
        },

        "text" : function( text ){
            if ( this.mvc_param_mode ) {
                this.mvc_param_mode.text = text.trim();
                return;
            };

            var t = this.mvc_text_mode ? text : text.trim();
            if (t){
                this.slot().push( t );
            }
        },

        "mvc:param:compile":function(n){
            return '" + this.param("'+ n.text +'") + "';
        },

        "attrs:compile":function( attrs ){
            var res=[], a;
            for (a in attrs) {
                res.push(" "+a+"='"+attrs[a]+"'");
            }

            return res.join("");
        },

        "tag:compile":function( arr ){
            var i,n,res='';
            for (i = 0; i < arr.length; i++ ) {
                n = arr[i];
                if (typeof n === "string") {
                    res += n;
                    continue;
                }
                if (typeof n === "object") {
                    if ("mvc" in n) {
                        var method = "mvc:"+n.mvc+":compile";
                        if ( method in this ){
                            res += this[method](n);
                            continue;
                        } else {
                            cli.fatal("method " + method + " not implemented in compiler");
                        }
                    }
                    res += "<" + n.name;
                    res += n.attrs ? this["attrs:compile"]( n.attrs ) : "";
                    res += n.content && n.content.length ? ">" + this["tag:compile"]( n.content ) + "</"+n.name+">" : "/>";
                    continue;
                }
            }
            return res;
        },

        "compile":function( storage ){
            var res = [], t, banner = "/*  compiled " + options.src + "  */\n\n";
            delete storage.count;

            for ( var s in storage ){
                t = '';
                t += '"' + s + '" : function(){\n    return "';
                t += this["tag:compile"]( storage[s].content );
                t += '";\n}';
                res.push(t);
            }
            return banner + "{\n" + res.join(",\n") + "\n}";
        }
    };


    parser.onerror = function (err) { cli.fatal( err ); };

    parser.ontext  = function (text) {
        return proc.text( text );
    };

    parser.onopentag = function (node) {
        if ( node.prefix === 'mvc' ) {
            if ( node.name in proc ) {
                //cli.debug("proc: " + node.name);
                proc[ node.name ]( node );
            } else {
                cli.error("proc: not defined method for \"mvc:" + node.local + "\"");
            }
        } else {
            proc.tag( node );
        }
    };

    parser.onclosetag = function (node) {

        if ( node.indexOf("mvc:") === 0 ) {
            if ( "/"+node in proc ) {
                //cli.debug("proc: " + node);
                proc[  "/"+node ]( node );
            } else {
                cli.error("proc: not defined method for \"/" + node + "\"");
            }
        } else {
            proc["/tag"]( node );
        }
    };

    parser.onend = function () {
        /*console.log(
            require('util').inspect(
                proc.result.storage, false, null
            )
        );*/
        console.log(
            proc.compile( proc.result.storage )
        );
        cli.ok("Parsing done");
    };

    options.src = path.join(
        process.cwd(),
        options.tpl
    );



cli.main(
    function( args, options ){
        var main  = this;

        if (!options.tpl) {
            throw "template source not defined";
        }

        fs.stat(
            options.src,
            function(err, stats) {

                if(err){
                    if (err.code === 'ENOENT') {
                        err = "path " + err.path + " not exists";
                    }
                    main.fatal( err );
                }

                if( !stats.isFile() ){
                    main.fatal( "path " + err.path + " not a file;");
                }

                if ( stats.size === 0 ){
                    main.fatal( options.src + " is empty" );
                }

                fs.readFile(
                    options.src,
                    {
                        "encoding": options.enc,
                        "flag": "r"
                    },
                    function( err, data ){

                        if(err){
                            if (err.code === 'EACCES') {
                                err = "Permission denied to read " + err.path + "";
                            }
                            main.fatal( err );
                        }

                        cli.ok("Start parsing " + options.src);

                        parser.write( data ).close();
                    }

                )
            }
        );
    }
);
