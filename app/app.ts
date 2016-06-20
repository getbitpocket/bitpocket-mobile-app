import 'es6-shim';
import {ionicBootstrap, Platform, App, Nav, Menu} from 'ionic-angular';
import {Component, Type, ViewChild} from '@angular/core';
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

@Component({
    templateUrl : 'build/app.html'    
})
export class BitPocketApp {
    @ViewChild(Nav) nav: Nav;   
    @ViewChild(Menu) menu: Menu; 
    
    rootPage: Type;
    menuItems:Array<{name:string,icon:string,page:any}> = [];

    constructor(platform: Platform, private app:App, private config:Config, private currency:Currency, private dbHelper:DatabaseHelper, private history: History) {//, private currency:Currency) {
        
        this.menuItems[0] = { name:'Payment' , icon:'keypad' , page:AmountPage };        
        this.menuItems[1] = { name:'History', icon:'list', page:HistoryPage };
        this.menuItems[2] = { name:'Settings', icon:'options', page:SettingsPage };
        
        platform.ready().then(() => {
            StatusBar.styleDefault();
            this.initApp();

            // watch network for a disconnect
            Network.onDisconnect().subscribe(() => {
                this.nav.setRoot(OfflinePage);
            });

            // watch network for a connection
            Network.onConnect().subscribe(() => {
                this.initNavState();
            });
        });
    }

    isOnline() {
        if (Network.connection != Connection.NONE) {
            return true;
        } else {
            return false;
        }
    }
    
    triggerUpdateTask() {
        if (this.isOnline()) {
            this.currency.updateCurrencyRate();
        }        

        setTimeout(() => {
            this.triggerUpdateTask();
        },1000 * 60 * 5);
    }

    initNavState() {
        if (this.isOnline()) {
            Promise.all<any>([
                this.config.isSet('address-type') ,
                this.config.isSet('static-address') ,
                this.config.isSet('master-public-key') ,
            ]).then(promised => {        
                if (promised[0] && (promised[1] || promised[2])) {
                    this.nav.setRoot(AmountPage);
                } else {
                    this.nav.setRoot(AddressesPage);
                }
                Splashscreen.hide();
            });
        } else {
            this.nav.setRoot(OfflinePage);
            Splashscreen.hide();
        }
    }
    
    initApp() {
        this.dbHelper.initDb();
        this.triggerUpdateTask();
        this.initNavState();        
    }
    
    openPage(page:any) {
        this.menu.close();
        this.nav.setRoot(page);
    }
}

ionicBootstrap(
    BitPocketApp,
    [ // providers
        History,
        Currency,
        Address,
        Payment,
        Config ,
        DatabaseHelper ,
        BlockchainExchangeService ,
        ElectrumPaymentService
    ],
    {}
); // http://ionicframework.com/docs/v2/api/config/Config/
