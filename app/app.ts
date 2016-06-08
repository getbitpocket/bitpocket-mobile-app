import 'es6-shim';
import {App, Platform, IonicApp, Nav, Menu} from 'ionic-angular';
import {Type, ViewChild} from '@angular/core';
import {StatusBar, Splashscreen, Network, Connection} from 'ionic-native';

// Pages
import {AmountPage} from './pages/amount/amount';
import {SettingsPage} from './pages/settings/settings';
import {HistoryPage} from './pages/history/history';
import {AddressesPage} from './pages/onboarding/addresses';
import {OfflinePage} from './pages/onboarding/offline';

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
    @ViewChild(Nav) nav: Nav;   
    @ViewChild(Menu) menu: Menu; 
    
    rootPage: Type = AmountPage;
    menuItems:Array<{name:string,icon:string,page:any}> = [];

    constructor(platform: Platform, private app:IonicApp, private config:Config, private currency:Currency, private dbHelper:DatabaseHelper, private history: History) {//, private currency:Currency) {
        
        this.menuItems[0] = { name:'Payment' , icon:'keypad' , page:AmountPage };        
        this.menuItems[1] = { name:'History', icon:'list', page:HistoryPage };
        this.menuItems[2] = { name:'Settings', icon:'options', page:SettingsPage };
        
        platform.ready().then(() => {
            // watch network for a disconnect
            let disconnectSubscription = Network.onDisconnect().subscribe(() => {
                console.log('network was disconnected :-( ')
                this.nav.push(OfflinePage);
            });

            // stop disconnect watch
            //disconnectSubscription.unsubscribe();

            // watch network for a connection
            let connectSubscription = Network.onConnect().subscribe(() => {
                console.log('network connected!');
                StatusBar.styleDefault();
                Splashscreen.hide();
                this.initApp();
            });

            // stop connect watch
            //connectSubscription.unsubscribe();
        });
    }
    
    updateCurrencyRate() {
        this.currency.updateCurrencyRate();        
        setTimeout(() => {
            this.updateCurrencyRate();
        },1000 * 60 * 5);
    }
    
    initApp() {
        this.dbHelper.initDb(); // .then check db success init --- DODO
        this.updateCurrencyRate();

        Promise.all<string>([
            this.config.get('address-type') ,
            this.config.get('static-address'),
            this.config.get('master-public-key')
        ]).then(promised => {
            console.log(promised[0] + " " + promised[1] + " " + promised[2]);
            if (promised[1] === undefined && promised[2] === undefined) {
                this.nav.push(AddressesPage);
            }
        });

    }
    
    openPage(page:any) {
        this.menu.close();
        this.nav.setRoot(page);
    }
}
