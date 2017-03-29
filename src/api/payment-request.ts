export interface PaymentRequest {
    currency: string;
    address: string;        
    amount: number;
    referenceAmount?: number;
    referenceCurrency?: number;

    // TODO: remove/deprecated
    bitcoinAmount: number;
    fiatAmount: number;
}