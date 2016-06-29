import {Injectable} from '@angular/core';
import {DatabaseHelper} from '../database-helper';
import {Transaction} from '../../api/transaction';

const SQL_ADD_TRANSACTION = "INSERT INTO tx (timestamp,txid,currency,address,bitcoinAmount,fiatAmount,confirmations) VALUES (?,?,?,?,?,?,?);";
const SQL_UPDATE_CONFIRMATIONS = "UPDATE tx SET confirmations = ? WHERE txid = ?;";
const SQL_DELETE_TRANSACTION = "DELETE FROM tx WHERE txid = ?";
const SQL_QUERY_TRANSACTIONS = "SELECT * FROM tx ORDER BY timestamp DESC LIMIT ? OFFSET ?;";
const SQL_QUERY_HAS_TRANSACTION = "SELECT * FROM tx WHERE txid = ? AND address = ?;";
const SQL_QUERY_UNCONFIRMED_TRANSACTIONS = "SELECT * FROM tx WHERE confirmations < 6;";
const SQL_QUERY_TRANSACTIONS_SUM_BTC = "SELECT SUM(bitcoinAmount) FROM tx WHERE confirmations > ?";
const SQL_QUERY_TRANSACTIONS_SUM_FIAT = "SELECT SUM (fiatAmount) FROM tx GROUP BY currency confirmations > ?";

@Injectable()
export class History {
    
    constructor(private dbHelper: DatabaseHelper) {
    }
    
    /**
     * Find transaction by txid and address, which is not yet in history
     * @return number index of txid in array
     */
    findNewTransaction(txids: Array<string>, address: string, currentIndex: number = 0) : Promise<number> {
        return new Promise<number>((resolve,reject) => {
            if (currentIndex >= txids.length) {
                resolve(-1);
            } else {
                this.hasTransaction(txids[currentIndex], address)
                    .then(result => {
                        if (result) {
                            resolve(this.findNewTransaction(txids, address, currentIndex+1));
                        } else {
                            resolve(currentIndex);
                        }
                    })
                    .catch(() => {
                        resolve(-1);
                    });
            }
        });        
    }

    findUnconfirmedTransactions() : Promise<Array<Transaction>> {
        let transactions: Array<Transaction> = [];
        
        return new Promise<Array<Transaction>> ((resolve, reject) => {
            this.dbHelper.executeSql(SQL_QUERY_UNCONFIRMED_TRANSACTIONS,[]).then((results) => {
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
            }).catch(error => {
                reject(error);
            });
        });            
    }

    hasTransaction(txid:string, address:string) : Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            this.dbHelper.executeSql(SQL_QUERY_HAS_TRANSACTION,[txid, address]).then((results) => {
                resolve(results.rows.length > 0);
            }).catch(error => {
                reject(error);
            });           
        });
    }

    queryTransactionSums(confirmed: boolean = true, btc: boolean = true) : Promise<any> {
        return new Promise<any> (() => {
            // this.dbHelper.executeSql();
        });
    }

    queryTransactions(limit:number = 10, offset:number = 0) : Promise<Array<Transaction>> {
        let transactions: Array<Transaction> = [];
        
        return new Promise<Array<Transaction>> ((resolve, reject) => {
            this.dbHelper.executeSql(SQL_QUERY_TRANSACTIONS,[limit, offset]).then((results) => {                                
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
            }).catch(error => {
                reject(error);
            });           
        });
    }
    
    updateConfirmations(txid: string, confirmations: number) : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {        
            this.dbHelper.executeSql(SQL_UPDATE_CONFIRMATIONS,[
                confirmations ,
                txid
            ]).then(() => {
                resolve(true);
            }).catch(() => {
                reject(false);
            });        
        });
    }

    deleteTransaction(txid: string) : Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {        
            this.dbHelper.executeSql(SQL_DELETE_TRANSACTION,[
                txid
            ]).then(() => {
                resolve(true);
            }).catch(() => {
                reject(false);
            });        
        });
    }
    
    addTransaction(transaction: Transaction) : Promise<boolean> {
        let inputs = [];
        inputs.push((new Date()).getTime());
        inputs.push(transaction.txid);
        inputs.push(transaction.currency);
        inputs.push(transaction.address);
        inputs.push(transaction.bitcoinAmount);
        inputs.push(transaction.fiatAmount);
        inputs.push(0);
        
        return new Promise<boolean>((resolve, reject) => {
            this.dbHelper
            .executeSql(SQL_ADD_TRANSACTION, inputs)
            .then(() => {
                resolve(true);
            })
            .catch(() => {
                reject(false);
            });
        });
    }
    
}