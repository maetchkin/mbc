mvc.module(
    "modulizer-async-init-async",
    {
        init: function(){
            setTimeout(
                function(){ this.state = "loaded" }
            );
            return false;
        }
    }
);