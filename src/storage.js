function mvcStorage( id, storage ){

    if ( typeof id !== "string" && (typeof id !== "number" || isNaN( id )) ) {
        throw new Error("TypeError for id in type = " + storage.c.type + ", id = " +id );
    }

    if( ! storage.has( this.mvcid, id ) ){
        $(this).trigger(
            "mvc:objectCreated",
            storage.add(
                this.mvcid,
                id
            )
        );
    }
    return storage.get(this.mvcid, id);
}