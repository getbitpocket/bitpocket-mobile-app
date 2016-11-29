import {Injectable} from '@angular/core';

@Injectable()
export class DatabaseHelper {
    
    private db: any;
    private ready: boolean = false;
    
    initDb() : Promise<boolean> {
        let dbOptions = {
            dbName : 'bitpocket' ,
            version : '1.0' ,
            comment : 'BitPocket SQL Database' ,
            sizeEstimation : 2 * 1024 * 1024
        };
        
        if (window['sqlitePlugin']) {
            
        } else {
            this.db = window['openDatabase'](dbOptions.dbName, dbOptions.version, dbOptions.comment, dbOptions.sizeEstimation);
        }        

        return new Promise<boolean>((resolve,reject) => {
            this.db.transaction(tx => {
                let sqlInit = "CREATE TABLE IF NOT EXISTS tx ( ";
                sqlInit += "timestamp INT, ";
                sqlInit += "txid TEXT, ";
                sqlInit += "currency TEXT, ";
                sqlInit += "address TEXT, ";
                sqlInit += "bitcoinAmount REAL, ";
                sqlInit += "fiatAmount REAL, ";
                sqlInit += "confirmations INT);";        
                               
                tx.executeSql(sqlInit,null,() => {
                    this.ready = true;
                    resolve(true);
                },() => {
                    this.ready = false;
                    reject(false);
                });
            });
        });
    }
    
    executeSql(statement: string, args: Array<any>) : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            if (!this.ready) {
                reject('db not ready');
            } else {
                this.db.transaction(tx => {
                    tx.executeSql(statement,args,(tx,results) => {
                        resolve(results);
                    },(tx,error) => {
                        reject(error.message);
                    });
                });
            }           
        });
    }
    
    constructor() {    
        this.ready = false;    
    }
    
}