import * as ionic from 'ionic-angular';
import { Component, ViewChild } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';

// Providers
import { Repository, Config, CurrencyService, AccountService } from '../providers';
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: 'app.html'
})
export class BitPocketApp {
    @ViewChild(ionic.Nav)  nav: ionic.Nav;   
    @ViewChild(ionic.Menu) menu: ionic.Menu; 
    
    menuItems:Array<{name:string,icon:string,page:any}> = [];

    constructor(
        protected platform: ionic.Platform,
        protected statusBar: StatusBar,
        protected splashScreen: SplashScreen,
        protected network: Network,
        protected app:ionic.App,
        protected config:Config,
        protected ionicConfig:ionic.Config,
        protected currency:CurrencyService,
        protected repository:Repository,
        protected accountService:AccountService,
        protected translate: TranslateService) {
               
        platform.ready().then(() => {
            this.statusBar.styleDefault();      
            this.initLanguage();      
            this.initApp();
                        
            // watch network for a disconnect
            this.network.onDisconnect().subscribe(() => {
                this.nav.setRoot('offline');
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
        },1000 * 60 * 10);
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
                        this.nav.setRoot('amount');
                    } else {
                        this.nav.setRoot('account-creation');
                    }                    
                    this.hideSplashscreen();
                }).catch(() => {
                    this.nav.setRoot('account-creation');
                    this.hideSplashscreen();
                });
        } else {
            this.nav.setRoot('offline');
            this.hideSplashscreen();
        }
    }

    initLanguage() {
        this.translate.setDefaultLang('en');
        let langs = ['de','en','pl'];
        let langIndex = langs.indexOf(this.translate.getBrowserLang()); 

        if (langIndex == -1) {
            this.translate.use('en');
        } else {
            this.translate.use(langs[langIndex]);
        }

        let languageIdentifiers = ['MENU.PAYMENT', 'MENU.ACCOUNTS', 'MENU.SETTINGS', 'BUTTON.BACK'];
        this.translate.get(languageIdentifiers)
            .subscribe((res:Array<string>) => {
                this.menuItems[0] = { name:res[languageIdentifiers[0]], icon:'keypad' , page:'amount' };        
                this.menuItems[1] = { name:res[languageIdentifiers[1]], icon:'list',    page:'account' };
                this.menuItems[2] = { name:res[languageIdentifiers[2]], icon:'options', page:'settings' };
                this.ionicConfig.set('ios', 'backButtonText', res[languageIdentifiers[3]]);
            });
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
