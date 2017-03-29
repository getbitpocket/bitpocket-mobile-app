import {Component} from '@angular/core';
import {Config} from '../../../providers/config';

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
            this.config.get('bitcoin-unit') ,
            this.config.get('payment-request-label')
        ]).then(promised => {
            this.selectedUnit        = promised[0];
            this.paymentRequestLabel = promised[1];
        });
    }

    ionViewWillLeave() {
        this.config.set('bitcoin-unit', this.selectedUnit);
        this.config.set('payment-request-label', this.paymentRequestLabel);
    } 
        
}