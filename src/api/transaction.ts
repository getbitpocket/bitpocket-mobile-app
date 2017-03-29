export interface Transaction {        
    txid: string;    
    currency: string;
    address: string;        
    amount: number;
    incomming: boolean;

    timestamp?: number;        
    confirmations?: number;

    referenceCurrency?: string;
    referenceAmount?: number;

    // TODO: remove/deprecated
    fiatAmount?:number;
    
}
