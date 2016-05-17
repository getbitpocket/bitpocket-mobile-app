import {Page,NavParams,NavController} from 'ionic-angular';
import {History} from '../../providers/history/history';
import {Currency} from '../../providers/currency/currency';
import {Config} from '../../providers/config';
import {BitcoinUnit} from '../../providers/currency/bitcoin-unit';
import {Transaction} from '../../api/transaction';
import {CurrencyPipe} from '../../pipes/currency';

@Page({
    templateUrl : 'build/pages/history/history.html' ,
    pipes : [CurrencyPipe]   
})
export class HistoryPage {
    
    transactionList: Array<Transaction>;    
    currencyFormatSeparator: string;
    currencyFormatThousandsPoint: string;
    
    constructor(private history: History, private currency: Currency, private config: Config) {  
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
            
        });        
    }
    
}