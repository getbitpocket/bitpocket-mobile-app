export interface Transaction {        
    _id: string; // txid    
    currency: string;
    address: string;        
    amount: number;
    incomming: boolean;
    timestamp?: number;        
    confirmations?: number;    
    account?: string;

    paymentReferenceAmount?: number;
    paymentReferenceCurrency?: string;
    paymentStatus?: string;
}
