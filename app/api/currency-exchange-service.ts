import {CurrencyExchangeRate} from './currency-exchange-rate';

export interface CurrencyExchangeService {
    getAvailableCurrencies() : Promise<Array<CurrencyExchangeRate>>;
    getExchangeRates() : Promise<Array<CurrencyExchangeRate>>;
    getExchangeRate(code:string) : Promise<CurrencyExchangeRate>;
}