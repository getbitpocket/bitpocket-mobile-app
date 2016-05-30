import {describe,it,inject,expect} from '@angular/core/testing';
import {BitcoinUnit} from './bitcoin-unit'

describe('Bitcoin Unit', () => {
    
    it('from btc input with many decimals', () => {
        let bU = BitcoinUnit.from(12.12345678, 'BTC');        
        expect(bU.to('satoshis')).toEqual(1212345678);
    });
    
    it('from satoshi input to different units', () => {
        // 100.000.000 satoshi is 1 BTC        
        let bU = BitcoinUnit.from(100000000);
        
        expect(bU.to('BTC')).toEqual(1);
        expect(bU.to('mBTC')).toEqual(1000);
        expect(bU.to('bits')).toEqual(1000000);
        expect(bU.to('satoshis')).toEqual(100000000);         
    });
    
    it('from fiat to mBTC', () => {
        // 400 Fiat is 1 BTC        
        let bU = BitcoinUnit.fromFiat(100,400);        
        expect(bU.to('mBTC')).toEqual(250);         
    });
    
    it('from mBTC to Fiat', () => {
        // 420.50 Fiat is 1 BTC   
        let bU = BitcoinUnit.from(350,'mBTC');
        expect(bU.toFiat(420.5,3)).toEqual(147.175);
    });
    
});