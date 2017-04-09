import { TransactionFilter } from './../../api/transaction-filter';
import { Repository } from './../repository';
import { Transaction } from './../../api/transaction';
import { Injectable } from '@angular/core';

@Injectable()
export class TransactionStorageService {

    constructor(
        protected repository: Repository
    ) {}

    storeTransaction(transaction:Transaction) : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.repository.addOrEditDocument(transaction)
                .then(() => { resolve(transaction); })
                .catch(() => { reject(); });
        });
    }

    retrieveTransaction(txid: string) {
        return this.repository.findById(txid);
    }

    retrieveTransactions(transactionFilter: TransactionFilter) : Promise<Transaction[]> {
        return new Promise((resolve, reject) => {
            let query = {
                selector : {
                    address : {
                        '$in' : transactionFilter.addresses
                    } ,
                    timestamp : { '$gt':null }
                },
                sort : [{ timestamp : 'desc' }] ,
                limit : transactionFilter.to - transactionFilter.from ,
                skip : transactionFilter.from > 0 ? transactionFilter.from : undefined
            };

            resolve(this.repository.findDocuments(query));
        });
    }

}