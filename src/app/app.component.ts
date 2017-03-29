import {Platform, App, Nav, Menu} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';
import {StatusBar, Splashscreen, Network} from 'ionic-native';

// Pages
import {AmountPage} from '../pages/amount/amount';
import {SettingsPage} from '../pages/settings/settings';
import {AccountCreationPage} from '../pages/onboarding/account-creation';
import {OfflinePage} from '../pages/onboarding/offline';
import { AccountPage } from './../pages/account/account';

// import {PincodePage} from '../pages/pincode/pincode';

// Providers
import {Repository} from '../providers/repository';
import {Config} from '../providers/config';
import {Currency} from '../providers/currency/currency';
import {AccountService} from './../providers/account/account-service';

import {TranslateService} from '@ngx-translate/core';

@Component({
    templateUrl: 'app.html'
})
export class BitPocketApp {
    @ViewChild(Nav) nav: Nav;   
    @ViewChild(Menu) menu: Menu; 
    
    rootPage: any;// = PincodePage;
    menuItems:Array<{name:string,icon:string,page:any}> = [];

    constructor(
        platform: Platform,
        private app:App,
        private config:Config,
        private currency:Currency,
        private repository:Repository,
        private accountService:AccountService,
        private translate: TranslateService) {
        
        translate.setDefaultLang('en');
        let langs = ['de','en'];
        let langIndex = langs.indexOf(translate.getBrowserLang()); 

        if (langIndex == -1) {
            translate.use('en');
        } else {
            translate.use(langs[langIndex]);
        }

        let menuItemLangIdentifiers = ['MENU.PAYMENT', 'MENU.ACCOUNTS', 'MENU.SETTINGS'];
        translate.get(menuItemLangIdentifiers)
            .subscribe((res:Array<string>) => {
                this.menuItems[0] = { name:res[menuItemLangIdentifiers[0]], icon:'keypad' , page:AmountPage };        
                this.menuItems[1] = { name:res[menuItemLangIdentifiers[1]], icon:'list', page:AccountPage };
                this.menuItems[2] = { name:res[menuItemLangIdentifiers[2]], icon:'options', page:SettingsPage };
            });
        
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
        if (Network['connection'] != 'none') {
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
            this.accountService.getAccounts()
                .then((accounts) => {   
                    if (accounts.length > 0) {
                        this.nav.setRoot(AmountPage);
                    } else {
                        this.nav.setRoot(AccountCreationPage);
                    }                    
                    this.hideSplashscreen();
                }).catch(() => {
                    this.nav.setRoot(AccountCreationPage);
                    this.hideSplashscreen();
                });
        } else {
            this.nav.setRoot(OfflinePage);
            this.hideSplashscreen();
        }
    }
    
    initApp() {
        Promise.all<any>([
            this.repository.init() ,
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
