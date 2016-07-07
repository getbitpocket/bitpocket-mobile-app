import {Component, ChangeDetectorRef} from '@angular/core';
import {Loading, NavController} from 'ionic-angular';
import {Payment} from '../../providers/payment/payment';
import {History} from '../../providers/history/history';
import {Currency} from '../../providers/currency/currency';
import {Config} from '../../providers/config';
import {Transaction} from '../../api/transaction';
import {Logo} from '../../components/logo';

@Component({
    templateUrl : 'build/pages/history/history.html' ,
    directives: [Logo]   
})
export class HistoryPage {
    
    transactions: Array<{txid: string, fiatAmount:string, currency:string, timestamp:number}> = [];
    currencyThousandsPoint: string = "";
    currencySeparator: string = "";
    
    constructor(private history: History, private config: Config, private currency: Currency, private payment: Payment, private nav: NavController, private changeDetector: ChangeDetectorRef) {    

        let loading = Loading.create({
            content: 'Checking Transactions'
        });
        nav.present(loading);

        try {
            Promise.all<string>([
                config.get('currency-format-t') ,
                config.get('currency-format-s')
            ]).then(promised => {
                payment.updateConfirmations()
                    .then(() => { return history.queryTransactions(10,0) })
                    .then(transactions => {
                        this.addTransactions(transactions);
                        loading.dismiss();                        
                    })
                    .catch(() => {
                        loading.dismiss();
                    });
            });
        } catch (e) {
            console.debug("History Error: ", e);
            loading.dismiss();
        }       
    }

    addTransactions(transactions: Array<Transaction>) {
        for(let t of transactions) {
            this.transactions.push({
                txid : t.txid ,
                fiatAmount : this.currency.formatNumber(t.fiatAmount,this.currencySeparator) ,
                timestamp : t.timestamp ,
                currency : t.currency
            });
        }
        this.changeDetector.detectChanges();
    }

    deleteTransaction(index: number) {
        this.history.deleteTransaction(this.transactions[index].txid);
        this.transactions.splice(index,1);        
    }

    openTransaction(txid: string) {
        window.open('https://blockchain.info/tx/' + txid, '_system');
    }

    loadTransactions(infiniteScroll) {
        this.history.queryTransactions(10,this.transactions.length-1).then(transactions => {
            this.addTransactions(transactions);
            infiniteScroll.complete();
        }).catch(() => {
            infiniteScroll.complete();
        });
    }    
}