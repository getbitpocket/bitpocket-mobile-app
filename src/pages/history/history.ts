import { Component } from '@angular/core';
import { Account } from './../../api/account';
import { BitcoinUnit, TransactionStorageService, CurrencyService, Config, AccountSyncService } from './../../providers/index';
import { NavController, LoadingController, NavParams, IonicPage, ModalController } from 'ionic-angular';
import { Transaction } from '../../api/transaction';
import { TranslateService } from '@ngx-translate/core'
import 'rxjs/add/operator/toPromise';

@IonicPage({
    name : 'history' ,
    segment : 'history/:account' ,
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
    loaderText:string = "";

    referenceCurrencySymbol:string = "";
    referenceCurrencyRate:number = 0;

    loader:any;
    
    constructor(
        protected navParams: NavParams,
        protected config: Config,
        protected currencyService: CurrencyService,
        protected loading: LoadingController,
        protected transactionStorageService:TransactionStorageService,
        protected accountSyncService:AccountSyncService,
        protected nav: NavController,
        protected modalController: ModalController,
        protected translation: TranslateService) {    
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
            this.loaderText = promised[3];
            this.presentLoader();

            return this.accountSyncService.syncAccount(this.account);
        }).then(() => {
            return this.findTransactions();
        }).then((transactions) => {
            this.transactions = transactions;
            this.dissmissLoader();
        }).catch(e => {
            console.debug("History Error: ", e);
            this.dissmissLoader();
        });
    }

    presentLoader() {
        this.loader = this.loading.create({
            content: this.loaderText
        });
        this.loader.present();
    }

    dissmissLoader() {
        if (this.loader) {
            this.loader.dismiss();
        }
    }

    addTransactions(transactions: Array<Transaction>) : boolean {
        if (transactions && transactions.length <= 0) {
            this.moreContentAvailable = false;
            return this.moreContentAvailable;
        } else {
            this.moreContentAvailable = true;
        }
        
        for(let t of transactions) {
            this.transactions.push(t);
        }        

        return this.moreContentAvailable;
    }

    openTransactionDetails(txid: string) {
        this.modalController.create('transaction', {
            txid : txid
        }).present();
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

    loadAllTransactions() {
        return new Promise<void> ((resolve, reject) => {
            this.findTransactions().then(transactions => {
                if (this.addTransactions(transactions)) {
                    resolve(this.loadAllTransactions());
                } else {
                    resolve();
                }
            });
        });        
    }
    
    export() {
        this.presentLoader();
        this.loadAllTransactions()
            .then(() => {                
                let lines = [];
                for (let t = 0; t < this.transactions.length; t++) {
                    let line = [
                        this.transactions[t]._id,
                        (new Date(this.transactions[t].timestamp * 1000)).toUTCString(),
                        this.transactions[t].address,
                        this.transactions[t].amount,
                        this.transactions[t].currency,
                        this.transactions[t].incomming ? 'in' : 'out',
                        this.transactions[t].paymentReferenceAmount > 0 ? this.transactions[t].paymentReferenceAmount : '' ,
                        this.transactions[t].paymentReferenceCurrency ? this.transactions[t].paymentReferenceCurrency : '' ,
                        this.transactions[t].paymentStatus ? this.transactions[t].paymentStatus : ''
                    ].join(',');
                    lines.push(t == 0 ? "data:text/csv;charset=utf-8," + line : line);                    
                }
                this.dissmissLoader();
                window.open(lines.join("\n"));
            });
    }    
}