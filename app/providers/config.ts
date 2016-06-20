import {Injectable} from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';

@Injectable()
export class Config extends Storage {

    static CONFIG_KEY_STATIC_ADDRESS = 'static-address';
    static CONFIG_KEY_MASTER_PUBLIC_KEY = 'master-public-key';
    static CONFIG_KEY_MASTER_PUBLIC_KEY_INDEX = 'master-public-key-index';
    static CONFIG_KEY_ADDRESS_TYPE = 'address-type';
    static CONFIG_KEY_CURRENCY = 'currency';
    static CONFIG_KEY_CURRENCY_SYMBOL = 'symbol';
    static CONFIG_KEY_CURRENCY_FORMAT = 'currency-format';
    static CONFIG_KEY_CURRENCY_FORMAT_T = 'currency-format-t';
    static CONFIG_KEY_CURRENCY_FORMAT_S = 'currency-format-s';
    static CONFIG_KEY_BITCOIN_UNIT = 'bitcoin-unit';
    static CONFIG_KEY_BLOCKCHAIN_EXPLORER = 'blockchain-explorer';
    static CONFIG_KEY_EXCHANGE_SERVICE = 'exchange';
    static CONFIG_KEY_EXCHANGE_RATE = 'rate';
        
    constructor() {
        super(SqlStorage);

        this.initialize(Config.CONFIG_KEY_EXCHANGE_RATE,'1');
        this.initialize(Config.CONFIG_KEY_EXCHANGE_SERVICE,'blockchain');
        this.initialize(Config.CONFIG_KEY_BLOCKCHAIN_EXPLORER,'blockchain');

        this.initialize(Config.CONFIG_KEY_CURRENCY,'EUR');
        this.initialize(Config.CONFIG_KEY_CURRENCY_SYMBOL,'€');
        this.initialize(Config.CONFIG_KEY_CURRENCY_FORMAT,'de');
        this.initialize(Config.CONFIG_KEY_CURRENCY_FORMAT_T,'.');
        this.initialize(Config.CONFIG_KEY_CURRENCY_FORMAT_S,',');

        this.initialize(Config.CONFIG_KEY_BITCOIN_UNIT,'mBTC');        
    }

    isSet(key:string) {
        return new Promise<boolean>((resolve,reject) => {
            this.get(key).then(storedValue => {
                if (storedValue === null || storedValue === undefined) {
                    resolve(false);
                }
                resolve(true);
            });
        });        
    }
    
    /**
     * init the key with the given value, only!
     * if there is no value set already
     */
    initialize(key:string, value:any) {
        this.isSet(key).then(status => {
            if (!status) {
                this.set(key,value);
            }
        });
    }    
        
}