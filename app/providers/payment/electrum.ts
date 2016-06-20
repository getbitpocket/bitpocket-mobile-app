/// <reference path="../../bitcoinjs-lib.d.ts" />

import {BitcoinUnit} from '../currency/bitcoin-unit';
import {Transaction} from '../../api/transaction';
import * as payment from '../../api/payment-service';
import * as bitcoin from 'bitcoinjs-lib';
import {Buffer} from 'buffer';

export class ElectrumPaymentService implements payment.PaymentService {

    checkTransaction(transaction: string, address: string, amount: BitcoinUnit) : any {
        let buffer = new Buffer(transaction, 'hex');
        let t = bitcoin.Transaction.fromBuffer(buffer);
  
        for (let out of t.outs) {            
            if (address === bitcoin.address.fromOutputScript(out.script) && amount.to('satoshis') <= out.value) {
                return t.getId();
            }
        }

        return false;
    }

    generateRandomId() : number {
        return Math.round(Math.random() * 10000000);
    }

    findTransactionIndex(txid: string, transactions: Array<Transaction>) : number{
        let index = -1;

        for (let i = 0; i < transactions.length; i++) {
            if (transactions[i].txid === txid) {
                return i;
            }
        }

        return index;
    }

    updateTransactionData(response:Array<{tx_hash:string, height:number}>, transactions:Array<Transaction>, blockHeight: number) : Array<Transaction> {
        for (let tx of response) {
            let index = this.findTransactionIndex(tx.tx_hash, transactions);
            if (index >= 0) {
                transactions[index].confirmations = blockHeight - tx.height;
            }
        }

        return transactions;
    }

    findTransactions(address: string, amount: BitcoinUnit) : Promise<Array<string>> {
        return new Promise((resolve, reject) => {
            let nD            = new electrum.NetworkDiscovery(),
            	requestId     = this.generateRandomId(),
            	txRequestId   = this.generateRandomId(),
            	txCount       = 0,
                txResultCount = 0,
                txids         = [];

            nD.init();
            nD.on('peers:discovered', () => {
                let request = {
                    id: requestId,
                    method: 'blockchain.address.get_mempool',
                    params: [address]
                };
                nD.sendRandomRequest(request);
            });
                
            nD.on('peers:response', response => {
                if (response.id == requestId && Array.isArray(response.result) && response.result.length > 0) {
                    txCount = response.result.length;

                    // send a request for each found transaction
                    // in mempool, to the given address                    
                    for (let tx of response.result) {
                        if (typeof tx.tx_hash === 'string') {                                                        
                            nD.sendRandomRequest({
                                id : 'tid-' + txRequestId++ ,
                                method: 'blockchain.transaction.get' ,
                                params: [tx.tx_hash]
                            });
                        }
                    }
                } else if (typeof response.id === 'string' && response.id.indexOf('tid-') === 0) {
                    txResultCount++;
                    let txid = this.checkTransaction(response.result, address, amount);

                    if (txid !== false) {
                        txids.push(txid);
                    }
                }

                if (txResultCount >= txCount && txids.length > 0) {
                    resolve(txids);
                } else if (txResultCount >= txCount) {
                    reject(txids);
                }
            });
        });
    }

    updateConfirmations(transactions: Array<Transaction>) : Promise<Array<Transaction>> {
        return new Promise<Array<Transaction>>((resolve, reject) => {
            let nD = new electrum.NetworkDiscovery(),
                blockRequestId = this.generateRandomId(),
                historyRequestId = this.generateRandomId(),
                retrievedBlockHeight = 0,
                addresses = [];

            for(let i = 0; i < transactions.length; i++) {
                addresses.push(transactions[i].address);
            }

            nD.init();
            
            nD.on('peers:discovered', () => {                
                nD.sendRandomRequest({
                    id: blockRequestId,
                    method: 'blockchain.numblocks.subscribe',
                    params: []
                });
            });

            nD.on('peers:response', response => {
                if (response.id == blockRequestId) {
                    retrievedBlockHeight = response.result;

                    nD.sendRandomRequest({
                        id: historyRequestId ,
                        method : 'blockchain.address.get_history' ,
                        params : addresses
                    });
                } else if (response.id == historyRequestId) {

                    resolve(transactions);
                }
            });

        });
    }
}
