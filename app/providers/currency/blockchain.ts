import {Http} from 'angular2/http';
import {Injectable} from 'angular2/core';
import {ExchangeService} from './currency';

@Injectable()
export class BlockchainExchangeService implements ExchangeService {
        
    constructor(private http:Http) {
    }
    
    prepareOutput(json:any) : Array<{code:string,symbol:string,rate?:number}> {
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
    
    getAvailableCurrencies() : Promise<Array<{code:string,symbol:string,rate?:number}>> {
        return this.getExchangeRates();
    }
    
    getExchangeRates() : Promise<Array<{code:string,symbol:string,rate:number}>> {
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
    
    getExchangeRate(code:string) : Promise<{code:string,symbol:string,rate:number}> {
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