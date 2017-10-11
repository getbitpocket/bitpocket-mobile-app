import { Component } from '@angular/core';
import { NavController, Config } from 'ionic-angular';

@Component({
    selector: 'bitpocket-logo' ,
    template: '<img [ngClass]="modeClass" (click)="click($event)" title="BitPocket Logo" src="assets/img/bitpocket_icon_135x135.svg">'
})
export class Logo {

    modeClass:string = "";

    constructor(
        protected config:Config,
        protected navigation:NavController) {
            this.modeClass = config.get('mode', 'md');
        }

    click(ev: UIEvent) {      
        this.navigation.setRoot('amount');
    }

}