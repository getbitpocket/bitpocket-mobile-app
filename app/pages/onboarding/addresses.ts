import {Component, ChangeDetectorRef} from '@angular/core';
import {Page,NavController,Alert} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import {Address} from '../../providers/address';
import {Config} from '../../providers/config';
import {AmountPage} from '../amount/amount';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip21 from 'bip21';


const ADDRESS_TYPE_MASTER = 'master-public-key';
const ADDRESS_TYPE_STATIC = 'static'

@Component({
    templateUrl : 'build/pages/onboarding/addresses.html'
})
export class AddressesPage {
    
    addressType: string = "";
    addressInput: string = "";
    showInput: boolean = false;

    constructor(private config: Config, private nav:NavController, private changeDetector: ChangeDetectorRef) {              
    }

    start() {
        if (!Address.checkAddressInput(this.addressInput, this.addressType)) {
            let alert = Alert.create({
                title: 'Invalid Innput',
                subTitle: 'Please recheck your inputs!',
                buttons: ['Ok']
            });

            this.nav.present(alert);
            return;
        }

        if (this.addressType === 'static') {                    
            this.config.set(Config.CONFIG_KEY_ADDRESS_TYPE, this.addressType);
            this.config.set(Config.CONFIG_KEY_STATIC_ADDRESS, this.addressInput);
        } else if (this.addressType === 'master-public-key') {
            this.config.set(Config.CONFIG_KEY_ADDRESS_TYPE, this.addressType);
            this.config.set(Config.CONFIG_KEY_MASTER_PUBLIC_KEY, this.addressInput);
            this.config.set(Config.CONFIG_KEY_MASTER_PUBLIC_KEY_INDEX, 1);
        }

        this.nav.setRoot(AmountPage);        
    }

    scan() {
        let alert:Alert;

        BarcodeScanner.scan().then((barcodeData) => {
            try {
                if (this.addressType === 'static') {                    
                    this.addressInput = bip21.decode(barcodeData.text).address;
                } else if (this.addressType === 'master-public-key') {
                    this.addressInput = bitcoin.HDNode.fromBase58(barcodeData.text).toBase58();
                }
                
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

}