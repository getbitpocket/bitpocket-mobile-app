/// <reference path="../../bitcoinjs-lib.d.ts" />

import {Injectable} from '@angular/core';
import {BitcoinUnit} from '../currency/bitcoin-unit';
import * as payment from './payment';
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

    checkPayment(address: string, amount: BitcoinUnit) : Promise<{status: string, tx?: string}> {

        return new Promise((resolve, reject) => {

            let nD = new electrum.NetworkDiscovery();
            let requestId = Math.round(Math.random() * 10000000);
            let txRequestId = Math.round(Math.random() * 10000000);
            let txCount = 0, txResultCount = 0;

            nD.init();
            nD.on('peers:discovered', () => {
                nD.sendRandomRequest({
                    id: requestId,
                    method: 'blockchain.address.get_mempool',
                    params: [address]});
            });

            nD.on('peers:response', response => {
                console.log(response);

                if (response.id == requestId && Array.isArray(response.result) && response.result.length > 0) {
                    txCount = response.result.length;

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
                        resolve({status: payment.PAYMENT_STATUS_RECEIVED, tx: txid});
                    } else if (txCount <= txResultCount) {
                        reject({status: payment.PAYMENT_STATUS_NOT_RECEIVED});
                    }
                } else {
                    reject({status: payment.PAYMENT_STATUS_NOT_RECEIVED});
                }

            });

        });

    }

}