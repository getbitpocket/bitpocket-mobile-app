import {ChangeDetectorRef} from '@angular/core';
import {Page,NavController,Alert} from 'ionic-angular';
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

@Page({
    templateUrl : 'build/pages/settings/general/general.html'
})
export class GeneralPage {
    
    selectedFormat: string = 'us';
    selectedUnit: string = 'mBTC';

    constructor(private config: Config, private changeDetector: ChangeDetectorRef) {
        Promise.all<string>([
            this.config.get('currency-format') ,
            this.config.get('bitcoin-unit') ,
        ]).then(promised => {
            this.selectedFormat = promised[0];
            this.selectedUnit   = promised[1];
            this.changeDetector.detectChanges();
        });
    }

    unitChanged() {
        this.config.set('bitcoin-unit', this.selectedUnit);
    }
    
    formatChanged() {
        this.config.set('currency-format',this.selectedFormat);
        this.config.set('currency-format-t',CURRENCY_FORMATS[this.selectedFormat].t);
        this.config.set('currency-format-s',CURRENCY_FORMATS[this.selectedFormat].s);
    }
        
}