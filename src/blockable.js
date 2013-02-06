/*
Блоковый API для data-объектов
*/
var mvcBlockable = {

/*
метод создания блока
view - объект типа mvc.view
slot - место, куда вставить результат. Либо $( selector ), либо mvc.slot внутри блока
возвращает mvc.block с $.promise

пример

mvc.set("items")
    .block( mvc.view("list"), $("#container") )
    .done(
            function(){
                $( this ).on(
                    "mvc:action:actionName",
                    function(){
                        // action callback
                    }
                );
            }
         );
*/
    block : function( view, _slot ){

        var template, slot, blockID;

        if ( arguments.length === 2 ) {
            template = ( (view && ("mvcid" in view) ) ? "default": view.template ),
                slot     = ("mvcid" in _slot && _slot.type === "slot") ? _slot : mvcMakeSlot( _slot ),
                blockID  = view.id +":"+ template +":"+ slot.id;

            //mvc.log("BLOCK ", this.id, blockID);
                this.unblock( this.mvcid+mvcDelim+blockID );



            return mvcStorage.apply( this, [blockID, _mvc.block  ]).get(arguments, slot.pid ); // todo arguments
        } else if ( arguments.length === 1 ) { // ?

            //mvc.log("GET BLOCK", blockID);
            return mvcStorage.apply( this, [ arguments[0], _mvc.block  ] );
        }

        throw "mvc.block - incorrect arguments";
    },

    unblock : function( blockID ){
        if ( blockID && blockID in _mvc.block.s ) {
            //mvc.log("UNBLOCK ", blockID);
            return _mvc.block.s[ blockID ].unblock( true );
        }
        return false;
    },

    unblockAll : function(){
        //mvc.log("UNBLOCK-ALL ", this.id);
        for (var b in _mvc.block.s ) {
            if ( _mvc.block.s[b].pid === this.mvcid ) {

                this.unblock(
                    _mvc.block.s[b].mvcid
                );
            }
        }
        return this;
    }
};