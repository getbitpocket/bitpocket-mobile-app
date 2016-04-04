import {Injectable, Injector} from 'angular2/core';
import {Config} from '../config';
import {BlockchainExchangeService} from './blockchain';

const EXCHANGE_SERVICES:Array<{code:string,name:string}> = [
    {code:'blockchain',name:'Blockchain.info'},
    {code:'bitcoinaverage',name:'BitcoinAverage'}
];

export interface ExchangeService {
    getAvailableCurrencies() : Promise<Array<{code:string,symbol:string,rate?:number}>>;
    getExchangeRates() : Promise<Array<{code:string,symbol:string,rate:number}>>;
    getExchangeRate(code:string) : Promise<{code:string,symbol:string,rate:number}>;
}

@Injectable()
export class Currency {
    
    constructor(private injector: Injector) {        
        if (!Config.hasItem('exchange') || !Config.hasItem('currency')) {
            Config.setItem('exchange','blockchain');
            Config.setItem('currency','EUR');
        }        
    }
    
    getAvailabeServices() : Array<{code:string,name:string}> {
        return EXCHANGE_SERVICES;
    }
    
    getSelectedService() : string {
        return Config.getItem('exchange');
    }
    
    getExchangeService() : ExchangeService {
        if (Config.getItem('exchange') === 'blockchain') {
            return this.injector.get(BlockchainExchangeService);
        } else {
            return this.injector.get(BlockchainExchangeService);
        }   
    }
    
    getSelectedCurrency() {
        return Config.getItem('currency');
    }
    
    getAvailableCurrencies() : Promise<any> {        
        return this.getExchangeService().getAvailableCurrencies();
    }
    
    setSelectedService(code:string) {
        Config.setItem('exchange',code);
    }
    
    setSelectedCurrency(code:string) {
        Config.setItem('currency',code);
        this.updateCurrencyRate();
    }
    
    updateCurrencyRate() {
        this.getExchangeService().getExchangeRate(this.getSelectedCurrency()).then((data) => {
            Config.setItem('symbol',data.symbol);    
            Config.setItem('rate',data.rate.toString());
        });        
    }
    
    convertToBitcoin(amount:number) : number {
        let rate = parseFloat(Config.getItem('rate'));
        return parseFloat((amount / rate).toFixed(8));
    }
    
}

