/**
@copyright Bogdan Maetchkin @DATE
@version @VERSION
@module mbc
**/


(

function( $, window, document ){

    "use strict";
// болванка для глобального объекта mvc
var mvc = {
        mvcid: "mvc",
        ev: {i:"events"},
        dfd_cache : {}
    },
    _mvc,
    mvcDelim = "~",
    mvcModeDelim = "::";