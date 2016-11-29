import {Component, ChangeDetectorRef} from '@angular/core';
import {Loading, NavController, LoadingController} from 'ionic-angular';
import {Currency} from '../../../providers/currency/currency';

@Component({
    templateUrl : 'currency.html'
})
export class CurrencyPage {     
          
    currencies:Array<{code:string}>;    
    exchangeServices:Array<{code:string,name:string}>;
    selectedExchange:string;
    selectedCurrency:string;
    availableCurrencies:Array<any>;
    loader: Loading;

    startLoading() {
        this.loader = this.loadingController.create({
            content : "Loading Currencies..."
        });
        this.loader.present();
    }

    stopLoading() {
        this.loader.dismiss();
    }
    
    constructor(private currencyService:Currency, private nav:NavController, private loadingController:LoadingController, private changeDetector: ChangeDetectorRef) {        
        this.exchangeServices = currencyService.getAvailabeServices();        
        this.startLoading();

        Promise.all<any>([
            currencyService.getSelectedService() ,
            currencyService.getSelectedCurrency() ,
            currencyService.getAvailableCurrencies()
        ]).then(selections => {
            this.selectedExchange    = selections[0];
            this.selectedCurrency    = selections[1];
            this.availableCurrencies = selections[2];
            this.changeDetector.detectChanges();
            this.stopLoading();
        });
    }

    exchangeChanged() {
        this.currencyService.setSelectedService(this.selectedExchange);
        this.startLoading();
        
        this.currencyService.getAvailableCurrencies().then((currencies) => {
            this.availableCurrencies = currencies;                        
            this.changeDetector.detectChanges();
            this.stopLoading();
        });
    }
    
    ionViewWillLeave() {
        this.currencyService.setSelectedService(this.selectedExchange);
        this.currencyService.setSelectedCurrency(this.selectedCurrency);
    }  
       
}
