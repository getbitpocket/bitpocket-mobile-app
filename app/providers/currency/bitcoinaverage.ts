import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import * as currency from './currency';
import {CurrencyExchangeRate} from '../../api/currency-exchange-rate';
import {CurrencyExchangeService} from '../../api/currency-exchange-service';

@Injectable()
export class BitcoinAverageExchangeService implements CurrencyExchangeService {
        
    constructor(private http:Http) {
    }

    prepareOne(code, json:any) : CurrencyExchangeRate {
        let symbol = code;
        if (currency.CURRENCY_SYMBOLS[code]) {
            symbol = currency.CURRENCY_SYMBOLS[code];
        }

        return {
            code   : code ,
            symbol : symbol ,
            rate   : json.last
        };
    }
    
    prepareAll(json:any) : Array<CurrencyExchangeRate> {
        let output = [];
        
        for (let code in json) {
            if (json.hasOwnProperty(code)) {
                output.push(this.prepareOne(code,json[code]))
            }
        }
        
        return output;
    }
    
    getAvailableCurrencies() : Promise<Array<CurrencyExchangeRate>> {
        return this.getExchangeRates();
    }
    
    getExchangeRates() : Promise<Array<CurrencyExchangeRate>> {
        return new Promise((resolve, reject) => {
            try {
                this.http.get('https://api.bitcoinaverage.com/ticker/global/all')
                    .subscribe(
                        response => {
                            if (response.status === 200) {
                                resolve(this.prepareAll(response.json()));
                            } else {
                                reject();
                            }
                        }
                    );
            } catch(e) {
                console.error(e);
                reject();
            }
        });
    }
    
    getExchangeRate(code:string) : Promise<CurrencyExchangeRate> {
        return new Promise((resolve, reject) => {
            try {
                this.http.get('https://api.bitcoinaverage.com/ticker/global/' + code)
                    .subscribe(
                        response => {
                            if (response.status === 200) {                                
                                resolve(this.prepareOne(code, response.json()));
                            } else {
                                reject();
                            }
                        }
                    );
            } catch(e) {
                console.error(e);
                reject();
            }
        });
    }
    
}