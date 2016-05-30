import {describe, it, expect} from '@angular/core/testing';
import {DatabaseHelper} from './database-helper';
import {History} from './history/history';

describe('Database Helper', () => {
    
    let db = new DatabaseHelper();
    let history:History;
    
    beforeAll((done) => {
        db.initDb().then(value => {
            db.executeSql('DELETE FROM tx;',null);
            history = new History(db);
            done();
        });
    });
    
    it('Add Transaction to history', (done) => {
        history.addTransaction({
            txid : '123' ,
            address : 'xyz' ,
            currency : 'EUR' ,
            bitcoinAmount : 12.12345678 ,
            fiatAmount : 1200.12                      
        }).then(result => {
            expect(result).toBe(true);
            done();
        }).catch(result => {
            expect(result).toBe(true);
            done();
        });
    });
    
    it('Update Transaction history', (done) => {
        history.updateConfirmations('123', 6)
            .then(result => {
                expect(result).toBe(true);
                done();
            }).catch(result => {
                expect(result).toBe(true);
                done();
            });        
    });
    
    it('Query transaction', (done) => {
        history.queryTransactions()
            .then(transactions => {
                expect(transactions[0].address).toEqual('xyz');
                expect(transactions[0].txid).toEqual('123');
                expect(transactions[0].currency).toEqual('EUR');
                expect(transactions[0].confirmations).toEqual(6);
                expect(transactions[0].bitcoinAmount).toEqual(12.12345678);
                expect(transactions[0].fiatAmount).toEqual(1200.12);
                done();
            });
    });
        
});