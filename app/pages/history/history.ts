import {Component} from '@angular/core';
import {NavParams,NavController} from 'ionic-angular';
import {History} from '../../providers/history/history';
import {Currency} from '../../providers/currency/currency';
import {Config} from '../../providers/config';
import {BitcoinUnit} from '../../providers/currency/bitcoin-unit';
import {Transaction} from '../../api/transaction';
import {CurrencyPipe} from '../../pipes/currency';
import {Payment} from '../../providers/payment/payment';

@Component({
    templateUrl : 'build/pages/history/history.html' ,
    pipes : [CurrencyPipe]   
})
export class HistoryPage {
    
    transactionList: Array<Transaction>;
    usedCurrencyList: Array<any> = [];
    currencyFormatSeparator: string;
    currencyFormatThousandsPoint: string;
    transactions: boolean;
    sumBitcoinAmount: number = 0;
    sumUnconfirmendTransactionBitcoinAmount: number = 0;
    
    constructor(private history: History, private currency: Currency, private config: Config, private payment: Payment) {         

        this.payment.updateConfirmations([
            {
                txid : 'fef7ddf5373ec5b0143db3eb75429e7a7a4e9980893de95a911d55bf010b5f9f' ,
                address : '1GLaS11iwJofTeRvRmRPwK7DtdPhrU8mat' ,
                bitcoinAmount : 100 ,
                fiatAmount : 100 ,
                currency : 'EUR'            
            }
        ]).then(transactions => { console.log(transactions); });

        Promise.all<any>([
            history.queryTransactions() ,
            config.get('currency-format-s') ,
            config.get('currency-format-t')
        ]).then(promises => {            
            
            // currency formatting
            this.currencyFormatSeparator = promises[1];
            this.currencyFormatThousandsPoint = promises[2];
            
            // transactions
            for (let transaction of promises[0]) {
                transaction['symbol'] = this.currency.getCurrencySymbol(transaction.currency);
            }
            this.transactionList = promises[0];

            if(this.transactionList.length > 0){
                this.transactions = true;
            }

            // sum amount each currency
            //let usedCurrencyList = [];
            // sum Bitcoins and Unconfirmend Bitcoins
            let sumBitcoin = 0;
            let sumUnconfirmend = 0;
            for (let transaction of this.transactionList) {
                sumBitcoin += transaction.bitcoinAmount;
                if(transaction.confirmations < 6){
                    sumUnconfirmend += transaction.bitcoinAmount;
                }
                let pos = this.usedCurrencyList.map(function(e) { return e.currency; }).indexOf(transaction.currency);
                if(pos != -1){
                    this.usedCurrencyList[pos].amount += transaction.fiatAmount;
                } else {
                    let currencyEntry = {
                        currency: transaction.currency,
                        amount: transaction.fiatAmount
                    };
                    this.usedCurrencyList.push(currencyEntry);
                }
            }

            // Round Amount ???
            this.sumBitcoinAmount = this.round(sumBitcoin, 4);
            this.sumUnconfirmendTransactionBitcoinAmount = this.round(sumUnconfirmend, 4);

            // TEST

            for(let i = 0; i <= this.usedCurrencyList.length; i++){
                console.log(this.usedCurrencyList[i].amount + " " + this.usedCurrencyList[i].currency);
            }
             console.log("sumBitcoinAmount: " + this.sumBitcoinAmount);
             console.log("sumUnconfirmendTransactionBitcoinAmount: " + this.sumUnconfirmendTransactionBitcoinAmount);

        });
    }

    round(value, precision) {
    let multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
    }
    
}