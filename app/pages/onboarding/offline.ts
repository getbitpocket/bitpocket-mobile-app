import {Component} from '@angular/core';
import {Page,NavController,MenuController} from 'ionic-angular';

declare var document:any;
declare var navigator:any;

@Component({
    templateUrl: 'build/pages/onboarding/offline.html',
})
export class OfflinePage {

    text:any = {};

    constructor(private menu:MenuController) {
        this.text.no_internet = "No Internet Connection";
        this.menu.enable(false);
    }
}
