import {Injectable} from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';

@Injectable()
export class Config extends Storage {
        
    constructor() {
        super(SqlStorage);
    }
    
    /**
     * init the key with the given value, only!
     * if there is no value set already
     */
    initialize(key:string, value:any) {
        this.get(key).then(storedValue => {
            if (storedValue === null || storedValue === undefined) {
                this.set(key,value);
            }
        });
    }    
        
}