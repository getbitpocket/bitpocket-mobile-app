import {Injectable} from '@angular/core';
import {CurrencyExchangeService} from '../../api/currency-exchange-service';
import {CurrencyExchangeRate} from '../../api/currency-exchange-rate';
import {Config, BitcoinAverageExchangeService} from './../index';

@Injectable()
export class CurrencyService {

    constructor(protected config: Config, protected exchangeService: BitcoinAverageExchangeService) {        
    }

    getFeePercentage() : Promise<number> {
        return this.config.get(Config.CONFIG_KEY_FEE_PERCENTAGE);
    }

    getExchangeService() : CurrencyExchangeService {
        return this.exchangeService;
    }

    getSelectedCurrency() : Promise<any> {
        return this.config.get(Config.CONFIG_KEY_CURRENCY);
    }

    getSelectedCurrencyRate() : Promise<number> {
        return this.config.get(Config.CONFIG_KEY_EXCHANGE_RATE).then(rate => {
            return parseFloat(rate);
        });
    }

    getCalculatedCurrencyRate() : Promise<number> {
        return new Promise<number> ((resolve, reject) => {
            Promise.all([
                this.config.get(Config.CONFIG_KEY_EXCHANGE_RATE) ,
                this.config.get(Config.CONFIG_KEY_FEE_PERCENTAGE)
            ]).then(values => {
                resolve(parseFloat(values[0]) * ((100.0 - parseFloat(values[1]))/100.0));
            });
        });        
    }

    getAvailableCurrencies() : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            resolve(this.getExchangeService().getAvailableCurrencies());            
        });
    }

    setSelectedCurrency(code:string) : CurrencyService {
        this.config.set(Config.CONFIG_KEY_CURRENCY, code).then(() => {
            this.updateCurrencyRate();
        });            
        return this;
    }

    setFeePercentage(feePercentage:number) : CurrencyService {
        this.config.set(Config.CONFIG_KEY_FEE_PERCENTAGE, feePercentage);
        return this;
    }

    updateCurrencyRate() : Promise<CurrencyExchangeRate> {
        return new Promise<CurrencyExchangeRate>((resolve,reject) => {
            Promise.all<any>([
                this.getExchangeService() ,
                this.getSelectedCurrency()
            ]).then(promised => {
                promised[0].getExchangeRate(promised[1]).then(data => {          
                    this.config.set(Config.CONFIG_KEY_EXCHANGE_RATE, data.rate);

                    resolve({
                        'code'   : promised[1] ,
                        'rate'   : data.rate
                    });
                }).catch(reject);
            }).catch(reject);
        });
    }
    
    /**
     * Format a number, fillup with 0 until minDecimals is reached, cut at maxDecimals
     */
    formatNumber(value: number, separator: string, maxDecimals: number = 2, minDecimals: number = 2) : string {
        let formattedNumber = value.toFixed(maxDecimals).replace(/\./,separator);
        
        if (minDecimals >= maxDecimals) {
            return formattedNumber;
        } else {
            let startLength = (formattedNumber.indexOf(separator) + minDecimals);
            let endIndex    = formattedNumber.length - 1;
            while (startLength < endIndex) {
                if (formattedNumber[endIndex] != "0") {
                    break;
                } else {
                    formattedNumber = formattedNumber.substr(0,formattedNumber.length-1);
                }

                endIndex--;
            }
        }

        return formattedNumber;
    }

}

