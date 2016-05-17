import {Injectable} from 'angular2/core';
import {DatabaseHelper} from '../database-helper';
import {Transaction} from '../../api/transaction';

const SQL_ADD_TRANSACTION = "INSERT INTO tx (timestamp,txid,currency,address,bitcoinAmount,fiatAmount,confirmations) VALUES (?,?,?,?,?,?,?);";
const SQL_UPDATE_CONFIRMATIONS = "UPDATE tx SET confirmations = ? WHERE txid = ?";
const SQL_QUERY_TRANSACTIONS = "SELECT * FROM tx ORDER BY timestamp DESC;";

@Injectable()
export class History {
    
    constructor(private dbHelper: DatabaseHelper) {
    }
    
    queryTransactions() : Promise<Array<Transaction>> {
        let transactions: Array<Transaction> = [];
        
        return new Promise<Array<Transaction>> ((resolve, reject) => {
            this.dbHelper.executeSql(SQL_QUERY_TRANSACTIONS,[]).then((results) => {                                
                for (let i = 0; i < results.rows.length; i++) {
                    let row = results.rows.item(i);                    
                    
                    let tx = {
                        txid : row['txid'] ,
                        confirmations : row['confirmations'] ,
                        timestamp : row['timestamp'] ,
                        currency : row['currency'] ,
                        address : row['address'] ,
                        bitcoinAmount : row['bitcoinAmount'] ,
                        fiatAmount : row['fiatAmount']
                    };
                    
                    transactions.push(tx);
                }
                
                resolve(transactions);
            });           
        });
    }
    
    updateConfirmations(txid: string, confirmations: number) {
        this.dbHelper.executeSql(SQL_UPDATE_CONFIRMATIONS,[
            confirmations ,
            txid
        ]);
    }
    
    addTransaction(transaction: Transaction) {
        let inputs = [];
        inputs.push((new Date()).getTime());
        inputs.push(transaction.txid);
        inputs.push(transaction.currency);
        inputs.push(transaction.address);
        inputs.push(transaction.bitcoinAmount);
        inputs.push(transaction.fiatAmount);
        inputs.push(0);
        
        this.dbHelper.executeSql(SQL_ADD_TRANSACTION, inputs);
    }
    
}