import {Injectable} from '@angular/core';
import {Config} from './config';
import * as bitcoin from 'bitcoinjs-lib';

@Injectable()
export class Address {
    
    static REGEX_BITCOIN_ADDRESS = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    static REGEX_XPUB_KEY = /^xpub[a-km-zA-HJ-NP-Z1-9]{100,108}$/;

    constructor(private config: Config) {}    
    
    static checkAddressInput(addressInput: string, addressType: string) : boolean {
        try {
            if (addressType === 'static' && Address.REGEX_BITCOIN_ADDRESS.test(addressInput)) {                    
                return true;
            } else if (addressType === 'master-public-key' &&
                Address.REGEX_XPUB_KEY.test(addressInput) &&
                bitcoin.HDNode.fromBase58(addressInput).toBase58() === addressInput) {
                return true;
            }
        } catch(e) {
            return false
        }

        return false;
    }

    getAddress() : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            Promise.all<any>([
                this.config.get('address-type') ,
                this.config.get('static-address') ,
                this.config.get('master-public-key') ,
                this.config.get('master-public-key-index')
            ]).then(promised => {
                if (promised[0] === 'static') {
                    resolve(promised[1]);
                } else if (promised[0] === 'master-public-key') {
                    resolve( bitcoin.HDNode.fromBase58(promised[2]).derive(0).derive(promised[3]).getAddress() );
                }
            });
                  
        });                       
    }
    
}