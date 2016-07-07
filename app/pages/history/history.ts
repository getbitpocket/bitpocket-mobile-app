import {Component, ChangeDetectorRef} from '@angular/core';
import {Loading, NavController} from 'ionic-angular';
import {Payment} from '../../providers/payment/payment';
import {History} from '../../providers/history/history';
import {Config} from '../../providers/config';
import {Transaction} from '../../api/transaction';
import {CurrencyPipe} from '../../pipes/currency';
import {Logo} from '../../components/logo';

@Component({
    templateUrl : 'build/pages/history/history.html' ,
    pipes : [CurrencyPipe] ,
    directives: [Logo]   
})
export class HistoryPage {
    
    transactions: Array<Transaction> = [];
    currencyThousandsPoint: string = "";
    currencySeparator: string = "";
    
    constructor(private history: History, private config: Config, private payment: Payment, private nav: NavController, private changeDetector: ChangeDetectorRef) {    

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
                        this.transactions = transactions;
                        loading.dismiss();
                        this.changeDetector.detectChanges();
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

    deleteTransaction(index: number) {
        this.history.deleteTransaction(this.transactions[index].txid);
        this.transactions.splice(index,1);        
    }

    openTransaction(txid: string) {
        window.open('https://blockchain.info/tx/' + txid, '_system');
    }

    loadTransactions(infiniteScroll) {
        this.history.queryTransactions(10,this.transactions.length-1).then(transactions => {
            for (let t of transactions) {
                this.transactions.push(t);
            }

            infiniteScroll.complete();
        }).catch(() => {
            infiniteScroll.complete();
        });
    }    
}