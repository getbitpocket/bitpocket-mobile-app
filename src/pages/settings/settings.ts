import {Component} from '@angular/core';
import {NavController, ModalController, Modal} from 'ionic-angular';

// providers
import {Config} from '../../providers/config';

// pages
import {GeneralPage} from './general/general';
import {CurrencyPage} from './currency/currency';
import {PincodePage} from '../pincode/pincode';

@Component({
    templateUrl : 'settings.html' ,
})
export class SettingsPage {
    
    pages = [GeneralPage, CurrencyPage];

    constructor(
        private config:Config,
        private modalController:
        ModalController,
        private navigation:NavController) {        
    }
    
    ionViewCanEnter() : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            
            // if the SettingsPage was already navigated, don't ask again for PIN
            for (let i = 0; i < this.navigation.length(); i++) {
                if (SettingsPage === this.navigation.getByIndex(i).component) {
                    resolve();
                    return;
                }
            }

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
            }).catch(e => {console.error(e);});
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
