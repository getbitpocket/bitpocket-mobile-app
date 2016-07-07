import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Address, ADDRESS_TYPE_STATIC_ADDRESS, ADDRESS_TYPE_MASTER_PUBLIC_KEY} from '../../providers/address';
import {Logo} from '../../components/logo';

// pages
import {GeneralPage} from './general/general';
import {CurrencyPage} from './currency/currency';
import {StaticAddressPage} from './addresses/static-address';
import {MasterPublicKeyPage} from './addresses/master-public-key';

const ADDRESS_TYPES = [ADDRESS_TYPE_STATIC_ADDRESS, ADDRESS_TYPE_MASTER_PUBLIC_KEY];

@Component({
    templateUrl : 'build/pages/settings/settings.html' ,
    directives : [Logo]
})
export class SettingsPage {
    
    pages = [GeneralPage, CurrencyPage, StaticAddressPage, MasterPublicKeyPage];
    addressTypesEnabled = [false, false];
    addressTypesChecked = [false, false];

    constructor(private addressService: Address, private navigation:NavController, private changeDetector: ChangeDetectorRef) {}

    ionViewDidEnter() {
        Promise.all<any>([
            this.addressService.availableAddressTypes() ,
            this.addressService.getAddressType()
        ]).then(promised => {
            if (promised[0].indexOf(ADDRESS_TYPES[0]) >= 0) {
                this.addressTypesEnabled[0] = true;
            }
            if (promised[0].indexOf(ADDRESS_TYPES[1]) >= 0) {
                this.addressTypesEnabled[1] = true;
            }
            if (promised[1] === ADDRESS_TYPES[0]) {
                this.addressTypesChecked[0] = true;
            }
            if (promised[1] === ADDRESS_TYPES[1]) {
                this.addressTypesChecked[1] = true;
            }

            this.changeDetector.detectChanges();
        });
    }

    addressTypeCheckChanged() {        
        this.changeDetector.detectChanges();
    }
    
    ionViewWillLeave() {
        let addressType = "";

        // set enabled one, as fallback
        for (let i = 0; i < this.addressTypesEnabled.length; i++) {
            if (this.addressTypesEnabled[i]) {
                addressType = ADDRESS_TYPES[i];
            }
        }

        // set checked and enabled one
        for (let i = 0; i < this.addressTypesChecked.length; i++) {
            if (this.addressTypesChecked[i] && this.addressTypesEnabled[i]) {
                addressType = ADDRESS_TYPES[i];
            }
        }

        this.addressService.setAddressType(addressType);
    }

    openPage(index:number) {
        this.navigation.push(this.pages[index]);
    }
    
}
