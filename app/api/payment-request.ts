export interface PaymentRequest {
    currency: string;
    address: string;        
    bitcoinAmount: number;
    fiatAmount: number;
}