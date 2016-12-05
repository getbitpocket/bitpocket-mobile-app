import {Component} from '@angular/core';
import {MenuController} from 'ionic-angular';
import {Splashscreen} from 'ionic-native';

declare var document:any;
declare var navigator:any;

@Component({
    templateUrl: 'offline.html',
})
export class OfflinePage {

    text:any = {};

    constructor(private menuController:MenuController) {
        this.text.no_internet = "No Internet Connection";
    }

    ionViewWillEnter() {
        this.menuController.enable(false);
    }

    ionViewWillLeave() {
        this.menuController.enable(true);
    }

    retry() {
        Splashscreen.show();
        window.location.reload();
    }
}
