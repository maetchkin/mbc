test(
    "check methods",
    function () {
        ok(  $.isFunction( mvc.obj       ) , "obj       exists");
        ok(  $.isFunction( mvc.set       ) , "set       exists");
        ok(  $.isFunction( mvc.prop      ) , "prop      exists");
        ok(  $.isFunction( mvc.module    ) , "module    exists");
        ok(  $.isFunction( mvc.data      ) , "data      exists");
        ok(  $.isFunction( mvc.getI18N   ) , "getI18N   exists");
        ok(  $.isFunction( mvc.getScript ) , "getScript exists");
        ok(  $.isFunction( mvc.load      ) , "load      exists");
        ok(  $.isFunction( mvc.log       ) , "log       exists");
    }
);