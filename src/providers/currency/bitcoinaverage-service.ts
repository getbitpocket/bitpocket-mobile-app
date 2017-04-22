import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {CurrencyExchangeRate} from '../../api/currency-exchange-rate';
import {CurrencyExchangeService} from '../../api/currency-exchange-service';

@Injectable()
export class BitcoinAverageExchangeService implements CurrencyExchangeService {
        
    constructor(protected http:Http) {
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
                this.http.get('https://apiv2.bitcoinaverage.com/indices/global/ticker/short?crypto=BTC&fiats=' + code)
                    .subscribe(
                        response => {
                            if (response.status === 200) {                                
                                resolve(this.prepareOne(code, response.json()['BTC' + code]));
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