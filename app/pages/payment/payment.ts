import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams,NavController} from 'ionic-angular';
import {Address} from '../../providers/address';
import {Payment} from '../../providers/payment/payment';
import {History} from '../../providers/history/history';
import {BitcoinUnit} from '../../providers/currency/bitcoin-unit';
import {PaymentResultPage} from './payment-result';
import {Config} from '../../providers/config';
import {Currency} from '../../providers/currency/currency';
import * as bip21 from 'bip21';
import {Transaction} from '../../api/transaction';
import * as payment from '../../api/payment-service';
import qrcode = require('qrcode-generator');

@Component({
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

    constructor(private addressService: Address, private historyService: History, private paymentService: Payment, private currencyService: Currency, private config: Config, private params: NavParams, private navigation:NavController, private changeDetector:ChangeDetectorRef) {              
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
            this.initPaymentCheck();
        });          
    }

    initPaymentCheck() {
        let paymentRequest = {
            address : this.address ,
            bitcoinAmount : this.amount.to('BTC') ,
            fiatAmount : this.amount.toFiat(this.currencyRate) ,
            currency : this.currency
        };

        this.paymentService.startPaymentStatusCheck(paymentRequest);
        this.paymentService
            .on('payment-status:'+payment.PAYMENT_STATUS_RECEIVED, (transaction) => {
                this.paymentReceived(transaction);
            })
            .on('payment-status:'+payment.PAYMENT_STATUS_TIMEOUT, (paymentRequest) => {
                this.paymentError(payment.PAYMENT_STATUS_TIMEOUT, paymentRequest);
            });        
    }
    
    paymentError(status: string, transaction: Transaction) {
        this.navigation.setRoot(PaymentResultPage, {
            status: status ,
            success: false ,
            transaction: transaction            
        });
    }
    
    paymentReceived(transaction: Transaction) {
        this.navigation.setRoot(PaymentResultPage, {
            status: payment.PAYMENT_STATUS_RECEIVED ,
            success: true ,
            transaction: transaction
        });
    }

    ionViewWillLeave() {
        this.paymentService.stopPaymentStatusCheck();
    }    
    
}
