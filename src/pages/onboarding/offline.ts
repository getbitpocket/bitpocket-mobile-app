import {Component} from '@angular/core';
import {MenuController} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

declare var document:any;
declare var navigator:any;

@Component({
    templateUrl: 'offline.html',
})
export class OfflinePage {

    constructor(
        protected splashscreen: SplashScreen,
        protected menuController:MenuController) {
    }

    ionViewWillEnter() {
        this.menuController.enable(false);
    }

    ionViewWillLeave() {
        this.menuController.enable(true);
    }

    retry() {
        this.splashscreen.show();
        window.location.reload();
    }
}
