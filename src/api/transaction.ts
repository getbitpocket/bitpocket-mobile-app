export interface Transaction {        
    txid: string;    
    currency: string;
    address: string;        
    bitcoinAmount: number;
    fiatAmount: number;
    timestamp?: number;        
    confirmations?: number;
}
