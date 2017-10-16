import { NavController, IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';
import { Config, AccountService } from './../../providers/index';

@IonicPage({
    name : 'account' ,    
    defaultHistory: ['amount']
})
@Component({
    templateUrl : 'account.html'
})
export class AccountPage {

    accounts:any[];
    defaultAccount:string = "";

    constructor(
        protected config:Config,
        protected navController:NavController,
        protected accountService:AccountService) {}

    openAccountEditForm(i:number) {
        this.navController.push('account-form', { id : this.accounts[i]._id });
    }

    openAccountCreateForm() {
        this.navController.push('account-form');
    }

    openAccountHistory(i:number) {
        this.navController.push('history', { accountId : this.accounts[i]._id });
    }

    ionViewWillEnter() {
        this.accounts = [];

        Promise.all<any>([
            this.accountService.getAccounts() ,
            this.config.get(Config.CONFIG_KEY_DEFAULT_ACCOUNT)
        ]).then(promised => {
            for (let account of promised[0]) {
                if (/bitcoin/.test(account.type)) {
                    account['icon'] = 'bitcoin';
                }
                if (/testnet/.test(account.type)) {
                    account['icon'] = 'testnet';
                }
                this.defaultAccount = promised[1];
                this.accounts.push(account);
            }
        });       
    }

}