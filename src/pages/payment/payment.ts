import { PaymentRequestHandler } from './../../api/payment-request-handler';
import { PAYMENT_STATUS_RECEIVED, PAYMENT_STATUS_TIMEOUT, PaymentRequest } from './../../api/payment-request';
import { PaymentService } from './../../providers/payment/payment-service';
import { AccountService } from './../../providers/account/account-service';
import { Component} from '@angular/core';
import {NavParams,NavController} from 'ionic-angular';
import {BitcoinUnit} from '../../providers/currency/bitcoin-unit';
import {PaymentResultPage} from './payment-result';
import {Config} from '../../providers/config';
import {Currency} from '../../providers/currency/currency';
import * as bip21 from 'bip21';
import * as qrcode from 'qrcode-generator';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl : 'payment.html'
})
export class PaymentPage {
    
    qrImage: any;
    
    amount: BitcoinUnit;
    
    fiatAmount: string = "";
    bitcoinAmount: string = "";    
    currency: string = "";
    bitcoinUnit: string = "";
    currencyRate: number;
    
    address: string;
    readableAmount: string;

    paymentRequestHandler:PaymentRequestHandler;
    paymentRequest:PaymentRequest;

    constructor(
        private paymentService: PaymentService ,
        private accountService: AccountService,
        private translation: TranslateService ,
        private currencyService: Currency,
        private config: Config,
        private params: NavParams,
        private navigation:NavController) {     

        this.amount = params.data.amount;

        Promise.all<any>([
            this.config.get('currency') ,
            this.translation.get('FORMAT.CURRENCY_S').toPromise() ,
            this.config.get('bitcoin-unit') , 
            this.accountService.getDefaultAddress() ,
            this.currencyService.getSelectedCurrencyRate() ,
            this.config.get('payment-request-label')
        ]).then(promised => {       
            this.currency      = promised[0];
            this.bitcoinUnit   = promised[2];
            this.address       = promised[3];
            this.currencyRate  = promised[4];

            this.paymentRequest = {            
                address : this.address ,
                amount : this.amount.to('BTC') ,
                currency : 'BTC',
                referenceCurrency : this.currency,
                referenceAmount : this.amount.toFiat(this.currencyRate) ,
            };

            this.fiatAmount    = this.currencyService.formatNumber(this.amount.toFiat(promised[4],2), promised[1]);
            this.bitcoinAmount = this.currencyService.formatNumber(this.amount.to(this.bitcoinUnit), promised[1], BitcoinUnit.decimalsCount(this.bitcoinUnit));
            
            let bip21uri = bip21.encode(promised[3],{
                amount : this.amount.to('BTC') ,
                label : promised[5]
            });
                           
            let qr:any = qrcode(6,'M');
            qr.addData(bip21uri);
            qr.make();
            this.qrImage = qr.createImgTag(5,5); 

            this.initPaymentCheck();
        }).catch((e) => {
            console.error(e);
        });          
    }

    initPaymentCheck() {
        this.paymentRequestHandler = this.paymentService.createPaymentRequestHandler(this.paymentRequest);
        this.paymentRequestHandler
            .once('payment-status:' + PAYMENT_STATUS_RECEIVED, () => {
                this.paymentRequest.status = PAYMENT_STATUS_RECEIVED;
                this.paymentReceived();
            }).once('payment-status:' + PAYMENT_STATUS_TIMEOUT, () => {
                this.paymentRequest.status = PAYMENT_STATUS_TIMEOUT;
                this.paymentError(PAYMENT_STATUS_TIMEOUT);
            });        
    }
    
    paymentError(status: string) {
        this.navigation.setRoot(PaymentResultPage, {
            success: false ,
            paymentRequest : this.paymentRequest          
        });
    }
    
    paymentReceived() {
        let audio = new Audio('assets/sound/paid.mp3');
        audio.play(); 

        this.navigation.setRoot(PaymentResultPage, {
            success: true ,
            paymentRequest : this.paymentRequest
        });               
    }

    ionViewWillLeave() {
        this.paymentRequestHandler.cancel();
    }    
    
}
