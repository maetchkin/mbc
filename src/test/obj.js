test(
    "mvc.obj( ) throws",
    function () {
        throws(
                function () {
                    return mvc.obj();
                },
                "Empty ID: mvc.obj(); throws exception"
            );

            throws(
                function () {
                    return mvc.obj( "."-1 );
                },
                "Empty ID: mvc.obj( NaN ); throws exception"
            );

            throws(
                function () {
                    return mvc.obj( [] );
                },
                "Empty ID: mvc.obj( [] ); throws exception"
            );

            throws(
                function () {
                    return mvc.obj( {} );
                },
                "Empty ID: mvc.obj( {} ); throws exception"
            );

            throws(
                function () {
                    return mvc.obj( null );
                },
                "Empty ID: mvc.obj( null ); throws exception"
            );
            
            throws(
                function () {
                    return mvc.obj( true );
                },
                "Empty ID: mvc.obj( null ); throws exception"
            );
            
            throws(
                function () {
                    return mvc.obj( false );
                },
                "Empty ID: mvc.obj( null ); throws exception"
            );
    }
);

test(
    "mvc.obj( id )",
    function () {

        //expect(10);

        testData["obj"]["propFunc"]=function(){ };

        var data = testData["obj"],
            obj,
            res;



            



            obj = mvc.obj( data.id );

            /* test json method */
            try {
                res  = mvc.obj( data.id ).json(data);
            } catch ( e ){
                res  = false;
            }


            /* test id */
            strictEqual( obj.id, data.id, "mbc.obj.id");

            /* check json method result */
            strictEqual( obj, res, "mbc.obj.json( data );");


            strictEqual( obj.prop("propString") , data["propString"], "mbc.obj.prop( <String> )");
            strictEqual( obj.prop("propNumber") , data["propNumber"], "mbc.obj.prop( <Number> )");
            strictEqual( obj.prop("propBool"),    data["propBool"],   "mbc.obj.prop( <Bool>   )");


            /* check json.method to mbc.obj.method */
            strictEqual( obj["propFunc"],         data["propFunc"],   "mbc.obj.propFunc");

            /* check prop(<Array>) & prop(<Object>)*/
            notEqual   ( obj["propArray"],  data["propArray"] , "mbc.obj hasn't propArray");
            notEqual   ( obj["propObject"], data["propObject"], "mbc.obj hasn't propObject");

            /* test mvcid */
            strictEqual( obj.mvcid, "mvc~obj~" + data.id, "mbc.obj.mvcid");

            /* test pid */
            strictEqual( obj.pid, "mvc", "mbc.obj.pid");
// ---------------------------------------------------------------------------------------------------
            /* test selector */
            strictEqual( obj.selectorID, "#"+data.id, "mbc.obj.selectorID");

            /* test html method */
            deepEqual( obj.html(), $("#"+data.id), "mbc.obj.html()");
            deepEqual( obj.html("inner"), $("#"+data.id).find(".inner"), "mbc.obj.html(\"inner\")");
    }
);