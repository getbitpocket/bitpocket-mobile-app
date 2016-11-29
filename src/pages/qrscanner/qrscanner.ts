import {Component} from '@angular/core';
import {ToastController, Toast, ViewController, NavParams} from 'ionic-angular';

@Component({
    templateUrl : 'qrscanner.html'
})
export class QRScannerPage {

    protected light: boolean = false;
    protected frontCamera: boolean = false;
    protected scanningError: Toast;
    protected validate:any;


    constructor(private toastController: ToastController, private viewController: ViewController, navParams: NavParams) {
        this.scanningError = toastController.create({
            message : 'There was a scanning error, please try again!' ,
            duration: 3000
        });

        this.validate = navParams.get('validate');
    }

    close(data:any = null) {
        this.viewController.dismiss(data);
    }

    toggleCamera() {
        this.frontCamera = !this.frontCamera;

        if (this.frontCamera) {
            window['QRScanner'].useFrontCamera();
        } else {
            window['QRScanner'].useBackCamera();
        }
    }

    toggleLight() {
        this.light = !this.light;

        if (this.light) {
            window['QRScanner'].enableLight();
        } else {
            window['QRScanner'].disableLight();
        }
    }

    setupScanner() {
        window['QRScanner'].scan((error, text) => {      
            if (error || !this.validate(text)) {               
                this.scanningError.present();
                setTimeout(this.setupScanner, 1500);
            } else {                
                this.close({
                    'text' : this.validate(text)
                });                
            }
        });
    }

    ionViewWillEnter() {
        this.setupScanner();
        window['QRScanner'].show();
        window.document.getElementsByClassName('app-root').item(0).classList.add('hide');
    }

    ionViewWillLeave() {
        window.document.getElementsByClassName('app-root').item(0).classList.remove('hide');
        window['QRScanner'].destroy();
    }

    ionViewCanEnter() {
        if (window['QRScanner']) {
            return true;
        } else {
            return false;
        }
    }


}