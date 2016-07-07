import {describe, it, expect, beforeEachProviders, inject, beforeEach} from '@angular/core/testing';
import {provide} from '@angular/core';
import {Payment} from './payment';
import {History} from '../history/history';
import {Address} from '../address';
import {BitcoinUnit} from '../currency/bitcoin-unit';
import {Transaction} from '../../api/transaction';
import * as payment from '../../api/payment-service';

// TODO: use mocking framework or jasmine mocks

class MockPaymentService implements payment.PaymentService {
    findTransactions(address: string, amount: BitcoinUnit) : Promise<Array<string>> {
        return new Promise<Array<string>>((resolve, reject) => {
            
            if (address === 'test-address-1') {
                reject();
            } else if (address === 'test-address-2') {
                resolve([
                    'txid-test-2-1' ,
                    'txid-test-2-2' ,
                    'txid-test-2-3'
                ]);
            } else if (address === 'test-address-3') {
                resolve([
                    'txid-test-3-1' ,
                    'txid-test-3-2' ,
                    'txid-test-3-3'
                ]);
            } else if (address === 'test-address-4') {
                resolve([]);
            }

        });
    }

    updateConfirmations(transactions: Array<Transaction>) : Promise<Array<Transaction>> {
        return new Promise<Array<Transaction>>((resolve, reject) => {
        });
    }
}

describe('Payment Provider', () => {
    
    let paymentService: Payment;
    let paymentServiceMock: payment.PaymentService;    

    let historyMock = {
        findNewTransaction : (txids: Array<string>, address: string, currentIndex: number = 0) : Promise<number> => {
            return new Promise<number>((resolve, reject) => {
                if (address === 'test-address-2') {
                    resolve(-1);
                } else if (address === 'test-address-3') {
                    resolve(1);
                } else if (address === 'test-address-4') {
                    resolve(-1);
                }
            });
        },
        addTransaction : null
    }

    let addressSpy = {
        addressPostProcess : null
    };

    beforeEachProviders(() => [
        Payment,
        provide(History, {
            useFactory : () => {
                return historyMock;
            }
        }),
        provide(Address, {
            useFactory : () => {
                return addressSpy;
            }
        })
    ]);

    beforeEach(inject([Payment], (_payment) => {        
        paymentServiceMock = new MockPaymentService();        
        spyOn(paymentServiceMock, 'findTransactions').and.callThrough();
        spyOn(paymentServiceMock, 'updateConfirmations').and.callThrough();
        spyOn(addressSpy,         'addressPostProcess');
        spyOn(historyMock,        'findNewTransaction').and.callThrough();
        spyOn(historyMock,        'addTransaction');
        
        paymentService = _payment;
        paymentService.setPaymentService(paymentServiceMock);
        paymentService.setMaxWaitingTime(500);
        paymentService.setCheckInterval(100);        
    }));

    it('Payment Not received, as no transactions found', (done) => {             
        let checkTimes = 0;

        paymentService.startPaymentStatusCheck({
            currency : 'EUR' ,
            address : 'test-address-1' ,
            fiatAmount : 100 ,
            bitcoinAmount : 0.5
        });

        paymentService.on('payment-status:'+payment.PAYMENT_STATUS_NOT_RECEIVED, (paymentRequest) => {
            expect(paymentRequest.address).toEqual('test-address-1');
            checkTimes++;

            if (checkTimes >= 4) {
                expect(paymentServiceMock.findTransactions).toHaveBeenCalled();
                // expect(historyMock.findNewTransaction).not.toHaveBeenCalled();
                done();
            }
            
        });
    });

    it('Payment Not received, as all transactions are already in history', (done) => {    
        let checkTimes = 0;        

        paymentService.startPaymentStatusCheck({
            currency : 'EUR' ,
            address : 'test-address-2' ,
            fiatAmount : 100 ,
            bitcoinAmount : 0.5
        });

        paymentService.on('payment-status:'+payment.PAYMENT_STATUS_NOT_RECEIVED, (paymentRequest) => {
            expect(paymentRequest.address).toEqual('test-address-2');
            checkTimes++;
            
            if (checkTimes >= 4) {
                expect(paymentServiceMock.findTransactions).toHaveBeenCalled();
                // expect(historyMock.findNewTransaction).toHaveBeenCalled();
                done();
            }
        });
    });

    it('Payment received, as there is one transaction not yet in history', (done) => {        
        paymentService.startPaymentStatusCheck({
            currency : 'EUR' ,
            address : 'test-address-3' ,
            fiatAmount : 100 ,
            bitcoinAmount : 0.5
        });

        paymentService.on('payment-status:'+payment.PAYMENT_STATUS_RECEIVED, (paymentRequest) => {
            expect(historyMock.addTransaction).toHaveBeenCalledTimes(1);
            expect(addressSpy.addressPostProcess).toHaveBeenCalledTimes(1);
            expect(paymentRequest.address).toEqual('test-address-3');
            done();
        });
    });

    it('Payment check timeout', (done) => {        
        paymentService.startPaymentStatusCheck({
            currency : 'EUR' ,
            address : 'test-address-4' ,
            fiatAmount : 100 ,
            bitcoinAmount : 0.5
        });

        paymentService.on('payment-status:'+payment.PAYMENT_STATUS_TIMEOUT, (paymentRequest) => {
            expect(paymentServiceMock.findTransactions).toHaveBeenCalledTimes(5);
            // expect(historyMock.findNewTransaction).not.toHaveBeenCalled();
            expect(paymentRequest.address).toEqual('test-address-4');
            done();
        });
    });

});
