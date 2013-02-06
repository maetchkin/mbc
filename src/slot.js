var mvcSlotPrefix = "slot-",
    mvcSlotCounter = 0,

mvcMakeSlot = (
    function(){
        return function( slot ) {
            if ( "jquery" in slot ) {

                var classes = ( slot.attr("class") ? slot.attr("class").split(" ") : "" ),
                    isSlot = false, c, id;

                for ( c = 0; c < classes.length; c++ ) {
                    if ( classes[c] && classes[c].indexOf( mvcSlotPrefix ) !== -1 ) {
                        isSlot = classes[c].substr (mvcSlotPrefix.length );
                        break;
                    }
                }
                if ( isSlot === false) {
                    id = (mvcSlotCounter++)+"";
                    slot.addClass(mvcSlotPrefix + id);
                } else{
                    //mvc.log("parseSlot ", isSlot );
                    id = isSlot;
                }
                return mvc.slot( id, slot[0].tagName );
            }
        };
    }
)(),

mvcSlot   = {

type  : "slot",

init  : function(){
    this.blocks   = {};
    this.mod      = null;
    this["class"] = "";
    this.callFlag = false;

},

unblock: function(){
    //mvc.log("_____s_UNBLOCK", slot.id );
    for (var i in this.blocks) {
        mvcGetByID( i ).unblock( this.blocks[ i ], true );
        delete this.blocks[i];
    }
},


render: function(){
    var slot = this,
        data = slot.parent().parent(),
        res;

    //mvc.log("_____s_render_START "+slot.mod+" slot.id=", slot.id)
    /*

    mvc.log("_____s_render_START \n        slot.id=", slot.id,
        "\n        slot.mod=", slot.mod,
        "\n        slot.blocks=", slot.blocks,
        "\n        data.id=", data.id
        );
    */
    /*function logSlot_COMPLETE (){


        mvc.log("_____s_render_COMPLETE \n        slot.id=", slot.id,
            "\n        slot.blocks=", slot.blocks
        );


    }*/

    if ( slot.mod === "call" ) {
        res = slot.renderCall(data);
    } else if ( slot.mod === "apply" ) {
        res = slot.renderApply(data);
    } else {
        res = slot.renderSlot(data);
    }
/*
    if ("done" in res) {
        res.done(logSlot_COMPLETE);
    } else {
        logSlot_COMPLETE();
    }
*/

    return res;
},

get   : function(){ // todo: arguments
    if (1 in arguments[0]) {
        this.tag = arguments[0][1] || "div";
    }
    return this;
},

node : function ( $ctx ) {

    var parent = this.parent(),
        $parentNode,
        className = mvcSlotPrefix + this.id,
        res;

    if ( parent && ( $ctx || parent.node) ) {
        $parentNode = ( $ctx ) ? $ctx : parent.node;
        if ( $parentNode.hasClass( className ) ) {
            res = $parentNode;
        } else {
            res = $parentNode.find("." + mvcSlotPrefix + this.id);
        }
    } else {
        res = $("."+mvcSlotPrefix + this.id, HTML.body );
    }
    return res;
},

teleport  : function( $dest, $src ){

    var slot = this,
        $destSlot = this.node( $dest ),
        $srcSlot  = this.node( $src  );


    /*
        mvc.log("_____s_TELEPORT ["+this.mod+"]",this.id,
            "\n       $destSlot=",$destSlot,
            "\n       $srcSlot=",$srcSlot,
            "\n       slot.blocks=",slot.blocks
        );
    */
    if ( this.mod === "apply" ) {
        var setMap = {},
            $point = $destSlot;

        $( slot.parent().parent().index ).map(
            function( i, mvcid ){
                return setMap[mvcid] = true;
            }
        );

        $( $srcSlot.nextAll() ).map(  //todo: ?
            function(i, item){
                var data = $(item).data("mvc");

                if ( data.data in setMap ) {
                    $point = $( item ).detach().insertAfter( $point );
                }

                return true;
            }
        );

    } else {
        $destSlot.replaceWith( $srcSlot.detach() );
    }
},

replace   : function( block, $html ){

    /*
        mvc.log("_____s_render_REPLACE",
                    "\n        block.mvcid=", block.mvcid,
                    "\n        slot.id=", this.id,
                    "\n        block.node=", block.node,
                    "\n        $html=", $html
                    );
    */

    $.map(
        block.slots,
        function( mvcid ){
            return mvcGetByID( mvcid ) .teleport( $html, block.node );
        }
    );

    block.node.replaceWith( $html );
    block.node = $html;
    mvcSlot.setData.call(
        block,
        $html,
        this.callFlag
    );
},

insert    : function( _block, $html ){
    var slot  = this,
        $slot,
        block = mvcGetByID( _block.mvcid ),
        data  = block.parent();

    block.node = $html;
    slot.blocks[data.mvcid] = block.mvcid;
    /*
    mvc.log("_____s_render_INSERT", block.id ,
                "\n        slot.id=", this.id,
                "\n        $html=", $html
    );
    */
    $slot = slot.node();
    if ( slot.mod === "apply"  ) {
        var $point = $slot,
            index  = mvcGetByID( block.pBlockMVCID ).parent().index,
            i,
            curr,
            prev;
        if ( index.length > 1) {
            //mvc.log("---insert ", index);
            for ( i=0; i<index.length; i++ ) {
                curr = index[i];
                if ( curr === data.mvcid && prev ) {
                    //mvc.log("---insert",  data.mvcid," after ", prev );
                    $point = mvcGetByID( slot.blocks[ prev ] ).node;
                    break;
                }
                prev = curr;
            }
        }
        //mvc.log("insertAfter", $slot, $point, this.blocks);
        $html.insertAfter( $point );
    } else {
        $slot.append( $html );
    }
    mvcSlot.setData.call( block, $html, this.callFlag );
},

setData: function( node, callFlag ){
    //mvc.log("setData",this,node);
    node.data("mvc",
        {
        block : this.mvcid,
        data  : this.parent().mvcid,
        id    : this.parent().id,
        callFlag : callFlag
        }
   );
},

renderSlot: function(  ){// todo: ? unused( data )
    /*var slot = this,
        i,
        data,
        block,
        renders = [];*/
/*
    mvc.log("_____s__renderSlot",
        "\n        slot.id=", slot.id,
        "\n        slot.blocks=", slot.blocks,
        "\n        data.id=", data.id
    );
*/

/*
     for (i in slot.blocks) {
        data  = mvcGetByID( i );
        block = mvcGetByID( slot.blocks[ i ] );
        view  = block._view();
        template  = block._template();
        block.unblock();
        delete slot.blocks[i];
        renders.push(
          data.block(
            view.template( template ),
            slot
          )
        )
    }
*/
    return $.when.apply( null, [] ).promise();
},

renderCall: function( data ){ // todo: nahern
    return data.block(
        mvc.view( this.view ).template( this.template ),
        this
    );
},

slotPosition: function(){
    var res = { idByPos:[], posById:{} },
        i=0,
        dataID;
    for ( dataID in this.blocks ) {
        res.idByPos.push(dataID);
        res.posById[dataID] = i++;
    }
    return res;
},

renderApply: function( data ){
    var slot = this;
    //mvc.log("_____s__renderApply", slot.id, " : " , slot.view, slot.template );
    if ( !("childApply" in slot) ) {
        slot.childApply = function( ) {
            var c,
                dataID,
                actionsReplace  = [],
                actionsInsert   = [],
                actionsUnblock  = [],
                slotPos         = slot.slotPosition(), //todo: rename
                newBlocks       = {},
                dfd             = $.Deferred();
            /*
                mvc.log("_____s__childApply",
                    "\n        slot.id=", slot.id,
                    "\n        slot.blocks=", slot.blocks,
                    "\n        data.index=", data.index,
                    "\n        slotPos=", slotPos
                );
            */

            for ( c = 0; c < data.index.length; c++ ) {
                dataID = data.index[c];
                newBlocks[dataID] = "";
                if ( dataID in slot.blocks ) {
                    newBlocks[ dataID ] = slot.blocks[dataID];
                    if ( slotPos.idByPos[c] !== dataID && slotPos.posById[dataID] < c) {
                        actionsReplace.push(
                            {
                                dataID  : data.index[c],
                                action  : "replace",
                                replace : slotPos.idByPos[c]
                            }
                        );
                    }
                } else {
                    actionsInsert.push(
                        {
                            dataID: dataID,
                            action: "insert"
                        }
                    );
                }
            }

            for ( dataID in slot.blocks ) {
                if ( ! ( dataID in newBlocks)) {
                    actionsUnblock.push(
                        {
                            dataID: dataID,
                            action  : "unblock",
                            blockID:slot.blocks[dataID]
                        }
                    );
                }
            }

            /*
            mvc.log("_____s_childApply actions",
                "\n        slot.id=", slot.id,
                "\n        slotPos=", slotPos,
                "\n        actionsInsert=", actionsInsert,
                "\n        actionsReplace=", actionsReplace,
                "\n        actionsUnblock=", actionsUnblock
            );
            */

            dfd = $.when.apply(
                null,
                $.map(
                    ( actionsInsert.length ? actionsInsert : actionsReplace ).concat( actionsUnblock ) , // todo: naming
                    function( a ){ // todo: naming a
                        var data = mvcGetByID( a.dataID );
                        if ( a.action ) {
                            if ( a.action === "insert") {
                                var blockRes   = data.block( mvc.view( slot.view ).template( slot.template ), slot ); // todo: static
                                blockRes.after = a.after;
                                newBlocks[data.mvcid] = blockRes.mvcid;
                                return blockRes;
                            } else if ( a.action === "unblock" ) {
                                //mvc.log("_____s__UNBLOCK",a);
                                return data.unblock( a.blockID );
                            } else if ( a.action === "replace") {
                                var firstBlockID   = slot.blocks[a.replace],
                                    secondBlockID  = slot.blocks[a.dataID],
                                    bFirst  = mvcGetByID( firstBlockID  ).node[0],
                                    bSecond = mvcGetByID( secondBlockID ).node[0],
                                    parentNode = bFirst.parentNode,
                                    pF = parentNode.insertBefore( document.createTextNode(""), bFirst),
                                    pS = parentNode.insertBefore( document.createTextNode(""), bSecond);

                                //mvc.log("REPLACE", a.replace,"<->",a.dataID);

                                parentNode.replaceChild(bFirst,pS);
                                parentNode.replaceChild(bSecond,pF);
                                newBlocks[a.dataID]  = secondBlockID;
                                newBlocks[a.replace] = firstBlockID;
                            } else {
                                //mvc.log("_____s__APPLY ",a);
                                throw "unknown action="+a.action;
                            }
                        }
                        return false;
                    }
                )
            );
            //mvc.log("NEWBLOCKS",newBlocks);
            slot.blocks = newBlocks;
            return dfd.promise();
        };
        $( data ).on("mvc:index", slot.childApply );
        slot.childUnApply = function(){
            $( data ).off("mvc:index", slot.childApply );
        };
    }
    return slot.childApply( "init" );
},

toHtml : function(){
    return "<"+(this.tag || "div")+" class=\"" + mvcSlotPrefix + this.id + " " + this["class"] + "\" " + (this.mod === "apply"?" style=\"display:none;\"":"") +"/>"; //
}

};