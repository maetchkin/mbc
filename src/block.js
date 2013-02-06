var mvcBlock = {
    type : "block",

    init : function(){
        this.slots       = [];
        this.propbind    = {};
        this.pBlockMVCID = null;

        $(this).on(
            "mvc:objectCreated",
            function (e,obj) {
                if (obj.type === "slot") {
                    //mvc.log("mvcBlock mvc:objectCreated slot",this,arguments);
                    this.slots.push(obj.mvcid);
                }
          }
        );
    },

    done   : function() {
        return this.rendering.done.apply(this,arguments);
    },
    fail   : function() {
        return this.rendering.fail.apply(this,arguments);
    },

    prop   : function(id) {
        return mvcStorage.apply(this,[id,_mvc.prop]).get(arguments);
    },

    unblock : function( flag ){
        var block       = this;

        //mvc.log("___b_UNBLOCK\n      block.mvcid=", block.mvcid ,"\n      block.parent().id=", block.parent().id);

        for (var s in block.slots){
            _mvc.slot.s[ block.slots[s] ].unblock();
            delete _mvc.slot.s[ block.slots[s] ];
        }

        $( block ).off();

        if (flag && block.pBlockMVCID) {
            delete block._slot().blocks[block.pid];
        }
        if ("unbindDataListener" in block) {
            try {
                block.unbindDataListener();
                block.node.remove();
            } catch (e) {
                //mvc.log("remove ex:block.id", block.id);
                //mvc.log("remove ex:block", block);
                //mvc.log("remove ex:e", e);
            }
        }

        for (var p in _mvc.prop.s){
            if ( p.indexOf(block.mvcid+mvcDelim+"prop"+mvcDelim) !== -1 ) {
                _mvc.prop.s[p] = null;
                delete _mvc.prop.s[p];
            }
        }

        _mvc.block.s[block.mvcid]=null;
        delete _mvc.block.s[block.mvcid];
        return true;
    },

    applyTemplates: function( arg ){
        arg.template = arg.name;
        arg.id       = "apply-" + arg.view + "-" + arg.template + "-" + this.parent().id.replace( /:/gi,"_"); //(mvcSlotCounter++);
        return this.slot(arg);
    },

    callTemplate: function( arg ){
        arg.template = arg.name;
        arg.callFlag = true;
        arg.id       = "call-" + arg.view + "-" + arg.template + "-" + this.parent().id.replace( /:/gi,"_"); //+ "-" + (mvcSlotCounter++);
        return this.slot(arg);
    },

    slot : function( arg ){
        var obj = (typeof arg === "string") ? {id:arg,tag:"div"} : arg,
            slot = mvcStorage.apply(this, [ obj.id, _mvc.slot ]);
        return LIB.merge.call(slot,obj);
    },

    getter : function(getter){
        var view = this._view();
        if ("block_methods" in view && getter in view.block_methods) {
            var args = [];
            for (var i=1; i<=arguments.length; i++){
                if (arguments[i]!==undefined) {
                    this.propbind[ arguments[i] ] = true;
                    args.push(
                        this.parent().prop( arguments[i] )
                    );
                }
            }
            return view.block_methods[getter].apply(this,args);
        } else {
            //mvc.log("getter",view);
            return "";
        }
    },

    initJS: function(){
        var template = this._template(),
            initMethod = template && template !== "default" ? "initBlock_"+template : "initBlock"; // todo: mv to {_:f(){},init:f(){}}
        if ( initMethod in this._view() ) {
            return this._view()[initMethod](this);
        }
    },

    data : function(src,prop){
        switch (src) {
                case "prop":
                    this.propbind[prop] = true;
                    var val = this.parent().prop(prop);
                    return val !== null ? val : "";
                case "b-prop":
                    return (prop in this.parent() ? this.parent()[prop] : "" );
                case "getter":
                    return this.getter.apply(this, prop.split(","));
                /*case "i18n":
                    var k = prop.split(",");
                    return this.i18n(k[0],k[1]);*/
                case "param":
                    //mvc.log("block:data ",this._slot());
                    return ( ("params" in this._slot()) && (prop in this._slot().params) ) ? this._slot().params[prop] : "";
                default:
                    throw   "block.data undefined method " + src;
            }
        return "";
    },

    i18n: function(keyset,key){
        var src = window.i18n[ mvc.obj("mvc-config").prop("project") ][ keyset ];
        return (src && key in src)?(src[key])():(mvc.obj("mvc-config").prop("logger")?"--i18n."+keyset+"."+key+"--":"");
    },

    _render: function(){
        var block    = this,
            template = block._template(),
            view     = block._view(),
            slot     = block._slot(),
            dfd      = block.rendering,
            node     = block.node,
            i18n     = window.i18n[ mvc.obj("mvc-config").prop("project") ];

        //mvc.log("___b_render_START \n      data.id=", data.id,"\n      block.id=", block.mvcid);

        if ( template in view.storage ) {

            slot[ node ? "replace" : "insert"] ( block, $( view.storage[template]._.call( block, i18n ) ) );

            $.when.apply(
                null,
                $.map(
                    block.slots,
                    function(mvcid){
                        return mvcGetByID(mvcid).render();
                    }
                )
            )
            .done(
                function(){
                    block.initJS();
                    //mvc.log("___b_render_COMPLETE \n      data.id=", data.id,"\n      block.id=", block.mvcid);
                    dfd.resolveWith( block );
                }
            )
            .fail(
                dfd.reject
            );

        } else {
            dfd.reject();
            throw "no template " + template + " in view " + view.id;
        }
        return true;
    },

    _view  : function(){
        return mvc.view( ( this.id.split(":") )[0] );
    },

    _template  : function(){
        return (this.id.split(":"))[1];
    },

    _slot  : function(){
        //mvc.log("_slot", this.pBlockMVCID,  this.id.split(":")); //!
        if ( this.pBlockMVCID && this.pBlockMVCID !== "mvc" ) {
            return mvcGetByID(this.pBlockMVCID).slot((this.id.split(":"))[2]);
        } else {
            return mvc.slot((this.id.split(":"))[2]);
        }
    },

    get  : function(){ // todo: arguments

        if ( arguments[0].length === 1 ) {
            return this;
        }

        var block = this;

        if ( !block.rendering ) {
        //    throw "block already has rendering promise"
        //} else {
            block.rendering = $.Deferred();
        }


        //dfd   = $.Deferred(),

        if (1 in arguments) {
            block.pBlockMVCID = arguments[1];
        }



        LIB.async(
            function() {
                block
                    ._view()
                    .cast( "render", block.mvcid )
                    .fail(
                        function(){
                            return block.rendering.rejectWith( block );
                        }
                    );
            }
        );

        return $.extend(
            true,
            {
                on : function(){
                    $.fn.on.apply( $(block.ev), arguments );
                    return this;
                }
            },
            block,
            block.rendering.promise()
        );
    }
};