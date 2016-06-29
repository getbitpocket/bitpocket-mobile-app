import {Component, ChangeDetectorRef} from '@angular/core';
import {History} from '../../providers/history/history';
import {Transaction} from '../../api/transaction';
import {CurrencyPipe} from '../../pipes/currency';
import {Logo} from '../../components/logo';

@Component({
    templateUrl : 'build/pages/history/history.html' ,
    pipes : [CurrencyPipe] ,
    directives: [Logo]   
})
export class HistoryPage {
    
    transactions: Array<Transaction>;
    
    constructor(private history: History, private changeDetector: ChangeDetectorRef) {         
        history.queryTransactions().then(transactions => {
            this.transactions = transactions;
            this.changeDetector.detectChanges();
        });
    }

    deleteTransaction(txid: string) {
        this.history.deleteTransaction(txid);
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