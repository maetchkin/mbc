var mvcProp   = {

    type  : "prop",

    value : null,

    toString:function(){
        return this.value;
    },

    get  : function(){ // getter todo arguments
        //mvc.log("mvcProp get", arguments);
        if (0 in arguments && 1 in arguments[0] && arguments[0][1] !== this.value) {
            var prop   = this,
                old    = prop.value,
                obj    = this.parent() || mvc;

            prop.value = arguments[0][1];

            ///console.log ( prop );

            if (2 in arguments[0]) {
                arguments[0][2][this.id] = arguments[0][1];
                arguments[0][2].length++;
            }

            if ( !("snapshot" in obj)) {
                obj.snapshot = {};
            }
            obj.snapshot[prop.id] = prop.value;

            $(obj).trigger("mvc:propUpdate", [prop.id] );
            $(obj).trigger("mvc:propUpdated:"+prop.id,[prop,old]);


            //mvc.log("------------mvc:propUpdated:"+prop.id," ",this.pid,this.parent() );


        }
        return this.value;
    }

};