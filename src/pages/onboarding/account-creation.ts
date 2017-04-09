import { AccountSyncService } from './../../providers/account/account-sync-service';
import {Component} from '@angular/core';
import {NavController, AlertController, MenuController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core'
import {AccountService } from './../../providers/account/account-service';
import {Config} from '../../providers/config';
import {QRScanner} from '../../providers/qrscanner/qrscanner';
import {AmountPage} from '../amount/amount';
import 'rxjs/add/operator/toPromise';

@Component({
    templateUrl : 'account-creation.html'
})
export class AccountCreationPage {
    
    accountInput:string = "";

    constructor(
        private accountSyncService: AccountSyncService ,
        private qrscanner:QRScanner,
        private config: Config,
        private accountService: AccountService,
        private nav:NavController,
        private alertController: AlertController,
        private menuController: MenuController,
        private translate: TranslateService) {              
    }

    ionViewWillEnter() {
        this.menuController.enable(false);
    }

    ionViewWillLeave() {
        this.menuController.enable(true);
    }

    start() {
        try {
            let account = this.accountService.parseAccountInput(this.accountInput);
            account.index = 0;
            account.name = "Bitcoin";
            this.accountService.addAccount(account)
                .then(account => {
                    return this.config.set(Config.CONFIG_KEY_DEFAULT_ACCOUNT, account._id);
                }).then(() => {
                    return this.accountSyncService.syncAccount(account);
                }).then(() => {
                    this.nav.setRoot(AmountPage);
                }).catch(e => {
                    console.error(e);
                });
        } catch (e) {
            Promise.all<string>([
                this.translate.get('TITLE.INVALID_INPUT').toPromise() ,
                this.translate.get('TEXT.INVALID_ACCOUNT_INPUT').toPromise() ,
                this.translate.get('BUTTON.OK').toPromise()
            ]).then((texts) => {
                let alert = this.alertController.create({
                    title: texts[0],
                    subTitle: texts[1],
                    buttons: [texts[2]]
                });
                alert.present();
                this.accountInput = "";
            });
        }  
    }

    scan() {
        this.qrscanner.scan((text) => {
            this.accountInput = text;
            this.start();
        });
    }

}