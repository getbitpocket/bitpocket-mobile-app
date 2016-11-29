import {Component, ChangeDetectorRef} from '@angular/core';
import {Config} from '../../../providers/config';

// t = thousands point
// s = separator
const CURRENCY_FORMATS = {
    'de' : {
        t : '.' ,
        s : ','
    } ,
    'us' : {
        t : ',' ,
        s : '.'
    }
};

@Component({
    templateUrl : 'general.html'
})
export class GeneralPage {
    
    selectedFormat: string = 'us';
    selectedUnit: string = 'mBTC';
    selectedExplorer: string = 'blockchaininfo';
    paymentRequestLabel: string = "";
    currencyFormat: string = "";

    constructor(private config: Config, private changeDetector: ChangeDetectorRef) {
        Promise.all<string>([
            this.config.get('currency-format') ,
            this.config.get('bitcoin-unit') ,
            this.config.get('payment-request-label')
        ]).then(promised => {
            this.selectedFormat      = promised[0];
            this.selectedUnit        = promised[1];
            this.paymentRequestLabel = promised[2];
            this.changeDetector.detectChanges();
        });
    }

    inputChanged() {
        this.changeDetector.detectChanges();
    }

    ionViewWillLeave() {
        this.config.set('bitcoin-unit', this.selectedUnit);
        this.config.set('currency-format', this.selectedFormat);
        this.config.set('currency-format-t', CURRENCY_FORMATS[this.selectedFormat].t);
        this.config.set('currency-format-s', CURRENCY_FORMATS[this.selectedFormat].s);
        this.config.set('payment-request-label', this.paymentRequestLabel);
    } 
        
}