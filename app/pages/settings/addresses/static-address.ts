import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, Alert} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import * as bip21 from 'bip21';
import {Config} from '../../../providers/config';
import {Address} from '../../../providers/address';
import {Logo} from '../../../components/logo';

@Component({
    templateUrl : 'build/pages/settings/addresses/static-address.html' ,
    directives : [Logo]
})
export class StaticAddressPage {

    address: string = "";

    constructor(private config: Config, private nav:NavController, private changeDetector: ChangeDetectorRef) {
        Promise.all<string>([
            this.config.get('static-address')
        ]).then(promised => {
            this.address = promised[0];
            this.changeDetector.detectChanges();
        });
    }

    addressChanged() {
        if (Address.checkAddressInput(this.address, 'static-address')) {
            this.config.set('static-address', this.address);
        }        
    }

    scan() {
        let alert:Alert;

        BarcodeScanner.scan().then((barcodeData) => {
            try {
                this.address = bip21.decode(barcodeData.text).address;
                this.changeDetector.detectChanges();
            } catch(e) {
                this.nav.present(alert);
            }
        }, (error) => {
            this.nav.present(alert);
        });

        alert = Alert.create({
            title: 'Scanning Error',
            subTitle: 'There was a scanning error, please try again!',
            buttons: ['Ok']
        });
    }

    ionViewWillLeave() {
        // TODO: Alert message if not a valid address
        this.addressChanged();
    }  

}