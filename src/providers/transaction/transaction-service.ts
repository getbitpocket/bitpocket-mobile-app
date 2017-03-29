import { ACCOUNT_TYPE_TESTNET_ADDRESS, ACCOUNT_TYPE_TESTNET_TPUB_KEY } from './../account/account-service';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Transaction } from './../../api/transaction';
import 'rxjs/add/operator/map';

@Injectable()
export class TransactionService {

    TESTNET_URL = "https://test-insight.bitpay.com/api";
    BITCOIN_URL = "https://insight.bitpay.com/api";

    constructor(protected http:Http) {}

    findTransactions(filter:any) : Promise<Array<Transaction>> {
        return new Promise((resolve, reject) => {
            this.http.get(this.buildUrl(filter))
                .map(response => response.json())
                .subscribe(response => {
                    resolve(this.parseTransactions(filter.addresses, response));
                });
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

        if (json.items && json.items.length) {
            for (let item of json.items) {              

                let tx:any = this.parseTransactionInputs(item.vin, addresses);
                if (!tx) {
                    tx = this.parseTransactionOutputs(item.vout, addresses);
                }
                
                if (tx) {
                    tx.currency = "BTC";
                    tx.txid = item.txid;
                    tx.confirmations = parseInt(item.confirmations);
                    tx.timestamp = parseInt(item.time);
                    output.push(tx);
                }
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

    buildUrl(filter:any = {}) : string {
        let url = this.BITCOIN_URL;
        if (filter.type == ACCOUNT_TYPE_TESTNET_ADDRESS || filter.type == ACCOUNT_TYPE_TESTNET_TPUB_KEY) {
            url = this.TESTNET_URL;
        }

        if (filter.addresses && filter.addresses.length > 0) {          
            url += '/addrs/' + filter.addresses.join(',') + '/txs';            
        }

        if (filter.from && filter.to) {
            url += '?from=' + filter.from + '&to=' + filter.to;
        }

        return url;
    }

}