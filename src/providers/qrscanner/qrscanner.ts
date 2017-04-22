import {Injectable} from '@angular/core';
import {ModalController, Modal} from 'ionic-angular';
import {QRScannerPage} from '../../pages/qrscanner/qrscanner';

@Injectable()
export class QRScanner {
    
    protected modal:Modal;

    constructor(protected modalController:ModalController) {          
    }

    scan(validate: (text:any) => any = (text) => { return text; }) : Promise<any> { 
        this.modal = this.modalController.create(QRScannerPage, { validate: validate});
        this.modal.present();

        return new Promise<any>((resolve, reject) => {
            this.modal.onDidDismiss(data => {
                if (data && data.text) {
                    resolve(data.text);
                } else {
                    reject();
                }
            });
        });                        
    }

}