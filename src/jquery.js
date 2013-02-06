/*
   Autorouting

    <elem>
       <mvc:action event="click" route="parent|data|set">actionName</mvc:action>
    </elem>
 */

$.fn.mvc = function MBConstructor () {

    if ( mvc in this ){
        return this.mvc;
    }

    else if ( this instanceof MBConstructor ){
        return this;
    }

    else {
        return new MBConstructor( arguments );
    }

};

(function($,document){
var events = "", e,
    actionPrefix = "mvc-action-", // todo: config
    getTarget = function( action, data, block ){
        var target;
        switch ( action.route ) {
            case "parent": target = mvcGetByID(block.pBlockMVCID);  break;
            case "set"   : target = mvcGetByID(data.data).parent(); break;
            case "obj"   : target = mvcGetByID(data.data);          break;
            default      : target = block;
        }
        return target;
    },
    getData   = function( node ){
        var n = node;
        while ( !$(n).data("mvc") ) { //hasData returns true in ie
            n = ($(n).parent())[0] ;
        }
        return $(n).data("mvc");
    },
    getAction = function( etype, elem ){
        var _classes = elem.className.split(" "),
            _class,
            _c,
            start  = actionPrefix + etype + "-",
            a;
        for (_c in _classes) {
            _class = _classes[_c];
            if ( _class.indexOf(start) !== -1 ) {
                a = _class.substring( start.length, _class.length ).split(":");
                return { name:a[0], route:a[2]||false };
            }
        }
        return false;
    };


for (e in $.attrFn){events += e+" ";}

$(document).on(
    events,

    "*[class*=\""+actionPrefix+"\"]",
    function( event ){
        var elem = this,
            action  = getAction( event.type, elem ),
            data, block, target, mvcEvent;

        //mvc.log(" event=", event);

        if ( action ) {
            data  = getData( elem );
            block = mvcGetByID(data.block);
            //mvc.log("action=", action, " data=", data, " block=", block);
            LIB.async(
                function () {
                    if ( action.name in block ) {
                        block[action.name](e);
                    } else {
                        //mvc.log("------",elem);
                        data.elem = elem;
                        mvcEvent  = actionPrefix.replace(/\-/g,":") + action.name;
                        target    = getTarget( action, data, block );
                        $( target ).trigger( mvcEvent , data);
                        //mvc.log("-- * ", mvcEvent, target.mvcid, data );

                        // callFlag bubbling
                        var callFlag = data.callFlag, nd;
                        if ( callFlag ) {
                            while ( callFlag ) {
                                target = mvcGetByID( target.pBlockMVCID );
                                nd = $(target.node).data("mvc");
                                callFlag = (nd && nd.callFlag===true);
                                $(target).trigger(mvcEvent, data);
                            }

                        }
                    }
                }
            );
        }
        return false;
    }
);


})
($,document);


/*
    event wrappers for mvc objects (jQuery 1.7.0)


    todo: args processor

this.map(

return is mvc

)


*/

/*
todo

$("/set");
$("/set/obj");
$("/set/obj/prop").listen( function (event, data){  } );
$("/set/*[prop-id]");
$("/set/*[prop-id='value']");

*/


var handlerWrapper = function( origHandler, mvcid ){
    var ctx = mvcGetByID( mvcid );
    return function(){
        return origHandler.apply( ctx, arguments );
    };
};


$.fn.on = (
    function( $on, handlerWrapper ) {
        return function( ){

            var args = ([]).slice.call(arguments,0), mvcid;
            
            if ( this.length === 1 && "mvcid" in this[0] && "ev" in this[0] ) {
                mvcid   = this[0].mvcid;
                this[0] = this[0].ev;
                for (var a = 0, origHandler; a < args.length; a++ ){
                    if( $.isFunction( args[a] ) ){
                        origHandler = args[a];
                        args[a] = handlerWrapper( origHandler, mvcid );
                    }
                }
            }
            return $on.apply(this,args);
        };
    }

)
($.fn.on, handlerWrapper );

$.fn.off = (
    function( off ){
        return function(){
            var first = this[0] || null;
            if (first && ("mvcid" in first) ) {
                this[0] = mvcGetByID( first.mvcid ).ev;
                //mvc.log("OFF ", first.mvcid );
            }
            return off.apply(this,arguments);
        };
    }
)
($.fn.off);

$.fn.trigger = (
    function( trigger ){
        return function(){
            var first = this[0] || null; // todo: function replaceMvcObjsIn$handlers(){}
            if (first && ("mvcid" in first)) {
                this[0] = mvcGetByID( first.mvcid ).ev;
            }
            return trigger.apply(this, arguments);
        };
    }
)
($.fn.trigger);