import {Component} from '@angular/core';
import {Loading, NavController, LoadingController} from 'ionic-angular';
import { CurrencyService } from '../../../providers/index';
import {TranslateService} from '@ngx-translate/core'

@Component({
    templateUrl : 'currency.html'
})
export class CurrencyPage {     
          
    currencies:Array<{code:string}>;    
    selectedCurrency:string;
    availableCurrencies:Array<any>;
    loader: Loading;

    startLoading() {
        this.translateService.get("TEXT.LOADING_CURRENCIES").toPromise()
            .then((text) => {
                this.loader = this.loadingController.create({
                    content : text
                });
                this.loader.present();
            });           
    }

    stopLoading() {
        this.loader.dismiss();
    }
    
    constructor(
        protected translateService:TranslateService,
        protected currencyService:CurrencyService,
        protected nav:NavController,
        protected loadingController:LoadingController) {        
        this.startLoading();

        Promise.all<any>([
            currencyService.getSelectedCurrency() ,
            currencyService.getAvailableCurrencies()
        ]).then(selections => {
            this.selectedCurrency    = selections[0];
            this.availableCurrencies = selections[1];
            this.stopLoading();
        });
    }
    
    ionViewWillLeave() {
        this.currencyService.setSelectedCurrency(this.selectedCurrency);
    }  
       
}
