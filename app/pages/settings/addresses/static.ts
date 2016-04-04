import {Page,NavController,Alert} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import * as bip21 from 'bip21';
import {Config} from '../../../providers/config';

const ADDRESS_TYPE = 'static';

@Page({
    templateUrl : 'build/pages/settings/addresses/static.html'
})
export class StaticAddressPage {     
       
    address: string = "";
    active: boolean = false;
       
    constructor(private nav:NavController) {
        let addressType = Config.getItem('address-type');        
        if (addressType === ADDRESS_TYPE) {
            this.active = true;
        }
        this.address = Config.getItem('static-address');
    }
    
    activationChanged() {        
        if (!this.active) {
            Config.setItem('address-type',ADDRESS_TYPE);
        }
    }
    
    addressChanged() {
        Config.setItem('static-address',this.address);
    }
    
    scan() { 
        let alert:Alert;
        
        BarcodeScanner.scan().then((barcodeData) => {
            try {
                    // TODO: check if this is a valid address
                    this.address = bip21.decode(barcodeData.text).address;                    
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