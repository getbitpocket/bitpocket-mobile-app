import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController,AlertController} from 'ionic-angular';
import {Address, ADDRESS_TYPE_STATIC_ADDRESS, ADDRESS_TYPE_MASTER_PUBLIC_KEY} from '../../providers/address';
import {Config} from '../../providers/config';
import {QRScanner} from '../../providers/qrscanner/qrscanner';
import {AmountPage} from '../amount/amount';

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
                subTitle: 'Please recheck your input!',
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
        this.qrscanner.scan((text) => {
            return Address.transformAddressInput(text, this.addressType)
        }).then(text => {
            this.addressInput = text;
        });
    }

}