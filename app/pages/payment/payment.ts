import {Page,NavParams} from 'ionic-angular';
import {Address} from '../../providers/address'
import * as payment from '../../providers/payment/payment';
import * as bip21 from 'bip21';
import * as qrcode from 'qrcode-generator';

@Page({
    templateUrl : 'build/pages/payment/payment.html'    
})
export class PaymentPage {
    
    qrImage: any;
    
    amount: number;
    address: string;
    readableAmount: string;
    
    waitingTime: number = 0;
    checkInterval: number = 2000;
    timeout: number = 1000 * 60; // one minute, should be configurable
    serviceErrorCounts: number = 0;
    maxServiceErrors: number = 4;
    
    constructor(private addressService: Address, private paymentService: payment.Payment, private params: NavParams) {                
        this.amount = params.data.amount;
        this.readableAmount = params.data.readableAmount;        
        this.address = this.addressService.getAddress();
        
        let bip21uri = bip21.encode(this.address,{
            amount : this.amount ,
            label : 'Test Payment'
        });
                                
        let qr:any = qrcode(6,'M');
        qr.addData(bip21uri);
        qr.make();
        this.qrImage = qr.createImgTag(5,5);        
        
        this.checkPayment();
    }
    
    paymentError(status: string) {
        console.log(status);
    }
    
    paymentReceived(tx: string) {
        console.log(tx);
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
