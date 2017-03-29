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
        let options = {
            include_docs : true
        };

        if (doctype != "") {
            options['key'] = doctype;
        }

        return new Promise<Array<any>>((resolve, reject) => {
            this._db
                .query('index_doctype/doctype', options)
                .then((res) => {                                
                    resolve(this.prepareDocuments(res));
                }).catch(error => {
                    reject(error);
                });
        });
    }

    init() : Promise<any> {
        
        this._db = new PouchDB(this._dbname);

        return this.db.putIfNotExists("_design/index_doctype", {
            views : {
                doctype : {
                    map : (function(doc) {
                        if (doc && doc['doctype']) { emit(doc['doctype']); }
                    }).toString()
                }
            }
        });        
    }

    prepareDocuments(res) : Array<any> {
        let docs = [];

        if (res.total_rows > 0) {
            for(let row of res.rows) {
                docs.push(row.doc);
            }
        }

        return docs;
    }

}