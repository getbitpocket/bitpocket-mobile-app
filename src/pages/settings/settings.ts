import { Component } from '@angular/core';
import { NavController, ModalController, Modal, IonicPage } from 'ionic-angular';
import { Config } from '../../providers/index';

@IonicPage({
    name : 'settings'
})
@Component({
    templateUrl : 'settings.html' ,
})
export class SettingsPage {
    
    pages = ['general', 'currency'];

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

            this.config.get(Config.CONFIG_KEY_PIN).then(value => {
                if (value === '') {
                    resolve();
                } else {                    
                    let modal:Modal = this.modalController.create('pincode', { token : value, closable : true });

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
        let modal:Modal = this.modalController.create('pincode', { change : true });
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
