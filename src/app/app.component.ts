import {Platform, App, Nav, Menu} from 'ionic-angular';
import {Component, ViewChild} from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

// Pages
import {AmountPage} from '../pages/amount/amount';
import {SettingsPage} from '../pages/settings/settings';
import {AccountCreationPage} from '../pages/onboarding/account-creation';
import {OfflinePage} from '../pages/onboarding/offline';
import { AccountPage } from './../pages/account/account';

// import {PincodePage} from '../pages/pincode/pincode';

// Providers
import {Repository, Config, CurrencyService, AccountService} from '../providers';

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
        protected platform: Platform,
        protected statusBar: StatusBar,
        protected splashScreen: SplashScreen,
        protected network: Network,
        protected app:App,
        protected config:Config,
        protected currency:CurrencyService,
        protected repository:Repository,
        protected accountService:AccountService,
        protected translate: TranslateService) {
        
        translate.setDefaultLang('en');
        let langs = ['de','en','pl'];
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
            this.statusBar.styleDefault();
            
            if (this.rootPage === undefined) {
                this.initApp();
            }
                        
            // watch network for a disconnect
            this.network.onDisconnect().subscribe(() => {
                this.nav.setRoot(OfflinePage);
            });

            // watch network for a connection
            this.network.onConnect().subscribe(() => {
                this.initNavState();
            });            
        });
    }

    isOnline() {
        if (this.network.type != 'none') {
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
            this.splashScreen.hide();
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
