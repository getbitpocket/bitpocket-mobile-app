import {ChangeDetectorRef} from '@angular/core';
import {Page,NavController,Alert} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import * as bip21 from 'bip21';
import {Config} from '../../../providers/config';

const ADDRESS_TYPE = 'static';

@Page({
    templateUrl : 'build/pages/settings/addresses/static-address.html'
})
export class StaticAddressPage {

    address: string = "";
    active: boolean = false;

    constructor(private config: Config, private nav:NavController, private changeDetector: ChangeDetectorRef) {
        Promise.all<string>([
            this.config.get('address-type') ,
            this.config.get('static-address')
        ]).then(promised => {
            if (promised[0] === ADDRESS_TYPE) {
                this.active = true;
            }
            this.address = promised[1];
        });
    }

    activationChanged() {
        if (!this.active) {
            this.config.set('address-type', ADDRESS_TYPE);
        }
    }

    addressChanged() {
        this.config.set('static-address', this.address);
    }

    scan() {
        let alert:Alert;

        BarcodeScanner.scan().then((barcodeData) => {
            try {
                // TODO: check if this is a valid address
                this.address = bip21.decode(barcodeData.text).address;
                this.addressChanged();
                this.changeDetector.detectChanges();
            } catch(e) {
                this.nav.present(alert);
            }
        }, (error) => {
            console.error(error);
            this.nav.present(alert);
        });

        alert = Alert.create({
            title: 'Scanning Error',
            subTitle: 'There was a scanning error, please try again!',
            buttons: ['Ok']
        });
    }

}