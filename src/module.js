var mvcModule = {

    type: "module",

    init: function () {
        mvcModulizer( this );
        return true;
    },

    load: function () { // todo: mv path to config
        var module  = mvc.set("mvc-modules").obj( this.id ),
            sum     = module.prop("jsmd5"),
            config  = mvc.obj("mvc-config").snapshot,
            dynpath = config["dynamic-path"] || "",
            mpath   = sum ? "/" + module.prop("path") + "/static/modules/" : dynpath + "/mvc/modules/",
            key     = mpath + module.id,
            src     = key   + (sum ? "." + sum + ".js" : ".js?_=" + Math.random());
            src     = config.cdn ? config.cdn + src : src;
        return LIB.load.script( src, key, sum );
    },

    prop: function ( id, value ) {
        value = value ? value : null;
        return mvcStorage.apply(this, [id, _mvc.prop]).get(arguments); // todo: arguments
    }

};