import { TransactionStorageService } from './../../providers/transaction/transaction-storage-service';
import { Account } from './../../api/account';
import { BitcoinUnit } from './../../providers/currency/bitcoin-unit';
import {Component} from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import {Currency} from '../../providers/currency/currency';
import { AccountSyncService } from './../../providers/account/account-sync-service';
import {Config} from '../../providers/config';
import {Transaction} from '../../api/transaction';
import {TranslateService} from '@ngx-translate/core'

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

    loader:any;
    
    constructor(
        private navParams: NavParams,
        private config: Config,
        private currency: Currency,
        private loading: LoadingController,
        private transactionStorageService:TransactionStorageService,
        private accountSyncService:AccountSyncService,
        private nav: NavController,
        private translation: TranslateService) {    
        
        try {
            this.account = this.navParams.get('account');
            
            Promise.all<any>([
                translation.get('FORMAT.CURRENCY_T').toPromise() ,
                translation.get('FORMAT.CURRENCY_S').toPromise() ,
                translation.get('FORMAT.DATETIME').toPromise() ,
                config.get('bitcoin-unit') ,
                translation.get('TEXT.LOADING_TRANSACTIONS').toPromise()
            ]).then(promised => {
                this.currencyThousandsPoint = promised[0];
                this.currencySeparator = promised[1];
                this.dateTimeFormat = promised[2];
                this.currencySymbol = promised[3];
                this.currencyPrecision = BitcoinUnit.decimalsCount(promised[3]);

                this.loader = this.loading.create({
                    content: promised[4]
                });
                this.loader.present();

                return this.accountSyncService.syncAccount(this.account);
            }).then(() => {
                return this.findTransactions();
            }).then((transactions) => {
                this.transactions = transactions;
                this.loader.dismiss();
            });
        } catch (e) {
            console.debug("History Error: ", e);
            this.loader.dismiss();
        }       

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
        window.open('https://blockchain.info/tx/' + txid, '_system');
    }

    findTransactions() {
        return this.transactionStorageService.retrieveTransactions({
            from : this.transactions.length ,
            to : this.transactions.length + 10 ,
            addresses : [this.account.data]
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