import {Injectable} from '@angular/core';
import { TransactionServiceWrapper, InsightPaymentRequestHandler, CryptocurrencyService, BITCOIN, TESTNET } from '../index';
import { PaymentRequest } from './../../api/payment-request';
import { PaymentRequestHandler } from './../../api/payment-request-handler';
import * as payment from '../../api/payment-service';

@Injectable()
export class PaymentService implements payment.PaymentService {

    constructor(
        protected transactionService: TransactionServiceWrapper ,
        protected cryptocurrencyService: CryptocurrencyService
    ) {}

    createPaymentRequestHandler(paymentRequest: PaymentRequest) : PaymentRequestHandler {
        let currency = this.cryptocurrencyService.parseInput(paymentRequest.address).currency;

        if (currency == BITCOIN) {
            return InsightPaymentRequestHandler.createPaymentRequestHandler(paymentRequest, this.transactionService, 'https://insight.bitpay.com');
        } else if (currency == TESTNET) {
            return InsightPaymentRequestHandler.createPaymentRequestHandler(paymentRequest, this.transactionService, 'https://test-insight.bitpay.com');
        }
    }

}