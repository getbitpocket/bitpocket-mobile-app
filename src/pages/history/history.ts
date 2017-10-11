import { Component } from '@angular/core';
import { Account } from './../../api/account';
import { BitcoinUnit, TransactionStorageService, CurrencyService, Config, AccountSyncService } from './../../providers/index';
import { NavController, LoadingController, NavParams, IonicPage } from 'ionic-angular';
import { Transaction } from '../../api/transaction';
import { TranslateService } from '@ngx-translate/core'

@IonicPage({
    name : 'history' ,
    defaultHistory: ['account']
})
@Component({
    templateUrl : 'history.html'
})
export class HistoryPage {
    
    moreContentAvailable: boolean = true;

    account:Account = null;
    transactions: Array<Transaction> = [];

    currencyThousandsPoint: string = "";
    currencySeparator: string = "";
    currencyPrecision: number = 2;   
    currencySymbol:string = "BTC";
    dateTimeFormat: any;

    referenceCurrencySymbol:string = "";
    referenceCurrencyRate:number = 0;

    loader:any;
    
    constructor(
        private navParams: NavParams,
        private config: Config,
        private currencyService: CurrencyService,
        private loading: LoadingController,
        private transactionStorageService:TransactionStorageService,
        private accountSyncService:AccountSyncService,
        private nav: NavController,
        private translation: TranslateService) {    
            this.account = this.navParams.get('account');        
        }

    ionViewWillEnter() {
        Promise.all<any>([
            this.translation.get('FORMAT.CURRENCY_T').toPromise() ,
            this.translation.get('FORMAT.CURRENCY_S').toPromise() ,
            this.translation.get('FORMAT.DATETIME').toPromise() ,
            this.translation.get('TEXT.LOADING_TRANSACTIONS').toPromise() ,
            this.config.get(Config.CONFIG_KEY_BITCOIN_UNIT) ,
            this.currencyService.getSelectedCurrency() ,
            this.currencyService.getSelectedCurrencyRate()
        ]).then(promised => {
            this.currencyThousandsPoint = promised[0];
            this.currencySeparator = promised[1];
            this.dateTimeFormat = promised[2];
            this.currencySymbol = promised[4];
            this.currencyPrecision = BitcoinUnit.decimalsCount(promised[4]);
            this.referenceCurrencySymbol = promised[5];
            this.referenceCurrencyRate = promised[6];

            this.loader = this.loading.create({
                content: promised[3]
            });
            this.loader.present();

            return this.accountSyncService.syncAccount(this.account);
        }).then(() => {
            return this.findTransactions();
        }).then((transactions) => {
            this.transactions = transactions;
            this.loader.dismiss();
        }).catch(e => {
            console.debug("History Error: ", e);
            this.loader.dismiss();
        });
    }

    addTransactions(transactions: Array<Transaction>) {
        if (transactions && transactions.length <= 0) {
            this.moreContentAvailable = false;
            return;
        } else {
            this.moreContentAvailable = true;
        }
        
        for(let t of transactions) {
            this.transactions.push(t);
        }        
    }

    openTransaction(txid: string) {
        if (/testnet/.test(this.account.type)) {
            window.open('https://live.blockcypher.com/btc-testnet/tx/' + txid, '_system');
        } else {
            window.open('https://blockchain.info/tx/' + txid, '_system');
        }        
    }

    findTransactions() {
        return this.transactionStorageService.retrieveTransactions({
            from : this.transactions.length ,
            to : this.transactions.length + 10 ,
            account : this.account
        });
    }

    loadTransactions(infiniteScroll) {
        this.findTransactions().then(transactions => {
            this.addTransactions(transactions);
            infiniteScroll.complete();
        }).catch(() => {
            infiniteScroll.complete();
        });
    }    
}