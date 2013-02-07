QUnit.config.testTimeout = mvc.obj("mvc-config").prop( "module-timeout-ms" )*2;

var m_getter  = "mvc.module(\"modulizer\")",
    mvcModule;

test(
    "core-module mvc.module( ) throws",
    function () {
            throws(
                function () {
                    return mvc.module();
                },
                "Empty ID: mvc.module(); throws exception"
            );

            throws(
                function () {
                    return mvc.module( "."-1 );
                },
                "Empty ID: mvc.module( NaN ); throws exception"
            );

            throws(
                function () {
                    return mvc.module( [] );
                },
                "Empty ID: mvc.module( [] ); throws exception"
            );

            throws(
                function () {
                    return mvc.module( {} );
                },
                "Empty ID: mvc.module( {} ); throws exception"
            );

            throws(
                function () {
                    return mvc.module( null );
                },
                "Empty ID: mvc.module( null ); throws exception"
            );

            throws(
                function () {
                    return mvc.module( true );
                },
                "Empty ID: mvc.module( true ); throws exception"
            );

            throws(
                function () {
                    return mvc.module( false );
                },
                "Empty ID: mvc.module( false ); throws exception"
            );
    }
);


test(
    "core-module init",
    function () {
        mvcModule = mvc.module('modulizer', testData["modulizer"] );
        strictEqual( mvcModule, (new Function("return " + m_getter))() , m_getter + " works" );
        equal(  typeof mvcModule, "object", "Module isObject");
    }
);

test(
    "core-module props",
    function () {
        equal( mvcModule.mvcid, "mvc~module~modulizer",  m_getter + ".mvcid is correct");

        equal( mvcModule.pid,   "mvc",                   m_getter + ".pid   is correct");

        equal( mvcModule.type,  "module",                m_getter + ".type  is correct");

    }
);

test(
    "core-module interface",
    function () {

        ok(  $.isFunction( mvcModule.get    ) , m_getter + ".get       exists");

        ok(  $.isFunction( mvcModule.cast   ) , m_getter + ".cast      exists");

        ok(  $.isFunction( mvcModule.init   ) , m_getter + ".init      exists");

        ok(  $.isFunction( mvcModule.load   ) , m_getter + ".load      exists");

        ok(  $.isFunction( mvcModule.parent ) , m_getter + ".parent    exists");

        ok(  $.isFunction( mvcModule.prop   ) , m_getter + ".prop      exists");

    }
);

test(
    "core-module json constructor",
    function () {
        testData["modulizer"].foo = function(){
            return this.bar + ":" + this.id;
        };
        mvcModule = mvc.module('modulizer', testData["modulizer"] );

        ok(  "bar" in mvcModule , m_getter + ".bar      exists");
        equal(  mvcModule.bar, testData["modulizer"].bar, m_getter + ".bar ");

        ok(  "foo" in mvcModule , m_getter + ".foo      exists");
        ok(  $.isFunction( mvcModule.foo ), m_getter + ".foo is function");

        equal(  mvcModule.foo() , "value:modulizer", m_getter + ".foo is method");

    }
);

asyncTest(
    "asynchronous loading",
    function() {

        var promise = mvc .module("modulizer-async").load();

            promise.done(
                function(){
                    ok(  true , "modulizer-async - loaded");
                    start();
                }
            );

    }
);

asyncTest(
    "loading not exists module",

    function() {

        mvc .module("modulizer-not-exits")
            .load()
            .fail(
                function(){
                    start();
                    ok( true, "modulizer-not-exits fails");
                    equal( this.prop("status"), "error", "prop(status) is 'error'");
                }
            );
    }
);

asyncTest(
    "asynchronous loading with sync-init",
    function() {

        var promise = mvc .module("modulizer-async-init-sync").load();            

            var mt = setTimeout(
                function(){
                    ok( false, "modulizer-async-init-sync timed out");
                    return start();
                },
                mvc.obj("mvc-config").prop( "module-timeout-ms" )
            );


            promise.done(
                function(){
                    start();
                    clearTimeout(mt);
                    equal( this.state, "loaded", "synchronously inited");
                    equal( this.prop("status"), "ready", "prop(status) is 'ready'");
                }
            )
            .fail(
                function(){
                    start();
                    clearTimeout(mt);
                    ok( false, "modulizer-async-init-sync failed");
                }
            );
    }
);
/*
asyncTest(
    "asynchronous loading with asynchronous init",
    function() {
        //stop();
        var promise = mvc .module("modulizer-async-init-async").load();

            promise.done(
                function(){
                    equal( this.state, "loaded", "asynchronously inited");
                    start();
                }
            );
    }
);*/