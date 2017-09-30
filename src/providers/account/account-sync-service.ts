import { Injectable } from '@angular/core';
import { CryptocurrencyService, InsightTransactionService, TransactionStorageService, AccountService } from './../index';
import { Account } from './../../api/account';
import { Transaction } from './../../api/transaction';

@Injectable()
export class AccountSyncService {

    readonly retrievalLength:number = 20;

    constructor(
        protected transactionService: InsightTransactionService ,
        protected transactionStorageService: TransactionStorageService ,
        protected accountService: AccountService ,
        protected cryptocurrencyService: CryptocurrencyService
    ) {}

    syncAccount(account:Account) : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (/static-address/.test(account.type)) {
                resolve(this.syncAddress(account.data));                    
            } else {
                resolve(this.syncXpubKey(account));
            }
        });        
    }

    syncXpubKey(account:Account) : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                if (!account.index) {
                    account.index = 1;
                }

                let address = this.cryptocurrencyService.deriveAddress(account.data, account.index);
                this.syncAddress(address, 0, account._id)
                    .then(count => {                
                        if (count > 0) {             
                            account.index = (account.index + 1);         
                            resolve(this.syncXpubKey(account));
                        } else {
                            resolve(this.accountService.editAccount(account));
                        }
                    });
            } catch (e) {
                reject(e);
            }
        });
    }

    syncAddress(address:string, index:number = 0, accountId:string = null) : Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.transactionService.findTransactions({
                addresses: [address] ,
                from: index ,
                to : (index + this.retrievalLength)
            }).then((transactions:Transaction[]) => {
                let promises = [];                
                for (let i = 0; i < transactions.length; i++) {        
                    promises.push(this.checkUpdateTransaction(transactions[i]));                    
                }
                return Promise.all(promises);                
            }).then((promises:any) => {                
                let filtered = promises.filter((item) => {
                    return !!item;
                });
                if (filtered && filtered.length >= this.retrievalLength) {
                    resolve(this.syncAddress(address, index + this.retrievalLength));
                } else {
                    resolve(filtered.length);
                }
            }).catch((e) => {
                reject(e);
            });
        });
    }

    checkUpdateTransaction(transaction:Transaction, accountId:string = null) : Promise<Transaction> {
        return new Promise<Transaction> ((resolve, reject) => {
            this.transactionStorageService
                .retrieveTransaction(transaction._id)
                .then((storedTransaction:Transaction) => {

                    if ( storedTransaction.confirmations < 6 || (!!accountId && !storedTransaction.account) ) {
                        storedTransaction.confirmations = transaction.confirmations;
                        storedTransaction.account = transaction.account;
                        this.transactionStorageService.storeTransaction(storedTransaction);
                        resolve(this.transactionStorageService.storeTransaction(storedTransaction));
                    } else {
                        resolve(null);
                    }        

                }).catch(() => {
                    resolve(this.transactionStorageService.storeTransaction(transaction));
                });
        });        
    }

}