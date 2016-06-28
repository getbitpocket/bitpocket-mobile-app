import {Component, HostListener} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AmountPage} from '../pages/amount/amount';

@Component({
    selector: 'bitpocket-logo' ,
    template: '<img title="BitPocket Logo" src="img/bitpocket_icon_135x135.svg">'
})
export class Logo {

    constructor(private navigation:NavController) {}

    @HostListener('click', ['$event'])
    click(ev: UIEvent) {        
        ev.preventDefault();
        ev.stopPropagation();
        this.navigation.setRoot(AmountPage);
    }

}