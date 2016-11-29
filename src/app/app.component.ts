import {Platform, App, Nav, Menu} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';
import {StatusBar, Splashscreen, Network} from 'ionic-native';

// Pages
import {AmountPage} from '../pages/amount/amount';
import {SettingsPage} from '../pages/settings/settings';
import {HistoryPage} from '../pages/history/history';
import {AddressesPage} from '../pages/onboarding/addresses';
import {OfflinePage} from '../pages/onboarding/offline';
import {PincodePage} from '../pages/pincode/pincode';

// Providers
import {DatabaseHelper} from '../providers/database-helper';
import {Config} from '../providers/config';
import {Currency} from '../providers/currency/currency';
import {History} from '../providers/history/history';

@Component({
    templateUrl: 'app.html'
})
export class BitPocketApp {
    @ViewChild(Nav) nav: Nav;   
    @ViewChild(Menu) menu: Menu; 
    
    rootPage: any;// = PincodePage;
    menuItems:Array<{name:string,icon:string,page:any}> = [];

    constructor(platform: Platform, private app:App, private config:Config, private currency:Currency, private dbHelper:DatabaseHelper, private history: History) {
        
        this.menuItems[0] = { name:'Payment' , icon:'keypad' , page:AmountPage };        
        this.menuItems[1] = { name:'History', icon:'list', page:HistoryPage };
        this.menuItems[2] = { name:'Settings', icon:'options', page:SettingsPage };
        
        platform.ready().then(() => {
            StatusBar.styleDefault();
            
            if (this.rootPage === undefined) {
                this.initApp();
            }
                        
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
        if (Network.connection != 'none') {
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

    hideSplashscreen() {
        setTimeout(() => {
            Splashscreen.hide();
        }, 2000);
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
                
                this.hideSplashscreen();
            });
        } else {
            this.nav.setRoot(OfflinePage);
            this.hideSplashscreen();
        }
    }
    
    initApp() {
        Promise.all<any>([
            this.dbHelper.initDb() ,
            this.config.initConfig()
        ]).then(() => {
            this.triggerUpdateTask();
            this.initNavState();
        });                
    }
    
    openPage(page:any) {
        this.menu.close();
        this.nav.setRoot(page);
    }
}
