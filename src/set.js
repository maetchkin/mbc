var mvcSet    = {

type   : "set",

init   : function(){
    var set    = this;
    this.mods  = {};
    this.index = [];

    this._fire_index = 0;

    $(set).on(
        "mvc:objectCreated mvc:objectDeleted",
        function (e,obj) {
            if (obj.type === "obj") {
                if (e.type === "mvc:objectCreated") {
                    set.index.push( obj.mvcid );
                }
                mvcStorage.apply(this , ["length",_mvc.prop] ).get( ["length",set.index.length] );

                if ( set._fire_index === 0 ) {
                    LIB.async(
                        function(){
                            //mvc.log("trigger mvc:index",set.id);
                            $( set ).trigger("mvc:index", set.index.length );
                            //mvc.log("set._fire_index",set.id,set._fire_index);
                            set._fire_index = 0;
                        }
                    );
                }
                set._fire_index++;
            }
        }
    );
},


obj    : function(id){
    return mvcStorage.apply( mvcGetByID( (this.mvcid.split(mvcModeDelim))[0] ) ,[id,_mvc.obj]).get(arguments) ; // todo: arguments
},

get    : function(){ // todo: arguments
  if ( 1 in arguments[0] ) {

    this.loadflag = true;
    //console.log("---LOADFLAG----"+this.id);
    //console.log(arguments[0][1]);

    var frame = arguments[0][1][0].length+1;
    var data  = arguments[0][1][1];
    for (var pos=0; data.length > pos+frame; pos+=frame){
        var updatedProps = { length : 0 };
        this.obj(
            data[pos],
                [
                    arguments[0][1][0],
                    data.slice( pos, pos + frame ),
                    updatedProps
                ]
            );

        if (updatedProps.length > 0) {
            updatedProps.length = null;
            delete updatedProps.length;
            $(this).trigger(
                "mvc:objectUpdated",
                [ data[pos], updatedProps ]
            );
        }
    }

    delete this.loadflag;
    //console.log("---DELETE LOADFLAG----"+this.id);
  }
  return this;
},

each : function( callback, filter ){
    var res = [],
        pos = 1,
        spos = 1,
        key,
        obj;

    if (arguments.length === 0 || !$.isFunction(callback) || !( filter && $.isFunction(filter) ) ){
        throw "mvc.each incorrect arguments";
    }

    for( key in this.index ){
        obj = _mvc.obj.s[ this.index[key] ];
        if ( (key-1)>=-1 ) {
            if( !filter || ( filter && filter.call( obj, spos )) ){
                obj.position = pos++;
                res.push(
                    callback.call( obj )
                );
            }
            spos++;
        }
    }

    return res;
},

prop   : function( id ) {
    if (id === "length") {
        return this.index.length;
    }
    return mvcStorage.apply(this,[id,_mvc.prop]).get(arguments); // todo: arguments
},

first: function(){
    return this.index.length ? _mvc.obj.s[ this.index[0] ] : null;
},

last: function(){
    return this.index.length ? _mvc.obj.s[ this.index[ this.index.length-1 ] ] : null;
},

mod : function( obj ){
    LIB.functionID( obj.getIndex );
    var set = this,
        Mod = function(){ this.ev = {i:"Mod events"}; },
        mod = new Mod();

    Mod.prototype = set;

    mod.name  = obj.name +":"+ obj.getIndex.id;
    mod.mvcid = this.mvcid + mvcModeDelim + mod.name;
    mod.id    = this.id    + mvcModeDelim + mod.name;
    mod._fire_index = 0;

    mod.propset = function( propset ){

        mod.prop = function ( id ) {
            if (id in propset) {
                return mvcStorage.apply(this,[id,_mvc.prop]).get(arguments); // todo: arguments
            } else {
                return set.prop.apply(set,arguments);
            }
        };

        for (var p in propset) {
            mod.prop(p, propset[p] );
        }
    };

    var indexUpdater = function(e,id){
        var new_index = obj.getIndex(),
            old_index = mod.index;

        //mvc.log("indexUpdater",e.type,mod.id,new_index.length);

        if ( new_index.join() !== old_index.join() ) {
            mod.index = new_index;

            if ( mod._fire_index === 0 ) {
                LIB.async(
                    function(){
                        $( mod ).trigger("mvc:index", set.index.length );
                        //mvc.log("set._fire_index",set.id,set._fire_index);
                        mod._fire_index = 0;
                    }
                );
            }
            mod._fire_index++;

            if ( new_index.length !== old_index.length ) {
                mod.prop( "length", new_index.length );
            }
        }

        if (e.type === "mvc:objectUpdated" && ($.inArray( mod.obj(id).mvcid, new_index ) > -1 ) ){
            LIB.async(
                function(){
                    $( mod ).trigger( "mvc:objectUpdated", id );
                }
            );
        }

    };

    /* todo: add getIndex change */
    $(set).on("mvc:propUpdated:length mvc:objectUpdated mvc:index", indexUpdater);

    $(mod).on("mvc:mod", indexUpdater);

    this.mods[ mod.name ] = mod;

    return mod;
},

filter : function( callback ){
    var set = this,
        modObj = {
            name     : "filter",
            getIndex : function(){
                return set.each(
                    function(){
                        return this.mvcid;
                    },
                    callback
                );
            }
        },

        mod = set.mod(modObj);

        mod.index = modObj.getIndex();

        mod.propset(
          {"length":mod.index.length}
        );

    return mod;
},

sort : function( param, _order ){
    var set    = this,
        modObj = {name: "sort"},
        sorter,
        mod,
        order = _order ? "DESC" : "ASC";

        if (typeof param === "function") {
            sorter = param;
        } else if(typeof param === "string"){
            sorter = function( a, b ){
                return ( a.prop(param) - b.prop(param) ) * (mod.prop("sort:order") === "ASC" ? 1 : -1);
            };
        }

        modObj.getIndex = function(){
            var index = set.index.slice(0);

            index.sort(
                function(a,b){
                    return sorter.call( null, mvcGetByID(a), mvcGetByID(b) );
                }
            );

            return mod.prop("sort:reversed") ? index.reverse() : index;
        };

        mod = set.mod(modObj);

        mod.propset(
            {"sort:order":order}
        );

        mod.reverse = function(){
            mod.prop("sort:order", mod.prop("sort:order") === "ASC" ? "DESC" : "ASC");
        };

        mod.index = modObj.getIndex();

        // todo: перенести в set.mod ?
        $(mod).on(
            "mvc:propUpdated:sort:order",
            function(){
                $(mod).trigger("mvc:mod");
            }
        );

    return mod;
},


pager : function( _num ){//, radius
    var set    = this,
        num    = parseInt( _num , 10 ) || false,
        modObj = { name: "pager" },
        mod;

        if (!num) { throw "mvcSet:pager - incorrect argument"; }

        modObj.getIndex = function(){
            var length = set.prop("pager:total") || set.index.length;
            mod.prop("pager:count", Math.ceil( length / mod.prop("pager:num") ) );
            if ( mod.prop("pager:page") >= mod.prop("pager:count")  ) {
                mod.prop("pager:page", 0 );
            }
            mod.prop("pager:hasnext", (mod.prop("pager:page")+1) < mod.prop("pager:count") );
            mod.prop("pager:hasprev",  mod.prop("pager:page") > 0 );
            return set.index.slice(
                mod.prop("pager:page")*mod.prop("pager:num"),
                (mod.prop("pager:page")+1)*mod.prop("pager:num")
            );
        };

        mod = set.mod(modObj);

        mod.propset( // todo: ?
            {
                "pager:num"     : num,
                "pager:page"    : 0,
                "pager:count"   : 0,
                "pager:hasnext" : false,
                "pager:hasprev" : false,
                "pager:keys"    : false,
                "pager:visited" : "1"
            }
        );


        $(mod).on(
            "mvc:propUpdated:pager:page",
            function(e,p){
                var visited =  mod.prop("pager:visited").split(",");
                //mvc.log("visited",arguments);
                visited[p.value] = 1;
                mod.prop( "pager:visited", visited.join(",") );
                if ( set.prop("pager:total") ){
                    LIB.async(
                        function () {
                            $(set).trigger("mvc:pager:need", p.value );
                        }
                    );
                }
                //mvc.log("pager:visited",mod.prop("pager:visited"));
            }
        );

        $(mod).on(
            "mvc:propUpdated:pager:page mvc:propUpdated:pager:num mvc:propUpdated:pager:keys",
            function(){
                $(mod).trigger("mvc:mod");
            }
        );

        mod.index = modObj.getIndex();
        return mod;
},


/*TODO : tree : function( param ){ },  */

json : function( data , silence ){
    var k, o;
    this.loadflag = silence === true;

    if ( $.isArray( data ) ) {
        for ( k in data ){
            o = data[k];
            if ( "id" in o && typeof o.id === "string"  && $.trim(o.id).length > 0 && $.isPlainObject(o) ) {
                this.obj( o.id ).json( o );
            }
        }

    } else if ( $.isPlainObject( data ) ) {
        for ( k in data ){
            if ( $.trim(k).length > 0 ) {
                this.prop( k, data[ k ] );
            }
        }
    }

    delete this.loadflag;

    return this;
},

del  : function( id ){

    var _o = mvcGetByID( id );

    if (_o !== mvc) {
        return _o.parent().del( _o.id );
    }

    if ( _mvc.obj.has( this.mvcid, id ) ) {

        //mvc.log("---DELETE---",id);

        this.obj(id).unblockAll();

        var _id = _mvc.obj._mvcid(this.mvcid,id);

        delete _mvc.obj.s[_id];

        var index=[];

        for ( var i=0; i<this.index.length; ++i ){
            if ( this.index[i] !== _id ) {
                index.push( this.index[i] );
            }
        }

        this.index = index;

        // delete props
        for (var p in _mvc.prop.s){
            if ( p.indexOf( id + mvcDelim + "prop" + mvcDelim ) !== -1 ) {
                delete _mvc.prop.s[p];
            }
        }
        $(this).trigger(
            "mvc:objectDeleted",
            [{type:"obj",id:id}]
        );
    }
},

empty: function(){
    var index = this.index.slice(0);
    for(var i in index){
        this.del(
            index[i]
        );
    }
}

};

LIB.merge.call( mvcSet, mvcBlockable );