export const PAYMENT_STATUS_RECEIVED = 'received';
export const PAYMENT_STATUS_NOT_RECEIVED = 'not_received';
export const PAYMENT_STATUS_DOUBLE_SPENT = 'double_spent';
export const PAYMENT_STATUS_ERROR = 'error';
export const PAYMENT_STATUS_TIMEOUT = 'timeout';
export const PAYMENT_STATUS_SERVICE_ERROR = 'service_error';

export interface PaymentRequest {

    currency: string;
    address: string;        
    amount: number;

    status?: string;
    startTime?: number;

    referenceAmount?: number;
    referenceCurrency?: string;
}