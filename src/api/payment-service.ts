import { PaymentRequestHandler } from './payment-request-handler';
import { BitcoinUnit } from './../providers/currency/bitcoin-unit';
import { PaymentRequest } from './payment-request';

export interface PaymentService {

    createPaymentRequestHandler(paymentRequest: PaymentRequest) : PaymentRequestHandler;
    
}