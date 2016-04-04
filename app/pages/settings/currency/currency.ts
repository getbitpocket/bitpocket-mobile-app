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
        this.selectedExchange = currencyService.getSelectedService();
        this.selectedCurrency = currencyService.getSelectedCurrency();
        
        currencyService.getAvailableCurrencies().then((currencies) => {
            this.availableCurrencies = currencies;
        });
    }
    
    exchangeChanged() {
        this.currencyService.setSelectedService(this.selectedExchange);
    }
    
    currencyChanged() {
        this.currencyService.setSelectedCurrency(this.selectedCurrency);
    }
       
}
