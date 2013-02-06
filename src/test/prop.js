test(
    "mvc.prop",
    function () {


        ok(  $.isFunction( mvc.prop                            ) , "mvc.prop");
        ok(  $.isFunction( mvc.obj("core-prop-obj").prop       ) , "mvc.obj( ).prop");
        ok(  $.isFunction( mvc.set("core-prop-set").prop       ) , "mvc.set( ).prop");
        ok(  $.isFunction( mvc.module("core-prop-module").prop ) , "mvc.module( ).prop");

        strictEqual( mvc.prop("mvc.prop") , null , "Use null instead undefined");

        equal( mvc.prop("string",  testData["prop"]["string" ]) , testData["prop"]["string" ] , "mvc.prop-string setter" );
        equal( mvc.prop("number",  testData["prop"]["number" ]) , testData["prop"]["number" ] , "mvc.prop-number setter" );
        equal( mvc.prop("boolean", testData["prop"]["boolean"]) , testData["prop"]["boolean"] , "mvc.prop-boolean setter");
        
        deepEqual( mvc.snapshot , testData["prop"] , "mvc.snapshot");
        
    }
);