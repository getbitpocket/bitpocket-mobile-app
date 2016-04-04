import {Injectable} from 'angular2/core';
import * as payment from './payment';

export class ElectrumPaymentService implements payment.PaymentService {
    
    checkPayment(address: string, amount: number) : Promise<{status: string, tx?: string}> {
        
        return new Promise((resolve, reject) => {
            
            let nD = new electrum.NetworkDiscovery();
            
        });
        
    }
    
}