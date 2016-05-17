import {Page} from 'ionic-angular';
import {Currency} from '../../../providers/currency/currency';

// services

@Page({
    templateUrl : 'build/pages/settings/currency/currency.html'
})
export class CurrencyPage {     
          
    currencies:Array<{code:string}>;    
    exchangeServices:Array<{code:string,name:string}>;
    selectedExchange:string;
    selectedCurrency:string;
    availableCurrencies:Array<any>;
    
    constructor(private currencyService:Currency) {        
        this.exchangeServices = currencyService.getAvailabeServices();
        Promise.all<any>([
            currencyService.getSelectedService() ,
            currencyService.getSelectedCurrency() ,
            currencyService.getAvailableCurrencies()
        ]).then(selections => {
            this.selectedExchange = selections[0];
            this.selectedCurrency = selections[1];
            this.availableCurrencies = selections[2];
        });
    }
    
    exchangeChanged() {
        this.currencyService.setSelectedService(this.selectedExchange);
    }
    
    currencyChanged() {
        this.currencyService.setSelectedCurrency(this.selectedCurrency);
    }
       
}
