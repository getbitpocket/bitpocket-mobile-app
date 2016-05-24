import 'es6-shim';
import {App, Platform, IonicApp} from 'ionic-angular';
import {Type} from 'angular2/core';

// Pages
import {AmountPage} from './pages/amount/amount';
import {SettingsPage} from './pages/settings/settings';
import {HistoryPage} from './pages/history/history';
//import {PaymentPage} from './pages/payment/payment';

// Providers
import {DatabaseHelper} from './providers/database-helper';
import {Config} from './providers/config';
import {Currency} from './providers/currency/currency';
import {Payment} from './providers/payment/payment';
import {Address} from './providers/address';
import {History} from './providers/history/history';

// Exchange Services
import {BlockchainExchangeService} from './providers/currency/blockchain';

// Payment Services
import {ElectrumPaymentService} from './providers/payment/electrum';

@App({
    templateUrl : 'build/app.html',
    providers: [
        History,
        Currency,
        Address,
        Payment,
        Config ,
        DatabaseHelper ,
        BlockchainExchangeService ,
        ElectrumPaymentService
    ],
    config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class BitpocketApp {
    rootPage: Type = AmountPage;
    menu:Array<{name:string,icon:string,page:any}> = [];

    constructor(platform: Platform, private app:IonicApp, private config:Config, private currency:Currency, private dbHelper:DatabaseHelper, private history: History) {//, private currency:Currency) {
        
        this.menu[0] = { name:'Payment' , icon:'keypad' , page:AmountPage };        
        this.menu[1] = { name:'History', icon:'list', page:HistoryPage };
        this.menu[2] = { name:'Settings', icon:'options', page:SettingsPage };
        //this.menu[3] = { name:'Payment-Try', icon:'options', page:PaymentPage };

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
        this.dbHelper.initDb().then(() => {
            
            /*
            this.history.addTransaction({
                address : '2hh23' ,
                txid : 'blabla' ,
                bitcoinAmount : 0.12345678 ,
                fiatAmount : 1234567.90 ,
                currency : 'EUR'
            });
            */
        });
        this.updateCurrencyRate();
    }

    /*
    this.history.addTransaction({
    address : '2hh23' ,
    txid : 'blabla' ,
    bitcoinAmount : 0.12345678 ,
    fiatAmount : 1234567.90 ,
    currency : 'EUR'
    });
    */
    
    openPage(page:any) {
        this.app.getComponent('menu').close();
        this.app.getComponent('nav').setRoot(page);
    }
}
