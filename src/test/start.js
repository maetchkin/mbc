(function( $, mvc ) {

"use strict";

module("mbc core");

window.testData = {};

function moduleTeardown (  ) {

}

function setup ( path, module ) {
    return (function(){
        
        if (module in testData){
            return true;
        }

        $.ajax(
            {
                url: "/src/test" + path + "on",
                async: false,
                dataType: "json"
            }
        )
        .done(
            function ( result ) {
               testData[ module ] = result;
            }
        )
        .fail(
            function ( ) {
               console.log( "no test data for " + module, [].slice.call(arguments,0) ); 
            }
        );

        return true;

    });
}

test(
    "mbc init test",
    function () {
        ok(  mvc ? true : false , "mbc exists");
    }
);