import { TransactionStorageService, Config, CurrencyService, BitcoinUnit } from './../../providers/index';
import { Transaction } from './../../api/transaction';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core'
import 'rxjs/add/operator/toPromise';

@IonicPage({
    name : 'transaction' ,
    segment : 'transaction/:txid'
})
@Component({
    templateUrl: 'transaction.html',
})
export class TransactionPage {

    txid:string;
    transaction:any = {};

    currencyThousandsPoint: string = "";
    currencySeparator: string = "";
    currencyPrecision: number = 2;   
    currencySymbol:string = "BTC";
    dateTimeFormat: any;
    referenceCurrencySymbol:string = "";
    referenceCurrencyRate:number = 0;

    constructor(
        protected currencyService: CurrencyService,
        protected config: Config,
        protected translation: TranslateService ,
        protected transactionStorageService: TransactionStorageService ,
        protected viewController: ViewController ,
        protected navParams: NavParams) {
        this.txid = navParams.get('txid');
    }

    ionViewDidEnter() {           
        Promise.all<any>([
            this.translation.get('FORMAT.CURRENCY_T').toPromise() ,
            this.translation.get('FORMAT.CURRENCY_S').toPromise() ,
            this.translation.get('FORMAT.DATETIME').toPromise() ,
            this.translation.get('TEXT.LOADING_TRANSACTIONS').toPromise() ,
            this.config.get(Config.CONFIG_KEY_BITCOIN_UNIT) ,
            this.currencyService.getSelectedCurrency() ,
            this.currencyService.getSelectedCurrencyRate() ,
            this.transactionStorageService.retrieveTransaction(this.txid)
        ]).then(promised => {
            this.currencyThousandsPoint = promised[0];
            this.currencySeparator = promised[1];
            this.dateTimeFormat = promised[2];
            this.currencySymbol = promised[4];
            this.currencyPrecision = BitcoinUnit.decimalsCount(promised[4]);
            this.referenceCurrencySymbol = promised[5];
            this.referenceCurrencyRate = promised[6];  
            this.transaction = promised[7];
        });
    }

    close() {
        this.viewController.dismiss();
    }

}
