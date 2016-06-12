import {describe, it, expect} from '@angular/core/testing';
import {ElectrumPaymentService} from './electrum';
import {BitcoinUnit} from './../currency/bitcoin-unit';
import {Transaction} from '../../api/transaction';

function createDummy(txid: string) : Transaction {
    return {
        txid : txid ,
        address : 'blabla' ,
        currency : 'EUR' ,
        fiatAmount : 10 ,
        bitcoinAmount : 11 ,
        confirmations : 100
    };
};

describe('Electrum Payment Service', () => {
    
    let paymentService = new ElectrumPaymentService();
    let txHex1 = "01000000016271e1bef4bdb755a2c0e4e982d088f4d8f4c6b135048ce38f2af2e6a5379376010000006a47304402201ca8e2a22e1c87c71b1df19f8daa457eb9da69b7a69bc197ab79fb073b66b8c10220299a4b61eac3ab76bc4b7e4edaf0b0b2ef70547502c68a03adca127f967ead5b01210342f8281f55eb527d04e8208512756e4459ad542e94f40eb51402e6093451de0ffeffffff02711b7c08000000001976a914b4580ac8475106655c5f0add1e8526a19e6a028a88ac7f661d000000000017a914ec0e110b6ceaa0d0afc4141ccd807b9492ce734787fa500600";
    let address1 = '1HSa6oaftf6vVFdYWLfq53DZdc4SZ1cH5k';
    let address2 = '1FZyezmV9LrT4nNY4CWL64Lhc5vfYqhauk';
    
    it('check that an output is matching the given address and amount', () => {        
        let btcAmount = BitcoinUnit.from(1.42351217, 'BTC');        
        expect(paymentService.checkTransaction(txHex1, address1, btcAmount)).toEqual('061398577d64dfd6bb586bc9e400d833a7ff52e7702c8c3409b07a8a2f6425cd');
    });
    
    it('check that an almost correct amount is not ok', () => {                
        let btcAmount = BitcoinUnit.from(1.42351218, 'BTC');        
        expect(paymentService.checkTransaction(txHex1, address1, btcAmount)).toBe(false);
    });
    
    it('check that receiving a higher amount is ok', () => {                
        let btcAmount = BitcoinUnit.from(1.3, 'BTC');        
        expect(paymentService.checkTransaction(txHex1, address1, btcAmount)).toEqual('061398577d64dfd6bb586bc9e400d833a7ff52e7702c8c3409b07a8a2f6425cd');
    });
    
    it('check non existing address', () => {
        let btcAmount = BitcoinUnit.from(1.3, 'BTC');        
        expect(paymentService.checkTransaction(txHex1, address2, btcAmount)).toBe(false);
    });

    it('find transaction index', () => {
        let dummyTransactions = [
            createDummy('1230') ,
            createDummy('1231') ,
            createDummy('1232') ,
            createDummy('1233') ,
            createDummy('1234')
        ];

        expect(paymentService.findTransactionIndex('1233',dummyTransactions)).toEqual(3);
        expect(paymentService.findTransactionIndex('1333',dummyTransactions)).toEqual(-1);
    });

    it('update transaction data', () => {
        let dummyTransactions = [
            createDummy('1230') ,
            createDummy('1231') ,
            createDummy('1232') ,
            createDummy('1233') ,
            createDummy('1234')
        ];

        let transactions = paymentService.updateTransactionData([
            { tx_hash : '1132', height : 400 } ,
            { tx_hash : '1232', height : 600 } ,
            { tx_hash : '1333', height : 1000 }
        ],dummyTransactions,1100);

        expect(transactions[0].confirmations).toEqual(100);
        expect(transactions[1].confirmations).toEqual(100);
        expect(transactions[2].confirmations).toEqual(500);        
        expect(transactions[3].confirmations).toEqual(100);
        expect(transactions[4].confirmations).toEqual(100);       

    });
    
});