import {Component} from '@angular/core';
import {NavParams,NavController} from 'ionic-angular';
import {AmountPage} from '../amount/amount';
import {HistoryPage} from '../history/history';
import {CurrencyService, Config, AccountService, BitcoinUnit, AccountSyncService} from '../../providers/index';
import {TranslateService} from '@ngx-translate/core';
import {PaymentRequest} from './../../api/payment-request';
import {Account} from './../../api/account';

@Component({
    templateUrl : 'payment-result.html'
})
export class PaymentResultPage {
    
    resultIcon : string = "";
    resultClass = { "transaction-success" : false , "transaction-failed" : true };
    resultText : string = "";
    success : boolean = false;
    paymentRequest:PaymentRequest;
    account:Account = null;
    
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

    ionViewWillEnter() {
        this.success = (this.params.data.success === true);
        this.paymentRequest = this.params.data.paymentRequest;

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
            this.config.get(Config.CONFIG_KEY_BITCOIN_UNIT) ,
            this.translate.get('FORMAT.CURRENCY_S').toPromise() ,
            this.translate.get('PAYMENT_STATUS.' + this.paymentRequest.status).toPromise() ,
            this.accountService.getDefaultAccount()
        ]).then(promised => {
            this.currency = promised[0];
            this.referenceCurrency = this.paymentRequest.referenceCurrency;
            this.amount = this.currencyService.formatNumber(BitcoinUnit.from(this.paymentRequest.amount,'BTC').to(promised[0]), promised[1], BitcoinUnit.decimalsCount(this.currency));
            this.referenceAmount = this.currencyService.formatNumber(this.paymentRequest.referenceAmount, promised[1]);
            this.resultText = promised[2];
            this.account = promised[3];

            if (this.success) {
                this.accountSyncService.syncAccount(this.account);
            }
        });

        setTimeout(() => {
            if (this.waiting) {
                this.nav.setRoot(AmountPage);
            }
        }, 30000);       
    }

    showHistory() {
        
        this.nav.setRoot(HistoryPage, { account : this.account });
    }
    
    constructor(
        protected accountSyncService: AccountSyncService,
        protected accountService: AccountService,
        protected translate: TranslateService,
        protected currencyService: CurrencyService,
        protected config: Config,
        protected params: NavParams,
        protected nav: NavController) {}
    
}