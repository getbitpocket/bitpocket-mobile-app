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
        let selector:any = {
            timestamp : { '$gt':null }
        };

        if (transactionFilter.account && /static-address/.test(transactionFilter.account.type)) {
            selector.address = { '$eq':transactionFilter.account.data };
        } else if (transactionFilter.account && /pub-key/.test(transactionFilter.account.type)) {
            selector.account = { '$eq': transactionFilter.account._id };
        } else if (transactionFilter.addresses) {
            selector.address = { '$in':transactionFilter.addresses };
        }

        return new Promise((resolve, reject) => {
            let query = {
                selector : selector,
                // sort : [{ timestamp : 'desc' }] ,
                limit : transactionFilter.to - transactionFilter.from ,
                skip : transactionFilter.from > 0 ? transactionFilter.from : 0
            };

            resolve(this.repository.findDocuments(query));
        });
    }

}