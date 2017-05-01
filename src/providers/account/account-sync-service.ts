import { Injectable } from '@angular/core';
import { CryptocurrencyService, InsightTransactionService, TransactionStorageService, AccountService } from './../index';
import { Account } from './../../api/account';

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
            }).then(transactions => {
                let promises = [];                
                for (let i = 0; i < transactions.length; i++) {
                    // add accountId for retrieval of xpub releated transactions
                    if (accountId != null) {
                        transactions[i].account = accountId;
                    }

                    promises.push(new Promise<any>((resolve, reject) => {
                        this.transactionStorageService
                            .retrieveTransaction(transactions[i]._id)
                            .then(transaction => {
                                let store = false;

                                if (transaction.confirmations < 6) {
                                    transaction.confirmations = transactions[i].confirmations;
                                    store = true;
                                }
                                if (!!transactions[i].account &&
                                    !transaction.account) {
                                    transaction.account = transactions[i].account;
                                    store = true;
                                }

                                if (store) {                                
                                    resolve(this.transactionStorageService.storeTransaction(transaction));
                                } else {
                                    resolve();
                                }
                            }).catch(() => {
                                resolve(this.transactionStorageService.storeTransaction(transactions[i]));
                            });
                    }));                    
                }
                return Promise.all(promises);                
            }).then(promises => {
                if (!Array.isArray(promises)) {
                    promises = [];
                }

                let filtered = promises.filter((item) => {
                    return typeof item != 'undefined';
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

}