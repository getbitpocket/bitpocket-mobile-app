import { BlockchainInfoService } from './../../index';
import {data} from './blockchain-info-data';

describe('Transaction Service', () => {

    let transactionService = new BlockchainInfoService(null);

    it('should build correct urls', () => {
        expect(transactionService.buildUrl({
            addresses : ['152f1muMCNa7goXYhYAQC61hxEgGacmncB','12ni9ddt4WHfEQriVN7DajDBd1JbKL9yUZ','1FS4FF2SYdHf3PGfSbjpdYcUiUYxiVLy73'] ,
            to : 15 ,
            from : 5
        })).toEqual('https://blockchain.info/multiaddr?active=152f1muMCNa7goXYhYAQC61hxEgGacmncB|12ni9ddt4WHfEQriVN7DajDBd1JbKL9yUZ|1FS4FF2SYdHf3PGfSbjpdYcUiUYxiVLy73&limit=10&offset=5');
    });
    
    it('should parse transactions correctly', () => {
        let txs = transactionService.parseTransactions(['19L9LhCArs9SUNu3ZzaqJ1ys3dGgvJmi5T'], data);        
        let incomming = [true,false,true,false,true,false,true,false,true,false,false,true,true];
        
        for (let i = 0; i < incomming.length; i++) {
            expect(txs[i].incomming).toBe(incomming[i]);
        }       
    });

});