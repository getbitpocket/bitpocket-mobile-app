import {describe, it, expect} from '@angular/core/testing';
import {ElectrumPaymentService} from './electrum';
import {BitcoinUnit} from './../currency/bitcoin-unit';
import {Transaction} from '../../api/transaction';

function createDummy(txid: string, address = 'blablabla') : Transaction {
    return {
        txid : txid ,
        address : address ,
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

    it('double check with real transaction', () => {
        // https://blockchain.info/tx/c9840c37bc8a8e1888eb7fd98335fc76e195d40ede173f1e61898cdc79acae25
        let tx = "01000000011201da05171fb48168ded92318d7f5fd194ff47298b17dc99198a9ffc206787e010000008b4830450221008fd688a93eb7d58c0930759114c94eab5f7f76d1109450526a7f032e570f4c2602200af2280ea3d2f5f80c6abd29174087412139280272a7a0a1e3db18544fc51c55014104accbdf3380492ee779ce835899cf90f0ba4711ef94932ace7ff24ff0089f1eb6d826ec8208ace4df32a6207c64da0fc798da9e8f6c9a739a7122736f5599fe2fffffffff02f3618c00000000001976a914d025c31e58cea03a094d6033a2adbd91f1d0ef0888aca96e0f00000000001976a9140cc47c8867d8ad27f716977b33b0c946e472b11088ac00000000";   
        let address = "1KyanfTj4W6zCScrJFcd1QA8ZBxYyFVgFb";
        let btcAmount = BitcoinUnit.from(0.09200115, 'BTC');

        expect(paymentService.checkTransaction(tx, address, btcAmount)).toEqual("c9840c37bc8a8e1888eb7fd98335fc76e195d40ede173f1e61898cdc79acae25");
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

    it('unique address list', () => {
        let addresses = paymentService.createUniqueAddressList([
            createDummy('id1','address1') ,
            createDummy('id2','address1') ,
            createDummy('id3','address2') ,
            createDummy('id4','address2') ,
            createDummy('id5','address3')
        ]);

        expect(addresses.length).toEqual(3);
        expect(addresses[0]).toEqual('address1');
        expect(addresses[1]).toEqual('address2');
        expect(addresses[2]).toEqual('address3');
    });
    
});