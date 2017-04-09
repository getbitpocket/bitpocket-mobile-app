import { PaymentRequestHandler } from './../../api/payment-request-handler';
import { TransactionService } from './../transaction/transaction-service';
import { PaymentRequest, PAYMENT_STATUS_SERVICE_ERROR, PAYMENT_STATUS_RECEIVED } from './../../api/payment-request';
import { EventEmitter } from 'events';
import * as io from 'socket.io-client';

export class InsightPaymentRequestHandler extends EventEmitter implements PaymentRequestHandler {

    protected _paymentRequest: PaymentRequest;
    protected transactionService: TransactionService;
    protected socket: SocketIO.Socket;

    get paymentRequest() : PaymentRequest {
        return this._paymentRequest;
    }

    constructor() {
        super();
    }

    static createPaymentRequestHandler(paymentRequest: PaymentRequest, transactionService: TransactionService) {
        let handler = new InsightPaymentRequestHandler();
        handler._paymentRequest = paymentRequest;
        handler.transactionService = transactionService;
        handler.init();
        return handler;
    }

    init() {
        try {
            this.socket = io(this.transactionService.baseUrl(this.paymentRequest.address));
            this.socket.on('error', () => {
                this.emit("payment-status:" + PAYMENT_STATUS_SERVICE_ERROR);
            }).on('bitcoind/addresstxid', data => {                
                this.triggerStatusUpdate(data.txid)
                    .then((close:boolean) => {
                        if (close) {
                            this.cancel();
                        }
                    });
            }).on('connect', () => { 
                this.socket.emit('subscribe', 'bitcoind/addresstxid', [ this.paymentRequest.address ]);
            });
        } catch (e) {
            this.emit("payment-status:" + PAYMENT_STATUS_SERVICE_ERROR);
        }
    }

    triggerStatusUpdate(txid:string) : Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            this.transactionService.findTransactions({
                addresses : [this.paymentRequest.address] ,
                txid : txid
            }).then(transactions => {
                if (transactions.length > 0) {
                    if (transactions[0].amount >= this.paymentRequest.amount) {
                        this.emit("payment-status:" + PAYMENT_STATUS_RECEIVED);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }

    cancel() {
        this.socket.disconnect();
    }

}