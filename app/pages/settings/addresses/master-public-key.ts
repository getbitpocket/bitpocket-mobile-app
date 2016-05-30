import {ChangeDetectorRef} from '@angular/core';
import {Page,NavController,Alert} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import {Config} from '../../../providers/config';
import * as bitcoin from 'bitcoinjs-lib';

const ADDRESS_TYPE = 'master-public-key';

@Page({
    templateUrl : 'build/pages/settings/addresses/master-public-key.html'
})
export class MasterPublicKeyPage {

    masterPublicKey: string = "";
    active: boolean = false;

    constructor(private config: Config, private nav:NavController, private changeDetector: ChangeDetectorRef) {
        let ecPair = bitcoin.ECPair.fromPublicKeyBuffer(
            new Buffer('xpub661MyMwAqRbcGRtebhJdb1sczRppHqk5tXDwmsaW6PCYZm6bNd1Agt3FVuHgW5PwNncBbnBsuxRxkZqGr8uaTMXzmt2kkh4Pebsu2NenNNo') ,
            bitcoin.networks.bitcoin
        );
        
        
        Promise.all<string>([
            this.config.get('address-type') ,
            this.config.get('master-public-key')
        ]).then(promised => {
            if (promised[0] === ADDRESS_TYPE) {
                this.active = true;
            }
            this.masterPublicKey = promised[1];
        });
    }

    activationChanged() {
        if (!this.active) {
            this.config.set('address-type', ADDRESS_TYPE);
        }
    }

    keyChanged() {
        this.config.set('master-public-key', this.masterPublicKey);
    }

    scan() {
        let alert:Alert;

        BarcodeScanner.scan().then((barcodeData) => {
            try {
                
                this.keyChanged();
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