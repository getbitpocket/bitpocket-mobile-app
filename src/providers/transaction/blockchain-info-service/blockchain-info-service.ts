import { TransactionService } from './../../../api/transaction-service';
import { TransactionFilter } from './../../../api/transaction-filter';
import { BITCOIN } from './../../index';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from './../../../api/transaction';

const BLOCKCHAIN_INFO_BASE_URL = "https://blockchain.info/";

@Injectable()
export class BlockchainInfoService implements TransactionService {

    protected lastKnownBlockchainHeight = 0;

    set blockchainHeight(height:number) {
        this.lastKnownBlockchainHeight = height;
    }

    constructor(protected http:HttpClient) {}

    findTransactions(filter: TransactionFilter) : Promise<Transaction[]> {
        return new Promise<Transaction[]>((resolve, reject) => {
            this.getBlockHeight()
                .then(() => {
                    this.http.get(this.buildUrl(filter))
                        .subscribe(response => {
                            resolve(this.parseTransactions(filter.addresses, response));
                        }, () => { reject(); })
                })
        });       
    }

    getBlockHeight() : Promise<number> {
        return new Promise<number> ((resolve, reject) => {
            this.http.get(BLOCKCHAIN_INFO_BASE_URL + 'latestblock')
                .subscribe((response:any) => {
                    if (response && response.height) {
                        this.lastKnownBlockchainHeight = response.height;
                    }     
                    resolve(this.lastKnownBlockchainHeight);              
                }, () => { resolve(this.lastKnownBlockchainHeight); });
        });
    }

    parseTransactions(addresses:string[], json:any) {
        let txs:Transaction[] = [];
        let items = [];
        
        if (json && json.txs && Array.isArray(json.txs)) {
            items = json.txs;
        } else if (json && json.inputs && json.out) {
            items = [json];
        }       

        for (let item of items) {
            let tx:any = this.parseTransactionInputs(addresses, item.inputs);
            if (!tx) {
                tx = this.parseTransactionOutputs(addresses, item.out);
            }

            if (tx) {
                tx.currency = "BTC";
                tx.confirmations = this.lastKnownBlockchainHeight - item['block_height'];
                tx._id = item.hash;
                tx.timestamp = parseInt(item.time);
                txs.push(tx);
            }
        }

        return txs;
    }

    parseTransactionOutputs(addresses:string[], outputs:any[]) {
        if (outputs && Array.isArray(outputs)) {
            for (let output of outputs) {
                if (output.addr) {
                    let index = addresses.indexOf(output.addr);
                    if (index >= 0) {
                        return {
                            address : addresses[index] ,
                            incomming : true ,
                            amount  : output.value
                        };
                    }
                }
            }
        }
        return null;
    }

    parseTransactionInputs(addresses:string[], inputs:any[]) {
        if (inputs && Array.isArray(inputs)) {
            for (let input of inputs) {
                if (input.prev_out && input.prev_out.addr && input.prev_out.addr) {
                    let index = addresses.indexOf(input.prev_out.addr);
                    if (index >= 0) {
                        return {
                            address : addresses[index] ,
                            incomming : false ,
                            amount  : input.prev_out.value
                        };
                    }
                }
            }
        }
        return null;
    }

    buildUrl(filter:TransactionFilter = {}) : string {
        let url = "";

        if (filter.txid) {
            url = BLOCKCHAIN_INFO_BASE_URL + "rawtx/" + filter.txid + "?";
        } else if (filter.addresses && filter.addresses.length > 0) {          
            url = BLOCKCHAIN_INFO_BASE_URL + "multiaddr?active=" + filter.addresses.join('|') + "&";
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