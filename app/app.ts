import {App, Platform, IonicApp} from 'ionic-angular';
import {Type} from 'angular2/core';
import {JSONP_PROVIDERS} from 'angular2/http'

// Pages
import {AmountPage} from './pages/amount/amount';
import {SettingsPage} from './pages/settings/settings';

// Providers
import {Currency} from './providers/currency/currency';
import {Payment} from './providers/payment/payment';
import {Address} from './providers/address';

// Exchange Services
import {BlockchainExchangeService} from './providers/currency/blockchain';

// Payment Services
import {BlockchainPaymentService} from './providers/payment/blockchain';

@App({
    templateUrl : 'build/app.html',
    providers: [
        JSONP_PROVIDERS,
        Currency,
        Address,
        Payment,
        BlockchainExchangeService ,
        BlockchainPaymentService
    ],
    config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class BitpocketApp {
    rootPage: Type = AmountPage;
    menu:Array<{name:string,icon:string,page:any}> = [];

    constructor(platform: Platform, private app:IonicApp, private currency:Currency) {
        
        this.menu[0] = {name:'Payment',icon:'keypad',page:AmountPage};
        this.menu[1] = {name:'Settings',icon:'options',page:SettingsPage};
      
        platform.ready().then(() => {            
            this.initApp();
        });
    }
    
    updateCurrencyRate() {
        this.currency.updateCurrencyRate();        
        setTimeout(() => {
            this.updateCurrencyRate();
        },1000 * 60 * 5);
    }
    
    initApp() {
        this.updateCurrencyRate();
    }
    
    openPage(page:any) {
        this.app.getComponent('menu').close();
        this.app.getComponent('nav').setRoot(page);
    }
}
