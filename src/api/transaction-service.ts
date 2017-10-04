import { TransactionFilter } from './transaction-filter';
import { Transaction } from './transaction';

export interface TransactionService {

    supports(cryptocurrency:string) : boolean;

    findTransactions(filter:TransactionFilter) : Promise<Transaction[]>;

}