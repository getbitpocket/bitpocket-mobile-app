import {Injectable} from '@angular/core';
import {BitcoinUnit} from '../currency/bitcoin-unit';
import * as payment from '../../api/payment-service';
import {PaymentRequest} from '../../api/payment-request';
import {Transaction} from '../../api/transaction';
import {History} from '../history/history';
import {Address} from '../address';
import {EventEmitter} from 'events';

// Payment Services
import {ElectrumPaymentService} from './electrum';

@Injectable()
export class Payment extends EventEmitter {
    
    private active: boolean = false;    
    private waitingTimeCount: number = 0;

    // TODO: check if this should be configurable
    private checkInterval: number  = 5500;
    private maxWaitingTime: number = 1000 * 60;

    private service: payment.PaymentService;

    setCheckInterval(checkInterval: number) {
        this.checkInterval = checkInterval;
    }

    setMaxWaitingTime(maxWaitingTime: number) {
        this.maxWaitingTime = maxWaitingTime;
    }

    setPaymentService(paymentService: payment.PaymentService) {
        this.service = paymentService;
    }
    
    constructor(private history: History, private address: Address) {        
        super();
        
        // TODO: make this configurable, currently only one provider available
        this.service = new ElectrumPaymentService();
    }
    
    checkPayment(paymentRequest: PaymentRequest) {
        if (this.waitingTimeCount >= this.maxWaitingTime) {
            this.emit('payment-status:' + payment.PAYMENT_STATUS_TIMEOUT, paymentRequest);
            return;
        } else if (this.active) {
            this.waitingTimeCount += this.checkInterval;
        } else {
            // this.active == false , or any other reason abort
            // TODO: can this happen?
            this.emit('payment-status:' + payment.PAYMENT_STATUS_NOT_RECEIVED, paymentRequest);
            return;
        }

        console.debug('find transactions to address: ' + paymentRequest.address);
        this.service.findTransactions(
            paymentRequest.address,
            BitcoinUnit.from(paymentRequest.bitcoinAmount, 'BTC'))
            .then((txids) => {
                console.debug('Transactions found to address:' + paymentRequest.address, txids);
                this.history.findNewTransaction(txids, paymentRequest.address)
                    .then(index => {
                        if (index >= 0) {
                            let transaction: Transaction = {
                                txid : txids[index] ,
                                address : paymentRequest.address ,
                                currency : paymentRequest.currency ,
                                bitcoinAmount : paymentRequest.bitcoinAmount ,
                                fiatAmount : paymentRequest.fiatAmount
                            };
                            
                            // TODO: this could be processed by event handlers
                            this.history.addTransaction(transaction);
                            this.address.addressPostProcess();
                            
                            console.debug('Emit payment status: ' + payment.PAYMENT_STATUS_RECEIVED);
                            this.emit('payment-status:' + payment.PAYMENT_STATUS_RECEIVED, transaction);
                        } else {
                            console.debug('No new txs found, emit payment status: ' + payment.PAYMENT_STATUS_NOT_RECEIVED);
                            this.emit('payment-status:' + payment.PAYMENT_STATUS_NOT_RECEIVED, paymentRequest);
                            setTimeout(() => { this.checkPayment(paymentRequest) }, this.checkInterval);
                        }
                    });                    
            })            
            .catch(() => {
                console.debug('No txs found, emit payment status: ' + payment.PAYMENT_STATUS_NOT_RECEIVED);
                this.emit('payment-status:' + payment.PAYMENT_STATUS_NOT_RECEIVED, paymentRequest);
                setTimeout(() => { this.checkPayment(paymentRequest) }, this.checkInterval);
            });

        return this;
    }

    startPaymentStatusCheck(paymentRequest: PaymentRequest) {
        this.removeAllListeners(); console.debug('Start Payment Status Check');
        this.active = true;
        this.waitingTimeCount = 0;
        this.checkPayment(paymentRequest);
        return this;
    }

    stopPaymentStatusCheck() {
        this.removeAllListeners(); console.debug('Stop Payment Status Check');
        this.active = false;
        return this;
    }

    updateConfirmations() : Promise<any> {
      return new Promise<Array<Transaction>>((resolve,reject) => {
            this.history.findUnconfirmedTransactions().then(transactions => {
                if (transactions.length <= 0) {
                    resolve();
                } else {
                    this.service.updateConfirmations(transactions).then((transactions) => {
                        console.debug("confirmation update from payment service");
                        for (let i = 0; i < transactions.length; i++) {
                            if (transactions[i].confirmations >= 1) {
                                this.history.updateConfirmations(transactions[i].txid, transactions[i].confirmations);
                            }
                        }
                        setTimeout(resolve,1000);
                    }).catch(() => {
                        console.debug("confirmation update from payment service rejected");
                        resolve();
                    });
                }
            });
        });        
    }
    
}
