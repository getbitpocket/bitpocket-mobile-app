import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController,Alert} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import {Config} from '../../../providers/config';
import {Address} from '../../../providers/address';
import * as bitcoin from 'bitcoinjs-lib';
import {Logo} from '../../../components/logo';

@Component({
    templateUrl : 'build/pages/settings/addresses/master-public-key.html' ,
    directives : [Logo]
})
export class MasterPublicKeyPage {

    masterPublicKey: string = "";
    index: number = 1;

    constructor(private config: Config, private nav:NavController, private changeDetector: ChangeDetectorRef) {       
        Promise.all<any>([
            this.config.get('master-public-key') ,
            this.config.get('master-public-key-index')
        ]).then(promised => {            
            this.masterPublicKey = promised[0];
            this.index = promised[1];
        });
    }

    inputChanged() {
        if (Address.checkAddressInput(this.masterPublicKey, 'master-public-key')) {
            this.config.set('master-public-key', this.masterPublicKey);
        }
        if (this.index > 0) {
            this.config.set('master-public-key-index', this.index);
        }
    }

    scan() {
        let alert:Alert;

        BarcodeScanner.scan().then((barcodeData) => {
            try {                
                this.masterPublicKey = bitcoin.HDNode.fromBase58(barcodeData.text).toBase58();                
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
        this.inputChanged();
    }  

}