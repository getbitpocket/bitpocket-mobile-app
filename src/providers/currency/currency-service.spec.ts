import {CurrencyService} from './currency-service';

describe('Currency', () => {

    let currencyService: CurrencyService = new CurrencyService(null,null);

    it('format Currency', () => {        
        expect(currencyService.formatNumber(10,',')).toEqual('10,00');
        expect(currencyService.formatNumber(10.2501,',',6,2)).toEqual('10,2501');
        expect(currencyService.formatNumber(10.250,',',3,3)).toEqual('10,250');
    });

});
