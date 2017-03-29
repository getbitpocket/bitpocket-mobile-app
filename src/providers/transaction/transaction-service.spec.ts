import { TransactionService } from './transaction-service';
import {data} from './insight-transaction-data';

describe('Transaction Service', () => {

    let transactionService = new TransactionService(null);

    it('should build correct urls', () => {
        expect(transactionService.buildUrl({
            addresses : ['ad1','ad2','ad3'] ,
            to : 15 ,
            from : 5
        })).toEqual('https://insight.bitpay.com/api/addrs/ad1,ad2,ad3/txs?from=5&to=15');
    });

    it('should find address input', () => {
        let index = transactionService.addressIndex(
            ['ad1','ad2','ad3','ad4'] ,
            ['ad0','ad3']
        );
        expect(index).toEqual(1);
    });

    it('should parse transactions correctly', () => {
        let txs = transactionService.parseTransactions(['19L9LhCArs9SUNu3ZzaqJ1ys3dGgvJmi5T'], data);        
        let incomming = [false, true, false, true, false, false, true, true, false, true];
        for (let i = 0; i < incomming.length; i++) {
            expect(txs[i].incomming).toBe(incomming[i]);
        }       
    });

});