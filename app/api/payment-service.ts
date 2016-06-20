import {BitcoinUnit} from '../providers/currency/bitcoin-unit';
import {Transaction} from './transaction';

export const PAYMENT_STATUS_RECEIVED = 'received';
export const PAYMENT_STATUS_NOT_RECEIVED = 'not_received';
export const PAYMENT_STATUS_DOUBLE_SPENT = 'double_spent';
export const PAYMENT_STATUS_ERROR = 'error';
export const PAYMENT_STATUS_TIMEOUT = 'timeout';
export const PAYMENT_STATUS_SERVICE_ERROR = 'service_error';

export interface PaymentService {

    /**
     * Find transactions which were made to the given address and
     * are at least as big as the given amount
     */
    findTransactions(address: string, amount: BitcoinUnit) : Promise<Array<string>>;

    updateConfirmations(transactions: Array<Transaction>) : Promise<Array<Transaction>>;
}