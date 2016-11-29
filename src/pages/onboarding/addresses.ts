import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController,AlertController, Alert} from 'ionic-angular';
import {Address, ADDRESS_TYPE_STATIC_ADDRESS, ADDRESS_TYPE_MASTER_PUBLIC_KEY} from '../../providers/address';
import {Config} from '../../providers/config';
import {QRScanner} from '../../providers/qrscanner/qrscanner';
import {AmountPage} from '../amount/amount';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip21 from 'bip21';

@Component({
    templateUrl : 'addresses.html'
})
export class AddressesPage {
    
    addressType: string = "";
    addressInput: string = "";
    showInput: boolean = false;

    constructor(private qrscanner:QRScanner, private config: Config, private nav:NavController, private alertController: AlertController, private changeDetector: ChangeDetectorRef) {              
    }

    start() {
        if (!Address.checkAddressInput(this.addressInput, this.addressType)) {
            let alert = this.alertController.create({
                title: 'Invalid Input',
                subTitle: 'Please recheck your inputs!',
                buttons: ['Ok']
            });
            alert.present();
            
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

        this.qrscanner.scan()
            .then(text => {
                try {
                    if (this.addressType === ADDRESS_TYPE_STATIC_ADDRESS) {                    
                        this.addressInput = bip21.decode(text).address;
                    } else if (this.addressType === ADDRESS_TYPE_MASTER_PUBLIC_KEY) {
                        this.addressInput = bitcoin.HDNode.fromBase58(text).toBase58();
                    }
                
                    this.changeDetector.detectChanges();
                } catch(e) {
                    alert.present();
                }
            })
            .catch(e => {
                console.error(e);
                alert.present();
            });

        alert = this.alertController.create({
            title: 'Scanning Error',
            subTitle: 'There was a scanning error, please try again!',
            buttons: ['Ok']
        });
    }

}