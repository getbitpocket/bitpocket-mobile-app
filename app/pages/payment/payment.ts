import {ChangeDetectorRef} from '@angular/core';
import {Page,NavParams,NavController} from 'ionic-angular';
import {Address} from '../../providers/address';
import * as payment from '../../providers/payment/payment';
import {History} from '../../providers/history/history';
import {BitcoinUnit} from '../../providers/currency/bitcoin-unit';
import {PaymentResultPage} from './payment-result';
import {Config} from '../../providers/config';
import {Currency} from '../../providers/currency/currency';
import * as bip21 from 'bip21';
import {Transaction} from '../../api/transaction';
import qrcode = require('qrcode-generator');

@Page({
    templateUrl : 'build/pages/payment/payment.html'
})
export class PaymentPage {
    
    qrImage: any;
    
    amount: BitcoinUnit;
    
    fiatAmount: string;
    bitcoinAmount: string;    
    currency: string;
    bitcoinUnit: string;
    currencyRate: number;
    
    address: string;
    readableAmount: string;
    
    waitingTime: number = 0;
    checkInterval: number = 4000;
    timeout: number = 1000 * 20; // one minute, should be configurable
    serviceErrorCounts: number = 0;
    maxServiceErrors: number = 4;
    
    constructor(private addressService: Address, private historyService: History, private paymentService: payment.Payment, private currencyService: Currency, private config: Config, private params: NavParams, private navigation:NavController, private changeDetector:ChangeDetectorRef) {              
        this.amount = params.data.bitcoinAmount;
                      
        Promise.all<any>([
            this.config.get('currency') ,
            this.config.get('currency-format-s') ,
            this.config.get('bitcoin-unit') ,            
            this.addressService.getAddress() ,
            this.currencyService.getSelectedCurrencyRate()
        ]).then(promised => {            
            this.currency      = promised[0];
            this.bitcoinUnit   = promised[2];
            this.address       = promised[3];
            this.currencyRate  = promised[4];
            
            this.fiatAmount    = this.currencyService.formatNumber(this.amount.toFiat(promised[4],2), promised[1]);
            this.bitcoinAmount = this.amount.to(this.bitcoinUnit).toString();
            
            let bip21uri = bip21.encode(promised[3],{
                amount : this.amount.to('BTC') ,
                label : 'Test Payment'
            });
                           
            let qr:any = qrcode(6,'M');
            qr.addData(bip21uri);
            qr.make();
            this.qrImage = qr.createImgTag(5,5); 
            
            this.changeDetector.detectChanges();
            this.checkPayment();
        });          
    }
    
    paymentError(status: string, transaction: Transaction) {
        this.navigation.setRoot(PaymentResultPage, {
            status: status ,
            success: false ,
            transaction: transaction            
        });
    }
    
    paymentReceived(tx: string, transaction: Transaction) {
        this.navigation.setRoot(PaymentResultPage, {
            status: payment.PAYMENT_STATUS_RECEIVED ,
            success: true ,
            transaction: transaction
        });
    }
        
    checkPayment() {      
        let paymentRequest = {
            txid : '',
            address : this.address ,
            bitcoinAmount : this.amount.to('BTC') ,
            fiatAmount : this.amount.toFiat(this.currencyRate) ,
            currency : this.currency
        };
        
        setTimeout(() => {
            this.waitingTime += this.checkInterval;
            
            if (this.waitingTime > this.timeout) {
                this.paymentError(payment.PAYMENT_STATUS_TIMEOUT, paymentRequest);
            } else {
                this.paymentService
                .checkPayment(this.address,this.amount)
                .then((result) => {                    
                    if (result.status === payment.PAYMENT_STATUS_RECEIVED && result.tx != '') {   
                        paymentRequest.txid = result.tx;                     
                        this.historyService.addTransaction(paymentRequest);                        
                        this.paymentReceived(result.tx, paymentRequest);
                    } else {
                        this.paymentError(payment.PAYMENT_STATUS_ERROR, paymentRequest);
                    }                    
                })
                .catch((result) => {                    
                    if (result.status === payment.PAYMENT_STATUS_NOT_RECEIVED) {
                        this.checkPayment();
                    } else if (result.status === payment.PAYMENT_STATUS_SERVICE_ERROR && this.serviceErrorCounts <= this.maxServiceErrors ) {
                        this.checkPayment();
                    } else {
                        this.paymentError(result.status, paymentRequest);
                    }                    
                });
            }
            
        }, this.checkInterval);        
    }
    
}
