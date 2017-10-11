import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { Config } from '../../../providers/index';

@IonicPage({
    name : 'general' ,
    defaultHistory : ['settings']
})
@Component({
    templateUrl : 'general.html'
})
export class GeneralPage {
    
    selectedUnit: string = 'mBTC';
    selectedExplorer: string = 'blockchaininfo';
    paymentRequestLabel: string = "";

    constructor(private config: Config) {
    }

    ionViewWillEnter() {
        Promise.all<string>([
            this.config.get(Config.CONFIG_KEY_BITCOIN_UNIT) ,
            this.config.get(Config.CONFIG_KEY_PAYMENT_REQUEST_LABEL)
        ]).then(promised => {
            this.selectedUnit = promised[0];
            this.paymentRequestLabel = promised[1];
        });
    }

    ionViewWillLeave() {
        this.config.set(Config.CONFIG_KEY_BITCOIN_UNIT, this.selectedUnit);
        this.config.set(Config.CONFIG_KEY_PAYMENT_REQUEST_LABEL, this.paymentRequestLabel);
    } 
        
}