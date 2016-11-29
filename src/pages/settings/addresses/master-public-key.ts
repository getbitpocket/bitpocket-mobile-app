import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {QRScanner} from '../../../providers/qrscanner/qrscanner';
import {Config} from '../../../providers/config';
import {Address} from '../../../providers/address';
import * as bitcoin from 'bitcoinjs-lib';

@Component({
    templateUrl : 'master-public-key.html' 
})
export class MasterPublicKeyPage {

    masterPublicKey: string = "";
    index: number = 1;

    constructor(private qrscanner: QRScanner, private config: Config, private nav:NavController) {       
        Promise.all<any>([
            this.config.get('master-public-key') ,
            this.config.get('master-public-key-index')
        ]).then(promised => {            
            this.masterPublicKey = promised[0];
            this.index = promised[1];
        });
    }

    inputChanged() {
        if (Address.checkAddressInput(this.masterPublicKey, 'master-public-key')) {
            this.config.set('master-public-key', this.masterPublicKey);
        }
        if (this.index > 0) {
            this.config.set('master-public-key-index', this.index);
        }
    }

    scan() {
        this.qrscanner.scan(text => {
            try {
                return bitcoin.HDNode.fromBase58(text).toBase58();                
            } catch(e) {
                return false;
            }
        }).then(text => {
            this.masterPublicKey = text;
        });
    }

    ionViewWillLeave() {
        // TODO: Alert message if not a valid address
        this.inputChanged();
    }  

}