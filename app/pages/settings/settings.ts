import {Page,NavController} from 'ionic-angular';

// pages
import {CurrencyPage} from './currency/currency';
import {StaticAddressPage} from './addresses/static';
import {GeneralPage} from './general/general';

@Page({
    templateUrl : 'build/pages/settings/settings.html'
})
export class SettingsPage {
      
    settings:Array<{name:string,description:string,page:any}> = [];
      
    constructor(private navigation:NavController) {
        this.settings[0] = {name:'General Settings',description:'Formatting',page:GeneralPage};
        this.settings[1] = {name:'Currency',description:'Select the currency you want to specify payment amounts',page:CurrencyPage};
        this.settings[2] = {name:'Static address',description:'Static address to receive payments',page:StaticAddressPage};
    }
    
    openPage(page:any) {
        this.navigation.push(page);
    }
    
}
