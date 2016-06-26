import {Injectable, Injector} from '@angular/core';
import {Config} from '../config';
import {CurrencyExchangeService} from '../../api/currency-exchange-service';
import {BlockchainExchangeService} from './blockchain';
import {BitcoinAverageExchangeService} from './bitcoinaverage';
import {BitcoinUnit} from './bitcoin-unit';

const EXCHANGE_SERVICES:Array<{code:string,name:string}> = [
    { code:'blockchain', name:'Blockchain.info' },
    { code:'bitcoinaverage', name:'BitcoinAverage' }
];

export const CURRENCY_SYMBOLS = {
    'USD': '$', // US Dollar
    'EUR': '€', // Euro
    'CRC': '₡', // Costa Rican Colón
    'GBP': '£', // British Pound Sterling
    'ILS': '₪', // Israeli New Sheqel
    'INR': '₹', // Indian Rupee
    'JPY': '¥', // Japanese Yen
    'KRW': '₩', // South Korean Won
    'NGN': '₦', // Nigerian Naira
    'PHP': '₱', // Philippine Peso
    'PLN': 'zł', // Polish Zloty
    'PYG': '₲', // Paraguayan Guarani
    'THB': '฿', // Thai Baht
    'UAH': '₴', // Ukrainian Hryvnia
    'VND': '₫', // Vietnamese Dong
    'BTC': 'Ƀ'
};

@Injectable()
export class Currency {

    constructor(private config: Config, private injector: Injector) {        
    }

    getAvailabeServices() : Array<{code:string,name:string}> {
        return EXCHANGE_SERVICES;
    }

    getSelectedService() : Promise<string> {
        return this.config.get('exchange');
    }

    getExchangeService() : Promise<CurrencyExchangeService> {
        return new Promise<CurrencyExchangeService>((resolve, reject) => {
            this.getSelectedService().then(exchange => {
                if (exchange === 'blockchain') {
                    resolve(this.injector.get(BlockchainExchangeService));
                } else if (exchange === 'bitcoinaverage') {
                    resolve(this.injector.get(BitcoinAverageExchangeService));
                } else {
                    resolve(this.injector.get(BlockchainExchangeService));
                }
            });
        });
    }

    getSelectedCurrency() : Promise<any> {
        return this.config.get('currency');
    }

    getSelectedCurrencyRate() : Promise<number> {
        return this.config.get('rate').then(rate => {
            return parseFloat(rate);
        });
    }

    getAvailableCurrencies() : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.getExchangeService().then(exchangeService => {
                resolve(exchangeService.getAvailableCurrencies());
            });
        });
    }

    setSelectedService(code:string) : Currency {
        this.config.set('exchange', code);
        return this;
    }

    setSelectedCurrency(code:string) : Currency {
        this.config.set('currency', code).then(() => {
            this.updateCurrencyRate();
        });            

        return this;
    }

    updateCurrencyRate() : Currency {
        Promise.all<any>([
            this.getExchangeService() ,
            this.getSelectedCurrency()
        ]).then(promisedArray => {
            return promisedArray[0].getExchangeRate(promisedArray[1]);
        }).then(data => {
            this.config.set('symbol', data.symbol);
            this.config.set('rate', data.rate.toString());
        });

        return this;
    }

    getCurrencySymbol(currency: string) : string {
        if (CURRENCY_SYMBOLS.hasOwnProperty(currency)) {
            return CURRENCY_SYMBOLS[currency];
        } else {
            return currency;
        }
    }
    
    formatNumber(value: number, separator: string, decimals: number = 2) : string {
        return value.toFixed(decimals).replace(/\./,separator);
    }

}

