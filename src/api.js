// собираем хранилище
_mvc = mvc._mvc = /* backdoor */ {
    prop  :   new Neimenggu( mvcProp   ),
    module:   new Neimenggu( mvcModule ),
    set   :   new Neimenggu( mvcSet    ),
    slot  :   new Neimenggu( mvcSlot   ),
    block :   new Neimenggu( mvcBlock  ),
    obj   :   new Neimenggu( mvcObj    ),
    view  :   new Neimenggu( mvcView   ),
    type_id : {} // кеш для быстрой адресации элементов хранилища по типу
};


// собираем API
mvc =  window.mvc = LIB.merge.call(
    mvc,
    {

    obj     : function( id ){ return mvcStorage.apply(  this, [ id, _mvc.obj    ]).get( arguments ); },
    set     : function( id ){ return mvcStorage.apply(  this, [ id, _mvc.set    ]).get( arguments ); },
    module  : function( id ){ return mvcStorage.apply(  this, [ id, _mvc.module ]).get( arguments ); },
    prop    : function( id ){ return mvcStorage.apply(  this, [ id, _mvc.prop   ]).get( arguments ); },
    view    : function( id ){ return mvcStorage.apply(  this, [ id, _mvc.view   ]).get( arguments ); },
    slot    : function( id ){ return mvcStorage.apply(  this, [ id, _mvc.slot   ]).get( arguments ); },

    // хелпер для подгрузки модулей
    load    : function(list){
        for( var m in list ) {
            if ( list[m] && (m-1) >= -1 ){
                mvc.module( list[m] ).load();
            }
        }
    },

    // хелпер для подгрузки данных mvc.data( {url:url} ).done( ... ).fail( ... )
    data      : LIB.load.data,

    // хелпер для подгрузки локализации
    getI18N   : LIB.load.i18n,

    // хелпер для подгрузки скриптов
    getScript : LIB.load.script,

    // хелпер для внешней адресации по внутреннему mvcid
    getByID   : mvcGetByID,

    // todo
    /*logger    : {

        cache: [],

        empty: function(){
            mvc.logs.cache = [];
        },

        flush: function(){
            $(
                mvc
            ).trigger(
                "mvc:logs"
            );

        }
    },*/
    // хелпер для логирования
    log       : function (){
        try {
            if( mvc.obj("mvc-config").prop("logger") ) {
                mvc.logs.cache.push( arguments );
                window.console.log.apply( window.console, arguments );
            }
        } catch ( e ) {
            return false;
        }
    }

});

// alias
mvc.map = mvc.set;