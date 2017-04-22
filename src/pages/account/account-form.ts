import {Component} from '@angular/core';
import {NavParams,NavController,AlertController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core'
import { Account } from './../../api/account';
import { Config, AccountService, QRScanner } from './../../providers/index';

@Component({
    templateUrl : 'account-form.html'
})
export class AccountFormPage {

    account:Account = {
        name : '' ,
        type : 'ACCOUNT_TYPE' ,
        data : ''
    };

    removed = false;
    accountEnabled = true;
    accountDefault = false;
    canChangeDefaultAccount = false;

    constructor(
        protected qrscanner: QRScanner ,
        protected accountService: AccountService,
        protected navParams: NavParams,
        protected navController: NavController,
        protected translate: TranslateService,
        protected alertController: AlertController,
        protected config: Config
    ) {
        let id = navParams.get('id');
        if (id) {
            Promise.all<any>([
                this.accountService.getAccount(id),
                this.config.get(Config.CONFIG_KEY_DEFAULT_ACCOUNT),
                this.accountService.getAccounts()                
            ]).then(promised => {
                this.account = promised[0];
                this.accountDefault = promised[0]._id == promised[1];
                this.accountEnabled = false;
                this.canChangeDefaultAccount = promised[2].length > 1 && !this.accountDefault;
            });
        }
    }

    scan() {
        this.qrscanner.scan(text => {
            this.account.data = text.trim();
        });
    }

    ionViewCanLeave() {
        if (this.removed) {
            return true;
        }

        return new Promise<void> ((resolve, reject) => {            
            this.save()
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    Promise.all<string>([
                        this.translate.get('TITLE.INVALID_INPUT').toPromise() ,
                        this.translate.get('TEXT.INVALID_ACCOUNT_INPUT').toPromise() ,
                        this.translate.get('BUTTON.OK').toPromise() ,
                        this.translate.get('BUTTON.CANCEL').toPromise()
                    ]).then((texts) => {
                        let alert = this.alertController.create({
                            title: texts[0],
                            subTitle: texts[1],
                            buttons: [
                                {
                                    text: texts[2] ,
                                    handler : () => {
                                        reject();
                                    }
                                }, {
                                    text : texts[3] ,
                                    handler : () => {
                                        resolve();
                                    }
                                }]
                        });
                        alert.present();                
                        this.account.data = "";                        
                    });
            });
        });
    }

    save() : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                let promise;
                let parsedAccount = this.accountService.parseAccountInput(this.account.data);
                this.account.data = parsedAccount.data;
                this.account.type = parsedAccount.type;
            
                if (this.account._id) {
                    promise = this.accountService.editAccount(this.account);
                } else {
                    promise = this.accountService.addAccount(this.account);
                }

                promise.then((account) => {
                    if (this.accountDefault) {
                        resolve(this.config.set(Config.CONFIG_KEY_DEFAULT_ACCOUNT, account._id));
                    } else {
                        resolve();
                    }                    
                }).catch(() => {
                    reject();
                });
            } catch (e) {
                reject();
            }  
        });        
    }

    remove() {
        Promise.all<string>([
            this.translate.get('TEXT.REMOVE_ACCOUNT').toPromise() ,
            this.translate.get('TEXT.REMOVE_ACCOUNT_QUESTION').toPromise() ,
            this.translate.get('BUTTON.OK').toPromise() ,
            this.translate.get('BUTTON.CANCEL').toPromise()
        ]).then((texts) => {
            let alert = this.alertController.create({
                title: texts[0],
                subTitle: texts[1],
                buttons: [
                    {
                        text: texts[2],
                        handler: () => {
                            this.accountService.removeAccount(this.account._id)
                                .then(() => {
                                    this.removed = true;
                                    this.navController.pop();
                                });                            
                        }
                    },
                    texts[3]
                ]
            });
            alert.present();                
        });
    }

}