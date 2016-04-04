import {Http, Jsonp} from 'angular2/http';
import {Injectable} from 'angular2/core';
import * as payment from './payment';

@Injectable()
export class BlockchainPaymentService implements payment.PaymentService {
        
    constructor(private http:Http, private jsonp: Jsonp) {
    }
        
    checkPayment(address: string, amount: number) : Promise<{status: string, tx?:string}> {
        return new Promise((resolve, reject) => {
            try {
                this.jsonp.request('http://blockchain.info/address/'+address+'?filter=7&format=json')
                    .subscribe(
                        response => {
                            console.log(response);
                            if (response.status === 200) {
                                let json = response.json();                                
                                let tx = this.findTransaction(json,address,amount);
                                
                                if (tx != '') {
                                    resolve({
                                        status: payment.PAYMENT_STATUS_RECEIVED ,
                                        tx: tx
                                    });
                                } else {
                                    reject({status: payment.PAYMENT_STATUS_NOT_RECEIVED});
                                }                                
                            } else {
                                reject({status: payment.PAYMENT_STATUS_SERVICE_ERROR});
                            }
                        }
                    );
            } catch(e) {
                reject({status: payment.PAYMENT_STATUS_SERVICE_ERROR});
            }
        });
    }
    
    findTransaction(json: any, address: string, amount: number) : string {
        if (json.address === address &&
            json.final_balance >= amount &&
            Array.isArray(json.txs)) {
            
            for (let tx of json.txs) {
                if (Array.isArray(tx.out)) {
                    for (let output of tx.out) {
                        if (output.addr === address && output.value === amount) {
                            return tx.hash;
                        }
                    }
                }
            }
        }
                
        return '';
    }
    
}