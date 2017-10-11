import { TransactionFilter } from './transaction-filter';
import { Transaction } from './transaction';

export interface TransactionService {
    findTransactions(filter:TransactionFilter) : Promise<Transaction[]>;
}