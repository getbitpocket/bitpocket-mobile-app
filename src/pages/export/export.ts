import { TransactionStorageService } from './../../providers/transaction/transaction-storage-service';
import { TransactionFilter } from './../../api/transaction-filter';
import { Transaction } from './../../api/transaction';
import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { TranslateService } from '@ngx-translate/core'
import { IonicPage, NavParams, ViewController, AlertController, Platform } from 'ionic-angular';

@IonicPage({
    name : 'export' ,
    segment : 'export/:accountId'
})
@Component({
    templateUrl: 'export.html',
})
export class ExportPage {

    path:string = 'cdvfile://localhost/persistent/';

    accountId:string;
    start:string = (new Date()).toISOString();
    end:string = (new Date()).toISOString();
    incomming:boolean = true;    
    loading:boolean = false;

    constructor(
        protected platform: Platform ,
        protected alertController: AlertController , 
        protected translation: TranslateService ,
        protected file: File,
        protected fileOpener: FileOpener,
        protected transactionStorageService: TransactionStorageService ,
        protected viewController: ViewController ,
        protected navParams: NavParams) {
            this.accountId = navParams.get('accountId');
    }

    close() {
        this.viewController.dismiss();
    }
    
    export() {
        this.loading = true;

        this.transactionStorageService.retrieveTransactions({
            startTime : this.getTimestamp(this.start) ,
            endTime   : this.getTimestamp(this.end, 1)
        }).then((transactions:Transaction[]) => {
            return new Promise<Transaction[]>((resolve, reject) => {
                if (this.incomming) {
                    resolve(transactions.filter(transaction => transaction.incomming));
                } else {
                    resolve(transactions);
                }
            });            
        }).then((transactions:Transaction[]) => {
            return new Promise<string>((resolve, reject) => {
                let lines = [
                    'txid' , 'datetime', 'address', 'amount', 'currency', 'type', 'payment amount', 'payment currency', 'status'
                ].join(',') + "\n";
    
                for (let t = 0; t < transactions.length; t++) {
                    let line = [
                        transactions[t]._id,
                        (new Date(transactions[t].timestamp * 1000)).toISOString(),
                        transactions[t].address,
                        transactions[t].amount,
                        transactions[t].currency,
                        transactions[t].incomming ? 'deposit' : 'withdrawal',
                        transactions[t].paymentReferenceAmount > 0 ? transactions[t].paymentReferenceAmount : '' ,
                        transactions[t].paymentReferenceCurrency ? transactions[t].paymentReferenceCurrency : '' ,
                        transactions[t].paymentStatus ? transactions[t].paymentStatus : ''                        
                    ].join(',');
                    lines += (line + "\n");                    
                }
                
                resolve(lines);
            });            
        }).then((content:string) => {                       
            return new Promise<void> ((resolve, reject) => {
                if (this.platform.is('cordova')) {
                    this.file.createFile(this.path, this.accountId + '.csv', true)
                    .then(fileEntry => {
                        fileEntry.createWriter((writer) => {
                            writer.onwriteend = (event) => {
                                resolve();
                            };
                            writer.write(content);
                        }, error => {
                            reject(error);
                        });
                    });
                } else {
                    resolve();
                }
            });                              
        }).catch(e => {
            this.loading = false;
            console.error(e);
        }).then(() => {           
            this.loading = false;
            if (this.platform.is('cordova')) {     
                return this.fileOpener.open(this.path + this.accountId + '.csv', 'text/csv');
            }
        }).catch(e => {
            console.error(e);        
            
            Promise.all<any>([
                this.translation.get('TEXT.EXPORT_ERROR').toPromise() ,
                this.translation.get('TEXT.MISSING_CSV_APP').toPromise() ,
                this.translation.get('BUTTON.OK').toPromise()
            ]).then(promised => {
                this.alertController.create({
                    title : promised[0] ,
                    subTitle : promised[1] ,
                    buttons : [promised[2]]
                }).present();
            });     
        });
    }

    getTimestamp(dateString:string, changeDays:number = 0) {
        let date = dateString.split('-');
        return (new Date(parseInt(date[0]), parseInt(date[1])-1, parseInt(date[2])+changeDays)).getTime() / 1000;
    }
  
}
