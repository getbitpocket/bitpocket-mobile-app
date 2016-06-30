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
    currencyThousandsPoint: string;
    currencySeparator: string;
    
    constructor(private history: History, private config: Config, private payment: Payment, private nav: NavController, private changeDetector: ChangeDetectorRef) {    

        let loading = Loading.create({
            content: 'Checking Transactions'
        });
        nav.present(loading);

        payment.updateConfirmations().then(() => {
            Promise.all<any>([
                history.queryTransactions(10,0) ,
                config.get('currency-format-t') ,
                config.get('currency-format-s')
            ]).then(promised => {
                this.transactions = promised[0];
                this.currencyThousandsPoint = promised[1];
                this.currencySeparator = promised[2];
                loading.dismiss();
            });
        });

        
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