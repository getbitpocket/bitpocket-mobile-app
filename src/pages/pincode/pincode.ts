import {Component} from '@angular/core';
import {ToastController, Toast, ViewController, NavParams, MenuController} from 'ionic-angular';
import * as bitcoin from 'bitcoinjs-lib';

@Component({
    templateUrl : 'pincode.html'
})
export class PincodePage {

    pin:Array<string> = ["","","",""];
    position:number = 0;
    length:number = 4;
    title:string = "Verify PIN";
    token:string = "";
    closeable: boolean = false;
    confirm: boolean = false;

    constructor(private toastController: ToastController, private viewController: ViewController, private navParams: NavParams, private menuController: MenuController) {        
        if (navParams.get('closable') === true) {
            this.closeable = true;
        }
        if (navParams.get('token')) {
            this.token = navParams.get('token');
        }
        if (navParams.get('change') === true) {
            this.confirm = true;
            this.title = "Enter new PIN";
        }                        
    }

    ionViewWillEnter() {
        this.position = 0;
        this.menuController.enable(false);
    }

    ionViewWillLeave() {
        this.menuController.enable(true);
    }

    close(success:boolean = false) {
        this.viewController.dismiss({
            success : success ,
            pin : this.hashedPin()
        });
    }

    numberInput(input:string) {
        if (this.position >= 0 && this.position < this.length) {
            this.pin[this.position] = input;
            this.position++;
        }

        let fullLength = this.position >= this.length;

        if (fullLength && this.confirm) {
            this.token = this.hashedPin();                        
            this.title = "Confirm PIN";
            this.confirm = false;
            this.reset();
        } else if (fullLength && this.verify(this.token)) {
            this.close(true);
        } else if (fullLength) {
            this.toastController.create({
                message : 'PIN mismatch, please try again!' ,
                duration : 3000
            }).present();
            this.reset();
        }
    }

    backspaceInput() {
        if (this.position > 0) {
            this.pin[this.position-1] = "";
            this.position--;
        }
    }

    reset() {
        this.position = 0;
        this.pin = ["","","",""];
    }

    hashedPin() : string {
        return bitcoin.crypto.sha256(this.pin.join('')).toString('hex');
    }

    verify(token:string) : boolean {
        return this.hashedPin() === token;
    }

}