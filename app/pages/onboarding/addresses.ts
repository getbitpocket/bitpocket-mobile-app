import {Component, ChangeDetectorRef} from '@angular/core';
import {Page,NavController,Alert} from 'ionic-angular';
import {BarcodeScanner} from 'ionic-native';
import {Config} from '../../providers/config';
import * as bitcoin from 'bitcoinjs-lib';

const ADDRESS_TYPE_MASTER = 'master-public-key';
const ADDRESS_TYPE_STATIC = 'static'

@Component({
    templateUrl : 'build/pages/onboarding/addresses.html'
})
export class AddressesPage {
    
    addresstype: string = "";
    addresstypename: string = ""
    transactionKey: string = "";
    masterPublicKey: string = "";
    index: number = 1;
    buttonDisabled: any = null;
    active: boolean = false;
    showInput: boolean = false;

    constructor(private config: Config, private nav:NavController, private changeDetector: ChangeDetectorRef) {
        Promise.all<any>([
            this.config.get('address-type') ,
            this.config.get('master-public-key') ,
            this.config.get('master-public-key-index'),
            this.config.get('static-address')
        ]).then(promised => {
            if (promised[0] === ADDRESS_TYPE_MASTER) {
                this.active = true;
            }
            this.masterPublicKey = promised[1];
            this.index = promised[2];
            console.log(promised[0]+" "+promised[1]+" "+promised[2]+" "+promised[3]);
        });
    }

    setaddresstype(){
        this.showInput = true;
        console.log(this.addresstype);
        switch (this.addresstype){
            case "static":
                this.addresstypename = "Static Address";
                break;
            case "master":
                this.addresstypename = "Master Public Key";
                break;
            default:
                this.showInput = false;
        }
    }

    activationChanged() {
        if (!this.active) {
            this.config.set('address-type', ADDRESS_TYPE_MASTER);
        }
    }

    keyChanged() {
        this.config.set('master-public-key', this.masterPublicKey);
        if(bitcoin.HDNode.fromBase58(this.masterPublicKey).toBase58()){
            this.buttonDisabled = true;
        }
    }

    indexChanged() {
        this.config.set('master-public-key-index', this.index);
    }

    scan() {
        let alert:Alert;

        BarcodeScanner.scan().then((barcodeData) => {
            try {
                this.masterPublicKey = bitcoin.HDNode.fromBase58(barcodeData.text).toBase58();
                this.keyChanged();
                this.changeDetector.detectChanges();
            } catch(e) {
                this.nav.present(alert);
            }
        }, (error) => {
            console.error(error);
            this.nav.present(alert);
        });

        alert = Alert.create({
            title: 'Scanning Error',
            subTitle: 'There was a scanning error, please try again!',
            buttons: ['Ok']
        });
    }

}