import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrencyExchangeRate } from '../../api/currency-exchange-rate';
import { CurrencyExchangeService } from '../../api/currency-exchange-service';
import { Config } from '../../providers/index';

@Injectable()
export class BitcoinAverageExchangeService implements CurrencyExchangeService {
        
    constructor(protected http:HttpClient, protected config:Config) {
    }

    prepareOne(code, json:any) : CurrencyExchangeRate {        
        return {
            code   : code ,
            rate   : json.last
        };
    }
    
    prepareAll(json:any) : Array<CurrencyExchangeRate> {
        let output = [];
        
        for (let code in json) {
            if (json.hasOwnProperty(code)) {
                output.push(this.prepareOne(code.slice(-3),json[code]))
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
                this.http.get('https://apiv2.bitcoinaverage.com/indices/global/ticker/short?crypto=BTC')
                    .subscribe(
                        response => {
                            let currencies = this.prepareAll(response);
                            this.config.set(Config.CONFIG_KEY_CURRENCY_CACHE, currencies);
                            resolve(currencies);                            
                        } ,
                        error => {
                            resolve(this.config.get(Config.CONFIG_KEY_CURRENCY_CACHE));
                        }
                    );
            } catch(e) {
                console.error(e);
                resolve(this.config.get(Config.CONFIG_KEY_CURRENCY_CACHE));
            }
        });
    }
    
    getExchangeRate(code:string) : Promise<CurrencyExchangeRate> {
        return new Promise((resolve, reject) => {
            try {
                this.http.get('https://apiv2.bitcoinaverage.com/indices/global/ticker/short?crypto=BTC&fiats=' + code)
                    .subscribe(
                        response => {                            
                            resolve(this.prepareOne(code, response['BTC' + code]));
                        } ,
                        error => {
                            reject();
                        }
                    );
            } catch(e) {
                console.error(e);
                reject();
            }
        });
    }
    
}