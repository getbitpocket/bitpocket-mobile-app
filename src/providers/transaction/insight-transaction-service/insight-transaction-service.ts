import { TransactionService } from './../../../api/transaction-service';
import { TransactionFilter } from './../../../api/transaction-filter';
import { CryptocurrencyService, TESTNET } from './../../index';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Transaction } from './../../../api/transaction';
import 'rxjs/add/operator/map';

@Injectable()
export class InsightTransactionService implements TransactionService {

    TESTNET_URL = "https://test-insight.bitpay.com";
    BITCOIN_URL = "https://insight.bitpay.com";

    constructor(
        protected http:Http,
        protected cryptocurrencyService: CryptocurrencyService) {}

    findTransactions(filter:TransactionFilter) : Promise<Array<Transaction>> {
        return new Promise((resolve, reject) => {
            this.http.get(this.buildUrl(filter))
                .map(response => response.json())
                .subscribe(response => {
                    resolve(this.parseTransactions(filter.addresses, response));
                },() => { reject(); });
        });
    }

    parseTransactionInputs(vins:any[], addresses:string[]) {
        if (vins && vins.length > 0) {
            for (let vin of vins) {
                let addressIndex = addresses.indexOf(vin.addr);
                if (addressIndex >= 0) {
                    // TODO: same address in vin multiple times?
                    return {
                        amount : parseFloat(vin.value) ,
                        incomming : false ,
                        address : addresses[addressIndex]
                    };                
                }
            }
        }
        return null;
    }

    parseTransactionOutputs(vouts:any[], addresses:string[]) {
        if (vouts && vouts.length > 0) {
            for (let vout of vouts) {
                if (vout.scriptPubKey && (vout.scriptPubKey.type == 'pubkeyhash' || vout.scriptPubKey.type == 'scripthash')) {
                    let index = this.addressIndex(vout.scriptPubKey.addresses, addresses);

                    if (index >= 0) {
                        // TODO: same address in vout multiple times?
                        // http://bitcoin.stackexchange.com/questions/4475/can-the-same-target-address-appear-more-than-once-on-transaction-output
             
                        return {
                            amount : parseFloat(vout.value) ,
                            incomming : true ,
                            address : addresses[index]
                        };
                    }
                }            
            }
        }

        return null;
    }

    parseTransactions(addresses:string[], json:any) : Transaction[] {
        let output = [];
        let items = [];

        if (json.items && json.items.length) {
            items = json.items;
        } else {
            items.push(json);
        }

        for (let item of items) {              

            let tx:any = this.parseTransactionInputs(item.vin, addresses);
            if (!tx) {
                tx = this.parseTransactionOutputs(item.vout, addresses);
            }
            
            if (tx) {
                tx.currency = "BTC";
                tx._id = item.txid;
                tx.confirmations = parseInt(item.confirmations);
                tx.timestamp = parseInt(item.time);
                output.push(tx);
            }
        }
        
        return output;
    } 

    /**
     * returns index of addressesAsSearchInput array, which is found inside
     * addressesToSearchFor array
     */
    addressIndex(addressesToSearchFor:string[], addressesAsSearchInput:string[]) : number {
        for (let i = 0; i < addressesAsSearchInput.length; i++) {
            if (addressesToSearchFor.indexOf(addressesAsSearchInput[i]) >= 0) {
                return i;
            }
        }
        return -1;
    }

    baseUrl(input:string) {
        let output = this.cryptocurrencyService.parseInput(input);        

        if (output.currency == TESTNET) {
            return this.TESTNET_URL;
        } else {
            return this.BITCOIN_URL;
        }
    }

    buildUrl(filter:any = {}) : string {
        let url = "";
        
        if (filter.addresses && filter.addresses.length > 0) {          
            url = this.baseUrl(filter.addresses[0]) + "/api";

            if (filter.txid) {
                url += '/tx/' + filter.txid;
            } else {
                url += '/addrs/' + filter.addresses.join(',') + '/txs';
            }                        
        }

        if (filter.from >= 0 && filter.to > 0) {
            url += '?from=' + filter.from + '&to=' + filter.to;
        }

        return url;
    }

}