import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

@Injectable()
export class Config {

    constructor(
        protected storage: Storage
    ) {}

    static CONFIG_KEY_CURRENCY = 'currency';
    static CONFIG_KEY_CURRENCY_SYMBOL = 'symbol';
    static CONFIG_KEY_BITCOIN_UNIT = 'bitcoin-unit';
    static CONFIG_KEY_BLOCKCHAIN_EXPLORER = 'blockchain-explorer';
    static CONFIG_KEY_EXCHANGE_SERVICE = 'exchange';
    static CONFIG_KEY_EXCHANGE_RATE = 'rate';
    static CONFIG_KEY_PIN = 'pin';
    static CONFIG_KEY_DEFAULT_ACCOUNT = 'default-account';

    initConfig() : Promise<boolean> {
        return new Promise<boolean>((resolve,reject) => {
            Promise.all<any>([
                this.initialize(Config.CONFIG_KEY_EXCHANGE_RATE,-1),
                this.initialize(Config.CONFIG_KEY_EXCHANGE_SERVICE,'blockchain'),
                this.initialize(Config.CONFIG_KEY_BLOCKCHAIN_EXPLORER,'blockchain'),
                this.initialize(Config.CONFIG_KEY_CURRENCY,'EUR'),
                this.initialize(Config.CONFIG_KEY_CURRENCY_SYMBOL,'€'),
                this.initialize(Config.CONFIG_KEY_BITCOIN_UNIT,'mBTC'),
                this.initialize(Config.CONFIG_KEY_PIN,'')
            ]).then(() => {
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        });
    }

    isSet(key:string) : Promise<boolean> {
        return new Promise<boolean>((resolve,reject) => {
            this.storage.get(key).then(storedValue => {
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
    initialize(key:string, value:any) : Promise<boolean> {
        return new Promise<boolean>((resolve,reject) => {
            this.isSet(key).then(status => {
                if (!status) {
                    this.storage.set(key,value);                    
                }
                resolve(true);
            }).catch(() => {
                resolve(false);
            });
        });        
    }    

    set(key:string, value:any) : Promise<any> {
        return this.storage.set(key, value);
    }

    get(key:string) : Promise<any> {
        return this.storage.get(key);
    }
        
}