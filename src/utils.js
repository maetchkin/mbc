var HTML = {
    head:document.getElementsByTagName("head").item(0),
    body:document.body
};

var LIB = (

  function( w, mvc ){

    var lib = {},

        resolved = $.Deferred().resolve().promise();


    // обертка для асинхронного вызова
    lib.async = function(cb){
        return window.setTimeout(cb,4);
    };

    // копирование свойств в контекст
    lib.merge = function(src){
        var m;
        for (m in src){
            this[m] = src[m];
        }
        return this;
    };

    // присвоение функции уникального идентификатора,
    // возвращает функцию по идентификатору
    var funcsArr   = {},
        funcsCount = 0;

    lib.functionID = function( func ){
        if ( typeof func === "function" ) {
            if ( "id" in func ) {
                return func;
            }else{
                func.id = funcsCount++;
                funcsArr[func.id] = func;
                return func;
            }
        } else if (typeof func === "string" && func in funcsArr){
            return funcsArr[func];
        }
        throw "LIB.functionID: incorrect argument type " + (typeof func);
    };

    // Асинхронная загрузка статики из localStorage
    var ls = "localStorage",
        lsCache = {},
        mvcCachePrefix = "mvc.cache:";

    lib.ls = ls = (ls in w) ?
                    (
                    function( ls ){
                        try {

                            var uid = new Date(), _uid;
                            ls.setItem(uid,uid);
                            _uid = ls.getItem(uid);
                            ls.removeItem(uid);
                            return uid === _uid ? ls : false;

                        } catch( errorLs ) {
                            try {
                                ls.clear();
                            } catch ( errorLsClear ) {
                                // enjoy the silence, bro
                            }
                            return false;
                        }
                    }
                    )
                    (
                        w[ls]
                    )

                :
                    false;

    if ( ls !== false ){
        $( mvc ).on(
            "mvc:resources",
            function(){
                try {
                    for (var k in ls){
                        if ( k.indexOf( mvcCachePrefix ) === 0 ) {
                            lsCache[ k ] = ls.getItem( k );
                        }
                    }
                } catch ( errorLsCache ) {
                    lsCache = false;
                }
                //console.log( "lsCache",lsCache );
            }
        );
    }

    // вытаскиваем код аяксом
    var loadStaticAsync = function ( src ) {
        return $.ajax(
                    {
                        url:      src,
                        dataType: "text"
                    }
                )
                /*.fail(
                    function(){
                        throw "mvc.lib.loadStaticAsync " + src + " failed";
                    }
                )*/
                .promise();
    };

    // на каждый кусок кода вешаем Deferred
    var evalCode = function (mkey, loader, code ){
            mvc.dfd_cache[mkey] = $.Deferred();
            lib.async(
                function(){
                    loader( code, mkey );
                }
            );
            return mvc.dfd_cache[mkey].promise();
    };

    var loadStatic = function ( loader ) {
        return function(src, key, sum){
            var mkey,
                msum,
                _msum = false,
                code = false;

            if ( ls && sum) {
                mkey  = key ? mvcCachePrefix + key : false;
                msum  = sum ? mvcCachePrefix + sum : false;

                try {
                    _msum = lsCache[mkey];
                    if ( _msum === msum ) {
                        code = lsCache[msum];
                    }
                }
                catch ( errorLsCacheAccess ) {

                }


                if ( code !== false && _msum !== false ) {
                    try {
                        return evalCode(mkey, loader, code );
                    }
                    catch ( errorEvalCode ) {
                        return false;
                    }


                    /* TODO:  https://github.com/doochik/SafeLS https://github.com/marcuswestin/store.js */

                } else {

                    try {
                        ls.removeItem( mkey );
                        ls.removeItem( _msum );
                    }
                    catch ( errorLsCacheRemove ) {

                    }

                    var process = $.Deferred();

                    loadStaticAsync( src )
                        .done(
                            function( data ) {
                                try {
                                    ls.setItem(mkey, msum);
                                    ls.setItem(msum, data);
                                }
                                catch ( errorLsCacheSetItem ) {

                                }
                                evalCode(mkey, loader, data )
                                    .done(
                                        function(){
                                            process.resolve();//mvc.log("1 evalCode done",src);
                                        }
                                    )
                                    .fail(
                                        function(){
                                            process.reject();//mvc.log("1 evalCode fail",src);
                                        }
                                    );
                            }
                    );

                    return process.promise();
                }
            } else {
                return loadStaticAsync( src ).done( loader );
            }
        };
    };

    // кроссбраузерная загрузка кода
    lib.load = {
        script : loadStatic(
            function( _code, _mkey ){/* mvc.log("prnum",""+mkey+"",mvc.dfd_cache[""+ mkey +""].isResolved());*/
                var mkey = _mkey.indexOf( mvcCachePrefix ) !== -1 ? _mkey : false,
                    code = _code + (mkey ? ";mvc.dfd_cache[\""+ mkey +"\"].resolve();" : "");

                try {
                    if ( $.browser.msie ) {
                        window.execScript( code );
                    } else if ( $.browser.opera ) {
                        eval.call( w, code );
                    } else {
                        var script = document.createElement("script");
                            script.setAttribute("type", "text/javascript");
                            script.setAttribute("charset", "utf-8");
                            script.innerHTML = code;
                            HTML.head.insertBefore(script, HTML.head.firstChild);
                    }
                } catch (e) {
                    if (mkey) {
                        mvc.dfd_cache[mkey].reject();
                    } else {
                        mvc.log("Exeption:lib.load.script ",e);
                    }
                }
            }
        ),
        style : loadStatic(
            function( code, _mkey ){
                var mkey = _mkey.indexOf(mvcCachePrefix) !== -1 ? _mkey : false,
                    style = document.createElement("style");
                HTML.head.appendChild(style);
                if ( style.styleSheet ) { // IE
                    style.styleSheet.cssText = code;
                } else {
                    style.appendChild( document.createTextNode(code) );
                }
                if (mkey) {
                    mvc.dfd_cache[mkey].resolve();
                }
            }
        ),
        i18n : function( keyset, _project ){ // todo: project, build without i18n
            var project = _project || mvc.obj("mvc-config").prop("project"),
                i18n_id = project + "." + keyset,
                d_ks    = mvc.set("mvc-i18n").obj(i18n_id),
                md5     = d_ks.prop("md5"),
                load    = d_ks.prop("load"),
                config  = mvc.obj("mvc-config").snapshot,
                lang    = config.lang || "ru",
                cdn     = config.cdn  || "";

            return load === true ? resolved : lib.load.script.apply(
                    window,
                    md5 ? [ cdn + "/_c/i18n/"+lang+"/"+i18n_id+"."+md5+".js", "i18n/"+lang+"/"+project+"/"+keyset , md5 ]
                        : [ "/i18n/"+lang+"/"+i18n_id+".js?_="+Math.random() ]
                )
                .done(
                    function(){
                        //mvc.log("mvc-i18n done",i18n_id);
                        d_ks.prop("load",true);
                    }
                )
                .promise();
        }
    };


    // обёртка для загрузки данных аяксом
    var mvcDataSignCounter = 0;

    lib.load.data = function( options ){
        var dfd = $.Deferred(),
            sign = options.sign || mvcDataSignCounter++,
            sk   = (mvc.obj("mvc-config").prop("use-sk") === true ? mvc.obj("user").prop("sk") : false) ,
            ajax;


        options.dataType = "script";

        options.cache    = options.cache || false;

        if (options.type === "POST") {
            /*mvc.log( "options.data", options.data )*/
            if ( typeof options.data === "string" ) {
                options.data += "&mvcDataLoadSignature=" + sign +( sk ? "&sk=" + sk : "" );
            } else if( typeof options.data === "object" ) {
                options.data.mvcDataLoadSignature = sign;
                options.data.sk = sk;
            }

        } else {
            options.url += (options.url.indexOf("?") === -1 ? "?": "&") + "mvcDataLoadSignature="+sign +(sk?"&sk="+sk:"");
        }

        ajax = $.ajax( options )
                .fail(
                    function(){
                        dfd.rejectWith( ajax );
                    }
                );

        $( mvc ).one(
            "mvc:dataLoad:"+sign,
            function(){
                dfd.resolveWith( ajax );
            }
        );
        // mvc.log("dfd",options,dfd);
        return dfd.promise();
    };

    return lib;

})
(window,mvc);