import {Injectable} from '@angular/core';
import {Config} from './config';
import * as bitcoin from 'bitcoinjs-lib';

export const ADDRESS_TYPE_STATIC_ADDRESS = "static-address";
export const ADDRESS_TYPE_MASTER_PUBLIC_KEY = "master-public-key";

@Injectable()
export class Address {
    
    static REGEX_BITCOIN_ADDRESS = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    static REGEX_XPUB_KEY = /^xpub[a-km-zA-HJ-NP-Z1-9]{100,108}$/;

    constructor(private config: Config) {}    
    
    static checkAddressInput(addressInput: string, addressType: string) : boolean {
        try {
            if (addressType === ADDRESS_TYPE_STATIC_ADDRESS && Address.REGEX_BITCOIN_ADDRESS.test(addressInput)) {                    
                return true;
            } else if (addressType === ADDRESS_TYPE_MASTER_PUBLIC_KEY &&
                Address.REGEX_XPUB_KEY.test(addressInput) &&
                bitcoin.HDNode.fromBase58(addressInput).toBase58() === addressInput) {
                return true;
            }
        } catch(e) {
            return false
        }

        return false;
    }

    availableAddressTypes() : Promise<Array<string>> {
        let addressTypes:Array<string> = [];

        return new Promise<Array<string>>((resolve, reject) => {
            Promise.all<any>([
                this.config.get('static-address') ,
                this.config.get('master-public-key')
            ]).then(promised => {
                if (Address.checkAddressInput(promised[0], ADDRESS_TYPE_STATIC_ADDRESS)) {
                    addressTypes.push(ADDRESS_TYPE_STATIC_ADDRESS);
                }
                if (Address.checkAddressInput(promised[1], ADDRESS_TYPE_MASTER_PUBLIC_KEY)) {
                    addressTypes.push(ADDRESS_TYPE_MASTER_PUBLIC_KEY);
                }

                resolve(addressTypes);
            });                  
        });     
    }

    getAddress() : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            Promise.all<any>([
                this.config.get('address-type') ,
                this.config.get('static-address') ,
                this.config.get('master-public-key') ,
                this.config.get('master-public-key-index')
            ]).then(promised => {
                if (promised[0] === ADDRESS_TYPE_STATIC_ADDRESS) {
                    resolve(promised[1]);
                } else if (promised[0] === ADDRESS_TYPE_MASTER_PUBLIC_KEY) {
                    let index = promised[3] > 0 ? promised[3] : 1;
                    // m/0/(master-public-key-index)
                    resolve( bitcoin.HDNode.fromBase58(promised[2]).derive(0).derive(index).getAddress() );
                }
            });                  
        });                       
    }

    /**
     * if an address was successfully used,
     * and it was a derived address increase
     * the index count +1
     */
    addressPostProcess() {
        Promise.all<any>([
            this.config.get('address-type') ,
            this.config.get('master-public-key-index')
        ]).then(promised => {                
            if (promised[0] === ADDRESS_TYPE_MASTER_PUBLIC_KEY) {
                let index = Math.floor(parseInt(promised[1] > 0 ? promised[1] : 1) + 1);
                this.config.set('master-public-key-index', index);
            }
        });         
    }

    setAddressType(addressType: string) : Promise<any> {
        return this.config.set('address-type', addressType);
    }

    getAddressType() : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.config.get('address-type').then(ad => {
                resolve(ad);
            });
        });
    }
    
}