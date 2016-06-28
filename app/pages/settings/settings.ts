import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Logo} from '../../components/logo';

// pages
import {CurrencyPage} from './currency/currency';
import {StaticAddressPage} from './addresses/static-address';
import {MasterPublicKeyPage} from './addresses/master-public-key';
import {GeneralPage} from './general/general';

@Component({
    templateUrl : 'build/pages/settings/settings.html' ,
    directives : [Logo]
})
export class SettingsPage {
      
    settings:Array<{name:string,description:string,page:any}> = [];
      
    constructor(private navigation:NavController) {
        this.settings[0] = {name:'General Settings',description:'Formatting, Explorer',page:GeneralPage};
        this.settings[1] = {name:'Currency',description:'Select the currency you want to specify payment amounts',page:CurrencyPage};
        this.settings[2] = {name:'Static Address',description:'Static address to receive payments',page:StaticAddressPage};
        this.settings[3] = {name:'Master Public Key',description:'derive new address for each payment',page:MasterPublicKeyPage};
    }
    
    openPage(page:any) {
        this.navigation.push(page);
    }
    
}
