import {Injectable} from '@angular/core';
import { InsightTransactionService, InsightPaymentRequestHandler } from '../index';
import { PaymentRequest } from './../../api/payment-request';
import { PaymentRequestHandler } from './../../api/payment-request-handler';
import * as payment from '../../api/payment-service';

@Injectable()
export class PaymentService implements payment.PaymentService {

    constructor(
        protected transactionService: InsightTransactionService
    ) {}

    createPaymentRequestHandler(paymentRequest: PaymentRequest) : PaymentRequestHandler {
        let pr = InsightPaymentRequestHandler.createPaymentRequestHandler(paymentRequest, this.transactionService);      
        return pr;
    }

}