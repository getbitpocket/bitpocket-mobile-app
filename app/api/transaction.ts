export interface Transaction {    
    txid: string;    
    timestamp?: number;
    currency: string;
    address: string;        
    bitcoinAmount: number;
    fiatAmount: number;    
    confirmations?: number;
}