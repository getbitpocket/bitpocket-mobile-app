export const PAYMENT_STATUS_RECEIVED      = 'received';
export const PAYMENT_STATUS_OVERPAID      = 'overpaid';
export const PAYMENT_STATUS_PARTIAL_PAID  = 'partial';
export const PAYMENT_STATUS_SERVICE_ERROR = 'service_error';

export interface PaymentRequest {

    currency: string;
    address: string;        
    amount: number;

    txAmount?: number; // partial / over payment
    txid?:string;
    status?: string;
    startTime?: number;

    referenceAmount?: number;
    referenceCurrency?: string;
}