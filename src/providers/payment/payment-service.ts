import { PaymentRequestHandler } from './../../api/payment-request-handler';
import {Injectable} from '@angular/core';
import { InsightPaymentRequestHandler } from './insight-payment-request-handler';
import { TransactionService } from './../transaction/transaction-service';
import { PaymentRequest } from './../../api/payment-request';
import * as payment from '../../api/payment-service';

@Injectable()
export class PaymentService implements payment.PaymentService {

    constructor(
        protected transactionService: TransactionService
    ) {}

    createPaymentRequestHandler(paymentRequest: PaymentRequest) : PaymentRequestHandler {
        let pr = InsightPaymentRequestHandler.createPaymentRequestHandler(paymentRequest, this.transactionService);      
        return pr;
    }

}