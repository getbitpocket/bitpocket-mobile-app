import { Component } from '@angular/core';
import { Loading, NavController, LoadingController, IonicPage } from 'ionic-angular';
import { CurrencyService } from '../../../providers/index';
import { TranslateService } from '@ngx-translate/core'
import 'rxjs/add/operator/toPromise';

@IonicPage({
    name : 'currency' ,
    defaultHistory : ['settings']
})
@Component({
    templateUrl : 'currency.html'
})
export class CurrencyPage {     
          
    currencies:Array<{code:string}>;    
    selectedCurrency:string;
    availableCurrencies:Array<any>;
    loader: Loading;
    rateFee: number = 0;
    currencySeparator: string = "";

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
    }

    increaseFee() {
        this.rateFee += 5;
    }

    decreaseFee() {
        this.rateFee -= 5;
    }

    ionViewWillEnter() {
        this.startLoading();
        
        Promise.all<any>([
            this.currencyService.getSelectedCurrency() ,
            this.currencyService.getAvailableCurrencies() ,
            this.translateService.get('FORMAT.CURRENCY_S').toPromise() ,
            this.currencyService.getFeePercentage()
        ]).then(selections => {
            this.selectedCurrency    = selections[0];
            this.availableCurrencies = selections[1];
            this.currencySeparator   = selections[2];
            this.rateFee             = selections[3] * 100;
            this.stopLoading();
        });
    }
    
    ionViewWillLeave() {
        this.currencyService.setFeePercentage(this.rateFee / 100);
        this.currencyService.setSelectedCurrency(this.selectedCurrency);
    }     
       
}
