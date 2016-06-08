import {Page,NavController,MenuController} from 'ionic-angular';

declare var document:any;
declare var navigator:any;

@Page({
    templateUrl: 'build/pages/onboarding/offline.html',
})
export class OfflinePage {

    text:any = {};

    constructor(private menu:MenuController) {
        this.text.no_internet = "No Internet Connection";
        this.menu.enable(false);
        /*
        if (this.language.hasText('no_internet')) {
            this.text.no_internet = this.language.getText('no_internet');
        }
        */
    }
}
