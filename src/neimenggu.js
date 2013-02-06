function mvcGetByID ( mvcid ) {
    if ( !mvcid || mvcid.indexOf(mvcDelim) === -1 ) { //p.indexOf(id+mvcDelim+"prop"+mvcDelim) !== -1
        return mvc;
    }

    if ( mvcid in _mvc.type_id ) {
        if ( mvcid in _mvc[_mvc.type_id[mvcid]].s ) {
            return _mvc[ _mvc.type_id[ mvcid ] ].s[ mvcid ];
        }
    }

    var path = mvcid.split(mvcDelim),
        obj  = mvc,
        type,
        id;

    //mvc.log("Neimenggu:mvcGetByID", mvcid);

    path.shift();

    while (path.length) {
        type = path.shift();
        id   = path.shift().split( mvcModeDelim );
        //mvc.log("Neimenggu:mvcGetByID ", type, id);
        obj  = ( obj[type] )( id.shift() );

        if ( id.length ) {
            obj = obj.mods[id[id.length-1]];
        }
    }
    return obj;
}



function Neimenggu( constr ) {

    this.s = {};

    this.c = constr;

    this.c.parent = function(){
        return this.pid === "mvc" ? null : mvcGetByID( this.pid );
    };

    this._mvcid   = function( parentID, ID ){
        return parentID + mvcDelim + this.c.type + mvcDelim + ID;
    };

}

Neimenggu.prototype.has = function( parentID, ID ) {
    return this._mvcid( parentID, ID ) in this.s;
};

Neimenggu.prototype.add = function( parentID, ID ) {

    var _id = this._mvcid( parentID, ID );

    _mvc.type_id[ _id ] = this.c.type;

    this.s[_id] = $.extend( // todo: ?
        {
            mvcid: _id,
            ev:    { i:"events" }, // todo: events
            id:    ID,
            pid:   parentID
        },
        this.c
    );

    if( "init" in this.c ){
        this.s[_id].init();
    }

    return this.s[_id];
};

Neimenggu.prototype.get = function( parentID, ID ){
    return this.s[
        this._mvcid(
            parentID, ID
        )
    ];
};