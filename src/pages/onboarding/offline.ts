import {Component} from '@angular/core';
import {MenuController} from 'ionic-angular';

declare var document:any;
declare var navigator:any;

@Component({
    templateUrl: 'offline.html',
})
export class OfflinePage {

    text:any = {};

    constructor(private menu:MenuController) {
        this.text.no_internet = "No Internet Connection";
        this.menu.enable(false);
    }
}
