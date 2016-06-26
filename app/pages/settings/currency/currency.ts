import {Component, ChangeDetectorRef} from '@angular/core';
import {Page} from 'ionic-angular';
import {Currency} from '../../../providers/currency/currency';

// services

@Component({
    templateUrl : 'build/pages/settings/currency/currency.html'
})
export class CurrencyPage {     
          
    currencies:Array<{code:string}>;    
    exchangeServices:Array<{code:string,name:string}>;
    selectedExchange:string;
    selectedCurrency:string;
    availableCurrencies:Array<any>;
    
    constructor(private currencyService:Currency, private changeDetector: ChangeDetectorRef) {        
        this.exchangeServices = currencyService.getAvailabeServices();
        Promise.all<any>([
            currencyService.getSelectedService() ,
            currencyService.getSelectedCurrency() ,
            currencyService.getAvailableCurrencies()
        ]).then(selections => {
            this.selectedExchange    = selections[0];
            this.selectedCurrency    = selections[1];
            this.availableCurrencies = selections[2];
            this.changeDetector.detectChanges();
        });
    }

    exchangeChanged() {
        this.currencyService.setSelectedService(this.selectedExchange);
        this.currencyService.getAvailableCurrencies().then((currencies) => {
            this.availableCurrencies = currencies;
            this.changeDetector.detectChanges();
        });
    }
    
    ionViewWillLeave() {
        this.currencyService.setSelectedService(this.selectedExchange);
        this.currencyService.setSelectedCurrency(this.selectedCurrency);
    }  
       
}
