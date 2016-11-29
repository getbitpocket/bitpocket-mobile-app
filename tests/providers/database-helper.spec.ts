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
            
            // add two dummies
            Promise.all([
                history.addTransaction({
                    txid : '667788' ,
                    address : 'alibaba' ,
                    currency : 'EUR' ,
                    bitcoinAmount : 15.232344 ,
                    fiatAmount : 500.33
                }) ,
                history.addTransaction({
                    txid : '123' ,
                    address : 'xyz' ,
                    currency : 'EUR' ,
                    bitcoinAmount : 12.12345678 ,
                    fiatAmount : 1200.12                      
                }) ,
                history.addTransaction({
                    txid : '4455566' ,
                    address : 'alibaba' ,
                    currency : 'EUR' ,
                    bitcoinAmount : 15.232344 ,
                    fiatAmount : 500.33
                })
            ]).then(() => { done(); });
        });
    });
    
    it('Add Transaction to history', (done) => {
        history.addTransaction({
            txid : 'xyz_xyz' ,
            address : 'blubbla' ,
            currency : 'USD' ,
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
        history.updateConfirmations('xyz_xyz', 6)
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
                expect(transactions[0].address).toEqual('blubbla');
                expect(transactions[0].txid).toEqual('xyz_xyz');
                expect(transactions[0].currency).toEqual('USD');
                expect(transactions[0].confirmations).toEqual(6);
                expect(transactions[0].bitcoinAmount).toEqual(12.12345678);
                expect(transactions[0].fiatAmount).toEqual(1200.12);
                done();
            });
    });

    it('Find transactions', (done) => {
        Promise.all([
            history.hasTransaction('4455566', 'alibaba') ,
            history.hasTransaction('123456', 'alibaba') ,
            history.hasTransaction('4455566', 'blubbla')
        ]).then(promises => {
            expect(promises[0]).toBe(true);
            expect(promises[1]).toBe(false);
            expect(promises[2]).toBe(false);
            done();
        });
    });

    it('good tx missing', (done) => {
        history.findNewTransaction([
            '667788' ,
            '4455566' ,
        ],'alibaba').then(index => {
            expect(index).toEqual(-1);
            done();
        });
    });

    it('Find first transaction which are not used yet', (done) => {
        history.findNewTransaction([            
            '667788' ,
            '4455566' , 
            'number_2' ,           
            'number_3'
        ],'alibaba').then(index => {
            expect(index).toEqual(2);
            done();
        });
    });

    it('query unconfirmed transactions', (done) => {
        history.findUnconfirmedTransactions().then(transactions => {
            expect(transactions.length).toEqual(3);
            done();
        });
    });
        
});