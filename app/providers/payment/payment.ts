import {Injectable, Injector} from 'angular2/core';

// Payment Services
import {BlockchainPaymentService} from './blockchain';

export const PAYMENT_STATUS_RECEIVED = 'received';
export const PAYMENT_STATUS_NOT_RECEIVED = 'not_received';
export const PAYMENT_STATUS_DOUBLE_SPENT = 'double_spent';
export const PAYMENT_STATUS_ERROR = 'error';
export const PAYMENT_STATUS_TIMEOUT = 'timeout';
export const PAYMENT_STATUS_SERVICE_ERROR = 'service_error';

export interface PaymentService {
    checkPayment(address: string, amount: number) : Promise<{status: string, tx?: string}>;
}

@Injectable()
export class Payment {
    
    private service: PaymentService;
    
    constructor(private injector: Injector) {        
        this.service = this.injector.get(BlockchainPaymentService);
    }
    
    checkPayment(address: string, amount: number) : Promise<{status: string, tx?: string}> {
        return this.service.checkPayment(address,amount);
    }
    
}
