import PouchDB from 'pouchdb';
import {Injectable} from '@angular/core';

declare var emit:any;

@Injectable()
export class Repository {

    protected _db:any;
    protected _dbname = "bitpocket-pouchdb";

    get db() : any {
        return this._db;
    }

    addOrEditDocument(doc:any) : Promise<any> {
        if (doc._id) {
            return this.db.upsert(doc._id, (oldDoc) => {                
                return doc;
            });
        } else {
            return this.addDocument(doc);
        }        
    }

    addDocumentIfNotExists(doc:any) : Promise<any> {
        return this.db.putIfNotExists(doc);
    }

    addDocument(doc:any) : Promise<any> {
        return this.db.post(doc);
    }

    editDocument(doc:any) : Promise<any> {
        return this.db.put(doc);
    }

    removeDocument(id:string) : Promise<any> {
        return this.db.get(id).then((doc) => {
            return this.db.remove(doc);
        });
    }

    findById(id:string) : Promise<any> {
        return this.db.get(id);
    }

    findByDocumentType(doctype:string) : Promise<Array<any>> {
        return new Promise<Array<any>>((resolve, reject) => {
            this._db
                .find({
                    selector : {
                        doctype : doctype
                    }
                })
                .then((res) => {                                
                    resolve(this.prepareDocuments(res));
                }).catch(error => {
                    reject(error);
                });
        });
    }

    findDocuments(query) : Promise<Array<any>> {
        return new Promise<Array<any>> ((resolve, reject) => {
            this.db.find(query).then((res) => {                                
                    resolve(this.prepareDocuments(res));
                }).catch(error => {
                    reject(error);
                });
        });
    }

    init() : Promise<any> {
        
        this._db = new PouchDB(this._dbname);

        return Promise.all([        
            this.db.createIndex({
                index : {
                    fields : ['doctype']
                }
            }) ,
            this.db.createIndex({
                index : {
                    fields : ['timestamp','account']
                }
            }) ,
            this.db.createIndex({
                index : {
                    fields : ['timestamp','address']
                }
            })
        ]);
    }

    prepareDocuments(res) : Array<any> {
        let docs = [];

        if (res.docs && res.docs.length > 0) {
            docs = res.docs;
        }

        return docs;
    }

}