import {Injectable} from 'angular2/core';
import {Config} from './config';

@Injectable()
export class Address {
    
    getAddress() : string {
        let addressType = Config.getItem('address-type');       
        
        if (addressType === 'static') {
            return Config.getItem('static-address');            
        }
               
    }
    
}