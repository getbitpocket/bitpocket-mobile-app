import {Component} from '@angular/core';
import {NavParams,NavController} from 'ionic-angular';
import {AmountPage} from '../amount/amount';
import {HistoryPage} from '../history/history';
import {CurrencyService, Config} from '../../providers/index';
import {BitcoinUnit} from '../../providers/currency/bitcoin-unit';
import {TranslateService} from '@ngx-translate/core';
import {PaymentRequest} from './../../api/payment-request';

@Component({
    templateUrl : 'payment-result.html'
})
export class PaymentResultPage {
    
    resultIcon : string = "";
    resultClass = { "transaction-success" : false , "transaction-failed" : true };
    resultText : string = "";
    success : boolean = false;
    paymentRequest:PaymentRequest;
    
    currency:string = "";
    amount:string = "";
    referenceCurrency = "";
    referenceAmount = "";

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
    
    constructor(
        private translate: TranslateService,
        private currencyService: CurrencyService,
        private config: Config,
        private params: NavParams,
        private nav: NavController) {
        this.success = (params.data.success === true);
        this.paymentRequest = params.data.paymentRequest;

        translate.get('PAYMENT_STATUS.' + this.paymentRequest.status)
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
            this.translate.get('FORMAT.CURRENCY_S').toPromise()
        ]).then(promised => {
            this.currency = promised[0];
            this.referenceCurrency = this.paymentRequest.referenceCurrency;
            this.amount = this.currencyService.formatNumber(BitcoinUnit.from(this.paymentRequest.amount,'BTC').to(promised[0]), promised[1], BitcoinUnit.decimalsCount(this.currency));
            this.referenceAmount = this.currencyService.formatNumber(this.paymentRequest.referenceAmount, promised[1]);
        });

        setTimeout(() => {
            if (this.waiting) {
                nav.setRoot(AmountPage);
            }
        }, 30000);                          
    }
    
}