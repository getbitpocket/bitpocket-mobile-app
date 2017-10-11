import { TransactionService } from './../../../api/transaction-service';
import { TransactionFilter } from './../../../api/transaction-filter';
import { BITCOIN, TESTNET } from './../../index';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './../../../api/transaction';

// NOT YET IMPLEMENTED

@Injectable()
export class BlockcypherService implements TransactionService {

    constructor(protected http:HttpClient, protected cryptocurrency:string) {}

    findTransactions(filter: TransactionFilter) : Promise<Transaction[]> {
        return new Promise<Transaction[]>((resolve, reject) => {
            
        });       
    }

    parseTransactions(addresses:string[], json:any) {
        
    }

    buildUrl(filter:TransactionFilter = {}) : string {
        let url = "";

        if (this.cryptocurrency == TESTNET) {
            url += "https://api.blockcypher.com/v1/btc/test3/";
        } else {
            url += "https://api.blockcypher.com/v1/btc/main/";
        }

        if (filter.txid) {
        } else if (filter.addresses && filter.addresses.length > 0) {          
        }

        if (filter.from >= 0 && filter.to > 0) {
            let limit = filter.to - filter.from;
            url += 'limit=' + limit + '&offset=' + filter.from;
        } else {
            url += 'limit=50&offset=0';
        }

        return url;
    }

}