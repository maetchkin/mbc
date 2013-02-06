var mvcObj    = {

type : "obj",

init: function(){
    var obj = this,
        ID  = obj.id,
        p   = obj.parent();
    obj.selectorID = "#"+ID.replace(/%/g,"\\%").replace(/:/g,"\\:");
    $( obj ).on(
        "mvc:propUpdate",
        function(e,propid){
            if (p && !("loadflag" in p)) {
                var up = {};
                up[propid] = obj.prop(propid);
                //console.log("proxy mvc:objectUpdated from "+this.id+" to "+p.id);
                $(p).trigger("mvc:objectUpdated", [ID,up] );
            }
        }
    );
},

prop : function(id){
    return mvcStorage.apply( this,[id,_mvc.prop] ).get(arguments); // todo: arguments
},

get  : function(){ // todo: arguments
    if (0 in arguments && 1 in arguments[0]) {
        var conf         = arguments[0][1][0],
            data         = arguments[0][1][1],
            updatedProps = arguments[0][1][2] || {};

        for (var p in conf){
            if ( (p-1) >= -1 ) { // todo
                this.prop( conf[p], data[p-(-1)], updatedProps );
            }
        }
    }
    return this;
},

json : function( json ){
    for (var prop in json) {
        switch ( typeof json[prop]) {
            case "string"   : this.prop( prop, json[prop] ); break;
            case "number"   : this.prop( prop, json[prop] ); break;
            case "boolean"  : this.prop( prop, json[prop] ); break;
            case "function" : this[prop] = json[prop];       break;
            default: break;
        }
    }
    return this;
},

html : function( _class ){
    return _class ? window.$(this.selectorID).find("."+_class) : window.$(this.selectorID);
}

};

LIB.merge.call(mvcObj, mvcBlockable);