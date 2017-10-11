import { Injectable } from '@angular/core';
import { CryptocurrencyService, TransactionServiceWrapper, TransactionStorageService, AccountService } from './../index';
import { Account } from './../../api/account';
import { Transaction } from './../../api/transaction';

@Injectable()
export class AccountSyncService {

    readonly retrievalLength:number = 20;

    constructor(
        protected transactionService: TransactionServiceWrapper ,
        protected transactionStorageService: TransactionStorageService ,
        protected accountService: AccountService ,
        protected cryptocurrencyService: CryptocurrencyService
    ) {}

    syncAccount(account:Account) : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let startIndex = account.lastConfirmedIndex > 0 ? (account.lastConfirmedIndex + 1) : 0;

            if (/static-address/.test(account.type)) {                
                this.syncAddress(account.data, startIndex).then(result => {
                    account.lastConfirmedIndex = result.lastConfirmedIndex;
                    resolve(this.accountService.editAccount(account));    
                });                                
            } else {
                resolve(this.syncXpubKey(account, startIndex));
            }
        });        
    }

    syncXpubKey(account:Account, index:number = 0) : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {              
                this.syncAddress(this.cryptocurrencyService.deriveAddress(account.data, index), 0, account._id)
                    .then(result => {                                       
                        // there are transactions and
                        // all transactions are fully confirmed and 
                        // last confirmed index is exactly 1 step below current index
                        if (result.count > 0 &&
                            account.lastConfirmedIndex == (index-1) &&
                            result.lastConfirmedIndex  == (result.count-1)) {
                            account.index = index;                            
                            account.lastConfirmedIndex = index;
                        } else if (index <= 0) {
                            account.index = index;
                            account.lastConfirmedIndex = -1;
                        } else if (result.count > 0) {
                            account.index = index;
                        } 
                                                
                        if (account.index == index) {
                            console.log("index / confirmedIndex", account.index, account.lastConfirmedIndex, result.count, result.lastConfirmedIndex);
                            resolve(Promise.all([
                                this.accountService.editAccount(account) ,
                                this.syncXpubKey(account, index + 1)
                            ]));
                        } else {
                            resolve();
                        }
                    }).catch(e => {
                        reject(e);
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * 
     * Returns final:true if all transactions are completed, fina:false if some transactions are not
     * 
     * @param address 
     * @param index 
     * @param accountId 
     */
    syncAddress(address:string, index:number = 0, accountId:string = null) : Promise<{ lastConfirmedIndex:number, count:number }> {   
        return new Promise<{ lastConfirmedIndex:number, count:number }>((resolve, reject) => {
            this.retrieveTransactions(address, index)
                .then((transactions:Transaction[]) => {
                    let promises = [];                                    
                    for (let i = 0; i < transactions.length; i++) {       
                        promises.push(this.checkUpdateTransaction(transactions[i], accountId));                                 
                    }                    
                    return Promise.all(promises);                
                }).then((transactions:Transaction[]) => {
                    let response = {
                        lastConfirmedIndex : transactions.length - 1 ,
                        count : transactions.length
                    };
                                       
                    for (let transaction of transactions) {
                        if (!this.cryptocurrencyService.isConfirmed(transaction)) {
                            --response.lastConfirmedIndex;
                        }
                    }

                    resolve(response);
                }).catch(e => {
                    reject(e);
                });            
        });
    }
    
    checkUpdateTransaction(transaction:Transaction, accountId:string = null) : Promise<Transaction> {
        return new Promise<Transaction> ((resolve, reject) => {
            this.transactionStorageService
                .retrieveTransaction(transaction._id)
                .then((storedTransaction:Transaction) => {
                    if (!this.cryptocurrencyService.isConfirmed(storedTransaction) || (!!accountId && !storedTransaction.account) ){
                        storedTransaction.timestamp = transaction.timestamp;
                        storedTransaction.confirmations = transaction.confirmations;
                        storedTransaction.account = accountId;
                        resolve(this.transactionStorageService.storeTransaction(storedTransaction));
                    } else {
                        resolve(storedTransaction);
                    }        
                }).catch(() => {
                    transaction.account = accountId;
                    resolve(this.transactionStorageService.storeTransaction(transaction));
                });
        });        
    }

    /**
     * 
     * Retrieve transactions recursively
     * 
     * @param address 
     * @param index 
     * @param head 
     */
    retrieveTransactions(address:string, index:number = 0, head:Array<Transaction> = []) : Promise<Array<Transaction>>  {
        return new Promise<Array<Transaction>>((resolve, reject) => {
            this.transactionService.findTransactions({
                addresses : [address] ,
                from      : index ,
                to        : (index + this.retrievalLength)
            }).then((transactions:Transaction[]) => {
                if (transactions.length >= this.retrievalLength) {
                    resolve(this.retrieveTransactions(address, index + this.retrievalLength, head.concat(transactions)));
                } else {                    
                    resolve(head.concat(transactions));
                }
            });
        });
    }

}