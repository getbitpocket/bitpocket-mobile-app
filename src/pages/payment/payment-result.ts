import {Component, ChangeDetectorRef} from '@angular/core';
import {NavParams,NavController} from 'ionic-angular';
import {AmountPage} from '../amount/amount';
import {HistoryPage} from '../history/history';
import {Transaction} from '../../api/transaction';
import {Config} from '../../providers/config';
import {Currency} from '../../providers/currency/currency';
import * as payment from '../../api/payment-service';
// import {BitcoinUnit} from '../../providers/currency/bitcoin-unit';

import {TranslateService} from '@ngx-translate/core';

let PAYMENT_STATUS_MESSAGES = {};
PAYMENT_STATUS_MESSAGES[payment.PAYMENT_STATUS_TIMEOUT]  = 'Payment request timed out, please start again';
PAYMENT_STATUS_MESSAGES[payment.PAYMENT_STATUS_RECEIVED] = 'Your payment was successfully processed';
PAYMENT_STATUS_MESSAGES[payment.PAYMENT_STATUS_SERVICE_ERROR] = 'Bitcoin Network currently not accessable';
PAYMENT_STATUS_MESSAGES[payment.PAYMENT_STATUS_NOT_RECEIVED] = 'Payment not received';
PAYMENT_STATUS_MESSAGES[payment.PAYMENT_STATUS_ERROR] = 'Payment error';

@Component({
    templateUrl : 'payment-result.html'
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
    
    constructor(private translate: TranslateService, private currencyService: Currency, private config: Config, private params: NavParams, private nav: NavController, private changeDetector: ChangeDetectorRef) {
        this.success = (params.data.success === true);
        this.transaction = params.data.transaction;

        translate.get('PAYMENT_STATUS.' + params.data.status)
            .subscribe((res:string) => {
                this.resultText = res;
            });

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
            // this.bitcoinAmount = this.currencyService.formatNumber(BitcoinUnit.from(this.transaction.bitcoinAmount,'BTC').to(promised[0]), promised[1], BitcoinUnit.decimalsCount(this.bitcoinUnit));
            this.fiatAmount    = this.currencyService.formatNumber(this.transaction.fiatAmount, promised[1]);
            this.changeDetector.detectChanges();
        });

        setTimeout(() => {
            if (this.waiting) {
                nav.setRoot(AmountPage);
            }
        }, 7000);                          
    }
    
}