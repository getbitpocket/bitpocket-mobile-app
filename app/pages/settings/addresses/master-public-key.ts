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
    index: number = 1;
    active: boolean = false;

    constructor(private config: Config, private nav:NavController, private changeDetector: ChangeDetectorRef) {       
        Promise.all<any>([
            this.config.get('address-type') ,
            this.config.get('master-public-key') ,
            this.config.get('master-public-key-index')
        ]).then(promised => {
            if (promised[0] === ADDRESS_TYPE) {
                this.active = true;
            }
            this.masterPublicKey = promised[1];
            this.index = promised[2];
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
    
    indexChanged() {
        this.config.set('master-public-key-index', this.index);
    }

    scan() {
        let alert:Alert;

        BarcodeScanner.scan().then((barcodeData) => {
            try {                
                this.masterPublicKey = bitcoin.HDNode.fromBase58(barcodeData.text).toBase58();                
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