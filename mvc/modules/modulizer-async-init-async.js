 mvc.module(
    "modulizer-async-init-async",
    {
        init: function(){
            setTimeout(
                function(){
                    mvc.module("modulizer-async-init-async").prop("status","ready");
                },
                500
            );
            return false;
        }
    }
);