import { Account } from './account';

export interface TransactionFilter {
    txid?: string ,
    addresses?: string[] ,
    account?:Account ,
    from? : number ,
    to? : number ,
    startTime? : number ,
    endTime? : number
}