import { Component} from '@angular/core';
import { NavParams, NavController, IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { PaymentRequestHandler } from './../../api/payment-request-handler';
import { PAYMENT_STATUS_RECEIVED, PAYMENT_STATUS_OVERPAID, PAYMENT_STATUS_PARTIAL_PAID, PaymentRequest } from './../../api/payment-request';
import { PaymentService, AccountService, BitcoinUnit, Config, CurrencyService } from './../../providers/index';
import * as bip21 from 'bip21';
import * as qrcode from 'qrcode-generator';

@IonicPage({
    name : 'payment' ,
    defaultHistory : ['amount']
})
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
    label:string = "";    
    currencySeparator:string = ".";
    address: string;
    readableAmount: string;

    paymentRequestHandler:PaymentRequestHandler;
    paymentRequest:PaymentRequest;

    constructor(
        protected paymentService: PaymentService ,
        protected accountService: AccountService,
        protected translation: TranslateService ,
        protected currencyService: CurrencyService ,
        protected config: Config,
        protected navigation:NavController,
        params: NavParams) {     
        this.amount = params.data.amount;        
    }

    ionViewWillEnter() {
        Promise.all<any>([
            this.config.get('currency') ,
            this.translation.get('FORMAT.CURRENCY_S').toPromise() ,
            this.config.get('bitcoin-unit') , 
            this.accountService.getDefaultAddress() ,
            this.currencyService.getSelectedCurrencyRate() ,
            this.config.get('payment-request-label')
        ]).then(promised => {       
            this.currency          = promised[0];
            this.currencySeparator = promised[1];
            this.bitcoinUnit       = promised[2];
            this.address           = promised[3];
            this.currencyRate      = promised[4];
            this.label             = promised[5];

            this.paymentRequest = {            
                address : this.address ,
                amount : this.amount.to('BTC') ,
                currency : 'BTC',
                referenceCurrency : this.currency,
                referenceAmount : this.amount.toFiat(this.currencyRate) ,
            };

            this.fiatAmount    = this.currencyService.formatNumber(this.amount.toFiat(this.currencyRate, 2), this.currencySeparator);
            this.bitcoinAmount = this.currencyService.formatNumber(this.amount.to(this.bitcoinUnit), this.currencySeparator, BitcoinUnit.decimalsCount(this.bitcoinUnit));                        
            return this.createQrCode();
        }).then((qrImage) => {
            this.qrImage = qrImage;
            this.initPaymentCheck();
        }).catch((e) => {
            this.navigation.setRoot('amount');
            console.error(e);
        });          
    }

    createQrCode() {
        return new Promise<any> ((resolve, reject) => {
            let bip21uri = bip21.encode(this.address,{
                amount : this.amount.to('BTC') ,
                label : this.label
            });
                           
            let qr:any = qrcode(6,'M');
            qr.addData(bip21uri);
            qr.make();
            resolve(qr.createImgTag(5,5));
        });
    }

    initPaymentCheck() {
        this.paymentRequestHandler = this.paymentService.createPaymentRequestHandler(this.paymentRequest);
        this.paymentRequestHandler
            .once('payment-status:' + PAYMENT_STATUS_RECEIVED, (result) => {
                this.paymentRequest.txid = result.txid;
                this.paymentRequest.txAmount = result.amount;
                this.paymentRequest.status = PAYMENT_STATUS_RECEIVED;
                this.paymentReceived();
            }).once('payment-status:' + PAYMENT_STATUS_OVERPAID, (result) => {
                this.paymentRequest.txid = result.txid;
                this.paymentRequest.txAmount = result.amount;
                this.paymentRequest.status = PAYMENT_STATUS_OVERPAID;
                this.paymentReceived();
            }).once('payment-status:' + PAYMENT_STATUS_PARTIAL_PAID, (result) => {
                this.paymentRequest.txid = result.txid;
                this.paymentRequest.txAmount = result.amount;
                this.paymentRequest.status = PAYMENT_STATUS_PARTIAL_PAID;
                this.paymentReceived();
            });        
    }
        
    paymentReceived() {
        let audio = new Audio('assets/sound/paid.mp3');
        audio.play(); 

        this.navigation.setRoot('payment-result', {
            paymentRequest: this.paymentRequest
        });               
    }

    ionViewWillLeave() {
        this.paymentRequestHandler.cancel();
    }    
    
}
