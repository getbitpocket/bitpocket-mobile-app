import {Injectable} from '@angular/core';
import {Config} from './config';
import * as bitcoin from 'bitcoinjs-lib';

@Injectable()
export class Address {
    
    constructor(private config: Config) {}
    
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