var mvcModulizer = function ( module ) {

    var moduleLoad  = ("load" in module) ? module.load : null,
        moduleTimer = null,
        moduleInit  = null;

    var dfd = $.Deferred();
    // debug
    dfd.done(
        function () {
        //mvc.log("module ready",this);
        }
    );

    dfd.fail(
        function () {
            mvc.log("module "+this.type+":"+this.id+" load failed m-s="+module.prop("status"));
            module.prop("status", "error");
        }
    );

    var resolve = function () {
        return dfd.resolveWith( module );
    };

    var reject = function () {
        return dfd.rejectWith( module );
    };

    $( module )
        .on(
            "mvc:propUpdated:status",
            function () {
                if ( module.prop("status") === "ready" ) {
                    return resolve();
                } else if (module.prop("status") === "error") {
                    return reject();
                }
            }
        );

    module.cast = function ( method ) {

        if ( !arguments.length ) { // todo:  arguments
            throw "mvc.module.cast: no arguments";
        }

        var cast     = $.Deferred(),
            rejecter = function () {
                return cast.rejectWith( module );
            },
            args     = ([]).slice.call(arguments,1),
            cast_method  = function(){
                            if (typeof method === "string") {
                                if (!(method in module)) {
                                    throw "mvc.module.cast: method["+method+"] not defined in module["+module.id+"]";
                                }
                            } else if(typeof method === "function"){
                                return method;
                            } else {
                                throw "mvc.module.cast: incorrect method argument";
                            }
                            return module[method];
                        };

            //mvc.log("module.cast method=",method," args=",args);

            LIB.async(
                function () {
                    module
                        .load()
                        .done(
                            function(){
                                var res = cast_method().apply(module, args);
                                if ( res instanceof Object && "promise" in res ) {
                                    res.done(
                                        function(){
                                            cast.resolveWith(this, arguments);
                                        }
                                    ).fail(
                                        rejecter
                                    );
                                    cast.pipe( res );
                                } else {
                                    cast.resolveWith(module, [res]);
                                }
                            }
                        )
                        .fail(
                            rejecter
                        );
                }
            );

        return cast.promise();
    };




    module.load = function () {
        if (moduleTimer === null) {
            moduleInit  = null;
            moduleTimer = window.setTimeout(
                function () {
                    if ( moduleTimer ) {
                        throw "moduleTimer " + module.id;
                    }
                },
                mvc.obj("mvc-config").prop( module.type + "-timeout-ms" )
            );

            moduleLoad
                .call( module )
                .fail( reject );

        }
        //mvc.log("load ",module.type," ",module.id);
        return dfd.promise();
    };

    module.get = function (  ) { // todo: arguments
        
        var arg = 1 in arguments[0] ? arguments[0][1] : null;

        if ( arg ) {

            /*console.log ("module.get( arg )", arg);*/

            if ( moduleTimer ) {
                window.clearTimeout( moduleTimer );
            }

            LIB.merge.call( module, arg );

            var initRes = ("init" in module ? module.init() : true);

            //mvc.log("initRes", module, initRes);

            if ( initRes === true) {
                resolve();
            } else if(initRes === false || initRes === void(0) ){

               module.initRes = initRes;

            } else if("done" in initRes){
                initRes
                    .done( resolve )
                    .fail( reject  );
            }
        }
        return module;
    };

    return module;
};