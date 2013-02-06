
window.i18n = window.i18n || {};

var mvcView   = {

type: "view",

init: function(){
    mvcModulizer(this);
    return true;
},

i18n: function( ){
    var view_id = this.id,
        defs = [],
        i;

    for ( i = 0; i < arguments.length; i++ ) {
        defs.push(
            mvc.getI18N(
                arguments[i]
            )
        );
    }

    return $.when
            .apply( $, defs )
            .fail (
                function(){
                    throw "i18n for view[" + view_id + "] failed";
                }
            )
            .promise();
},

template: function ( id ) {
    return {
        template: id,
        id:       this.id
    };
},

render: function ( blockID ) {
    //mvc.log("----RENDER---- ", this.id, " status=", this.prop("status") );
    var block   = mvcGetByID( blockID ),
        view    = this;

    //mvc.log("mvcView:render " + block.id );
    if ("render" in block) {

        //mvc.log("_v__p__rendering " + block.id, block.parent().id, block.prop("rnrTimeout")   );

        window.clearTimeout(
            block.prop("rnrTimeout")
        );

        block.prop(
            "rnrTimeout",
            window.setTimeout(
                function() {
                    block._render();
                },
                10 // todo: config
            )
        );

        return block.prop("rnrTimeout");
    } else {
        //mvc.log("_v__i__rendering " + block.id, block.parent().id );
        block.render = function ( e, prop ) {
            var block = mvcGetByID( blockID );
            if ( prop in block.propbind ) {
                //mvc.log("_v__r__rendering " + block.id, block.parent().id, " event=", e.type, ( e.type == "mvc:propUpdate" ? prop : prop ) );
                return view.render( blockID );
            }
            return true;
        };

        $( block.parent() ).on(
            "mvc:propUpdate",
            block.render
        );

        block.unbindDataListener = function(){
            var block = mvcGetByID( blockID );
            $( block.parent() ).off(
                "mvc:propUpdate",
                block.render
            );
        };

        return view.render( blockID );
    }
    return true;
},

style: function (flag) {
    if (flag) {
        var view     = mvc.set("mvc-views").obj(this.id),
            config   = mvc.obj("mvc-config").snapshot,
            src      = view.prop("cssmd5")  ? ( config.cdn || "" ) + view.key + "/" + view.id + "." + view.prop("cssmd5") + ".css" : config["view-builder-path"] + "?template=" + this.id + "&style=true&_=" + Math.random();
            return LIB.load.style( src, (view.key ? view.key + ":css" : false ), view.prop("cssmd5") );
    }
    return true;
},

load: function () {
    var view     = mvc.set("mvc-views").obj(this.id),
        config   = mvc.obj("mvc-config").snapshot,
        src;
        view.key = false;
    if ( view.prop("jsmd5") ) {
        view.key   = "/" + view.prop("path") + "/static/views/" + view.id;
        src   = ( config.cdn || "" ) + view.key + "/" + view.id + "." + view.prop("jsmd5") + ".js";
    } else {
        src   = mvc.obj("mvc-config").prop("view-builder-path") + "?template=" + view.id + "&_=" + Math.random();
    }
    return LIB.load.script( src, (view.key ? view.key+":js" : false), view.prop("jsmd5") );
},

prop : function(id){
    return mvcStorage.apply( this, [ id, _mvc.prop ] ).get( arguments ); // todo: arguments
}

};