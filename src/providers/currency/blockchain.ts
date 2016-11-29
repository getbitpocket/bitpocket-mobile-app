import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import {CurrencyExchangeRate} from '../../api/currency-exchange-rate';
import {CurrencyExchangeService} from '../../api/currency-exchange-service';

@Injectable()
export class BlockchainExchangeService implements CurrencyExchangeService {
        
    constructor(private http:Http) {
    }
    
    prepareOutput(json:any) : Array<CurrencyExchangeRate> {
        let output = [];
        
        for (let key in json) {
            if (json.hasOwnProperty(key)) {
                output.push({
                    code : key ,
                    symbol : json[key].symbol ,
                    rate : json[key].last
                });
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
                this.http.get('https://blockchain.info/ticker?cors=true')
                    .subscribe(
                        response => {
                            if (response.status === 200) {
                                resolve(this.prepareOutput(response.json()));
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
                this.http.get('https://blockchain.info/ticker?cors=true')
                    .subscribe(
                        response => {
                            if (response.status === 200) {
                                let output = {};
                                let json = response.json();
                                
                                for (let key in json) {
                                    if (key === code) {
                                        output = {
                                            code : key ,
                                            symbol : json[key].symbol ,
                                            rate : json[key].last                                            
                                        }
                                    }                                    
                                }
                                
                                resolve(output);
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