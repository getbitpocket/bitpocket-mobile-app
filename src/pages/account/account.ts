import { HistoryPage } from './../history/history';
import { AccountFormPage } from './account-form';
import { NavController } from 'ionic-angular';
import {Component} from '@angular/core';
import { Config, AccountService } from './../../providers/index';

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
        this.navController.push(AccountFormPage, { id : this.accounts[i]._id });
    }

    openAccountCreateForm() {
        this.navController.push(AccountFormPage);
    }

    openAccountHistory(i:number) {
        this.navController.push(HistoryPage, { account : this.accounts[i] });
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