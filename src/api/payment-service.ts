import { PaymentRequestHandler } from './payment-request-handler';
import { PaymentRequest } from './payment-request';

export interface PaymentService {

    createPaymentRequestHandler(paymentRequest: PaymentRequest) : PaymentRequestHandler;
    
}