import {Component, ChangeDetectorRef} from '@angular/core';
import {Page,NavParams,NavController} from 'ionic-angular';
import {AmountPage} from '../amount/amount';
import {HistoryPage} from '../history/history';
import {Transaction} from '../../api/transaction';
import {Config} from '../../providers/config';
import {Currency} from '../../providers/currency/currency';
import * as payment from '../../api/payment-service';
import {BitcoinUnit} from '../../providers/currency/bitcoin-unit';
import {Logo} from '../../components/logo';
import {DynamicFontSize} from '../../components/dynamic-font-size';

let PAYMENT_STATUS_MESSAGES = {};
PAYMENT_STATUS_MESSAGES[payment.PAYMENT_STATUS_TIMEOUT]  = 'Payment request timed out, please start again';
PAYMENT_STATUS_MESSAGES[payment.PAYMENT_STATUS_RECEIVED] = 'Your payment was successfully processed';
PAYMENT_STATUS_MESSAGES[payment.PAYMENT_STATUS_SERVICE_ERROR] = 'Bitcoin Network currently not accessable';
PAYMENT_STATUS_MESSAGES[payment.PAYMENT_STATUS_NOT_RECEIVED] = 'Payment not received';
PAYMENT_STATUS_MESSAGES[payment.PAYMENT_STATUS_ERROR] = 'Payment error';

@Component({
    templateUrl : 'build/pages/payment/payment-result.html' ,
    directives : [Logo, DynamicFontSize]
})
export class PaymentResultPage {
    
    resultIcon : string = "";
    resultClass = { "transaction-success" : false , "transaction-failed" : true };
    resultText : string = "";
    success : boolean = false;
    transaction:Transaction;
    
    currency:string = "";
    fiatAmount:string = "";
    bitcoinAmount:string = "";
    bitcoinUnit:string = "";

    waiting:boolean = true;
    
    getResultClasses() {
        return this.resultClass;
    }

    ionViewWillLeave() {
        this.waiting = false;
    }

    showHistory() {
        this.nav.setRoot(HistoryPage);
    }
    
    constructor(private currencyService: Currency, private config: Config, private params: NavParams, private nav: NavController, private changeDetector: ChangeDetectorRef) {
        this.success = (params.data.success === true);
        this.transaction = params.data.transaction;
        console.debug('PaymentResultPage: Page loaded', params);

        if (PAYMENT_STATUS_MESSAGES[params.data.status]) {
            this.resultText = PAYMENT_STATUS_MESSAGES[params.data.status];
        } else {
            this.resultText = PAYMENT_STATUS_MESSAGES[payment.PAYMENT_STATUS_ERROR];
        }

        if (this.success) {
            this.resultClass["transaction-success" ] = true;
            this.resultClass["transaction-failed" ]  = false;
            this.resultIcon = "checkmark-circle";
        } else {
            this.resultClass["transaction-success" ] = false;
            this.resultClass["transaction-failed" ]  = true;
            this.resultIcon = "close-circle";
        }
        
        Promise.all<any>([
            this.config.get('bitcoin-unit') ,
            this.config.get('currency-format-s')
        ]).then(promised => {
            this.bitcoinUnit = promised[0];
            this.currency = this.transaction.currency;
            this.bitcoinAmount = this.currencyService.formatNumber(BitcoinUnit.from(this.transaction.bitcoinAmount,'BTC').to(this.bitcoinUnit), promised[1]);
            this.fiatAmount = this.currencyService.formatNumber(this.transaction.fiatAmount, promised[1]);
            console.debug('PaymentResultPage: Data loaded');
            this.changeDetector.detectChanges();
        })
                
        setTimeout(() => {
            if (this.waiting) {
                nav.setRoot(AmountPage);
            }
        }, 7000);                           
    }
    
}