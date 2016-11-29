import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, ModalController, Modal} from 'ionic-angular';
import {Address, ADDRESS_TYPE_STATIC_ADDRESS, ADDRESS_TYPE_MASTER_PUBLIC_KEY} from '../../providers/address';

// providers
import {Config} from '../../providers/config';

// pages
import {GeneralPage} from './general/general';
import {CurrencyPage} from './currency/currency';
import {StaticAddressPage} from './addresses/static-address';
import {MasterPublicKeyPage} from './addresses/master-public-key';
import {PincodePage} from '../pincode/pincode';

const ADDRESS_TYPES = [ADDRESS_TYPE_STATIC_ADDRESS, ADDRESS_TYPE_MASTER_PUBLIC_KEY];

@Component({
    templateUrl : 'settings.html' ,
})
export class SettingsPage {
    
    pages = [GeneralPage, CurrencyPage, StaticAddressPage, MasterPublicKeyPage];
    addressTypesEnabled = [false, false];
    addressTypesChecked = [false, false];

    constructor(private config:Config, private modalController: ModalController, private addressService: Address, private navigation:NavController, private changeDetector: ChangeDetectorRef) {        
    }

    ionViewWillEnter() {
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

    ionViewCanEnter() : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.config.get('pin').then(value => {
                if (value === '') {
                    resolve();
                } else {                    
                    let modal:Modal = this.modalController.create(PincodePage, { token : value, closable : true });

                    modal.present();
                    modal.onDidDismiss(data => {
                        if (data && data.success) {
                            resolve();
                        } else {
                            reject();
                        }
                    })
                }
            });
        });
    }

    changePin() {
        let modal:Modal = this.modalController.create(PincodePage, { change : true });
        modal.present();

        modal.onDidDismiss(data => {
            if (data && data.success) {
                this.config.set(Config.CONFIG_KEY_PIN, data.pin);
            }            
        });

    }

    openPage(index:number) {
        this.navigation.push(this.pages[index]);
    }
    
}
