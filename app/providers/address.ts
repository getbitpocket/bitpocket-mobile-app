import {Injectable} from 'angular2/core';
import {Config} from './config';

@Injectable()
export class Address {
    
    constructor(private config: Config) {}
    
    getAddress() : Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.config.get('address-type').then((addressType: string) => {
                if (addressType === 'static') {
                    resolve(this.config.get('static-address'));
                }
            });           
        });                       
    }
    
}