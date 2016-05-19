import {Page,NavParams,NavController} from 'ionic-angular';
import {Address} from '../../providers/address';
import * as payment from '../../providers/payment/payment';
import {BitcoinUnit} from '../../providers/currency/bitcoin-unit';
import {PaymentResultPage} from './payment-result';
import * as bip21 from 'bip21';
import qrcode = require('qrcode-generator');

@Page({
    templateUrl : 'build/pages/payment/payment-result.html'
})
export class PaymentPage {
    
    qrImage: any;
    
    amount: BitcoinUnit;
    fiatAmount : number;
    currency : string;
    
    address: string;
    readableAmount: string;
    
    waitingTime: number = 0;
    checkInterval: number = 4000;
    timeout: number = 1000 * 20; // one minute, should be configurable
    serviceErrorCounts: number = 0;
    maxServiceErrors: number = 4;
    
    constructor(private addressService: Address, private paymentService: payment.Payment, private params: NavParams, private navigation:NavController) {                
        this.amount = params.data.bitcoinAmount;
        this.readableAmount = params.data.readableFiatAmount;        
        this.addressService.getAddress().then((address) => {
                        
            let bip21uri = bip21.encode(address,{
                amount : this.amount.toBitcoin() ,
                label : 'Test Payment'
            });

            let qr:any = qrcode(6,'M');
            qr.addData(bip21uri);
            qr.make();
            this.qrImage = qr.createImgTag(5,5);        
            
            this.checkPayment();
        });      
    }
    
    paymentError(status: string) {
        this.navigation.setRoot(PaymentResultPage, {
            status: status            
        });
    }
    
    paymentReceived(tx: string) {
        this.navigation.setRoot(PaymentResultPage, {
            status: payment.PAYMENT_STATUS_RECEIVED            
        });
    }
        
    checkPayment() {      
        setTimeout(() => {
            this.waitingTime += this.checkInterval;
            
            if (this.waitingTime > this.timeout) {
                this.paymentError(payment.PAYMENT_STATUS_TIMEOUT);
            } else {
                this.paymentService
                .checkPayment(this.address,this.amount)
                .then((result) => {
                    
                    if (result.status === payment.PAYMENT_STATUS_RECEIVED && result.tx != '') {
                        this.paymentReceived(result.tx);
                    } else {
                        this.paymentError(payment.PAYMENT_STATUS_ERROR);
                    }
                    
                })
                .catch((result) => {
                    
                    if (result.status === payment.PAYMENT_STATUS_NOT_RECEIVED) {
                        this.checkPayment();
                    } else if (result.status === payment.PAYMENT_STATUS_SERVICE_ERROR && this.serviceErrorCounts <= this.maxServiceErrors ) {
                        this.checkPayment();
                    } else {
                        this.paymentError(result.status);
                    }
                    
                });
            }
            
        }, this.checkInterval);        
    }
    
}
