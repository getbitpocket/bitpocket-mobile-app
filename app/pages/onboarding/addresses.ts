import {Component, ChangeDetectorRef} from '@angular/core';
import {Page,NavController,Alert} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import {Address, ADDRESS_TYPE_STATIC_ADDRESS, ADDRESS_TYPE_MASTER_PUBLIC_KEY} from '../../providers/address';
import {Config} from '../../providers/config';
import {AmountPage} from '../amount/amount';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip21 from 'bip21';

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
                title: 'Invalid Input',
                subTitle: 'Please recheck your inputs!',
                buttons: ['Ok']
            });

            this.nav.present(alert);
            return;
        }

        if (this.addressType === ADDRESS_TYPE_STATIC_ADDRESS) {                    
            this.config.set(Config.CONFIG_KEY_ADDRESS_TYPE, this.addressType);
            this.config.set(Config.CONFIG_KEY_STATIC_ADDRESS, this.addressInput);
        } else if (this.addressType === ADDRESS_TYPE_MASTER_PUBLIC_KEY) {
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
                if (this.addressType === ADDRESS_TYPE_STATIC_ADDRESS) {                    
                    this.addressInput = bip21.decode(barcodeData.text).address;
                } else if (this.addressType === ADDRESS_TYPE_MASTER_PUBLIC_KEY) {
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