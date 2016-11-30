import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Config} from '../../../providers/config';
import {Address, ADDRESS_TYPE_STATIC_ADDRESS} from '../../../providers/address';
import {QRScanner} from '../../../providers/qrscanner/qrscanner';

@Component({
    templateUrl : 'static-address.html'
})
export class StaticAddressPage {

    address: string = "";

    constructor(private qrscanner: QRScanner, private config: Config, private nav:NavController) {
        Promise.all<string>([
            this.config.get('static-address')
        ]).then(promised => {
            this.address = promised[0];
        });
    }

    addressChanged() {
        if (Address.checkAddressInput(this.address, 'static-address')) {
            this.config.set('static-address', this.address);
        }        
    }

    scan() {       
        this.qrscanner.scan(text => {
            return Address.transformAddressInput(text, ADDRESS_TYPE_STATIC_ADDRESS);
        }).then(text => {
            this.address = text;
        });
    }

    ionViewWillLeave() {
        // TODO: Alert message if not a valid address
        this.addressChanged();
    }  

}