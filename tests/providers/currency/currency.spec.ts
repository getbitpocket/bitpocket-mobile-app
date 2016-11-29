import {describe, it, expect, beforeEachProviders, inject, beforeEach} from '@angular/core/testing';
import {provide, Type, Injector} from '@angular/core';
import {Currency} from './currency';
import {Config} from '../config';


describe('Currency Provider', () => {

    let currencyService: Currency = new Currency(null,null);

    it('format Currency', () => {        
        expect(currencyService.formatNumber(10,',')).toEqual('10,00');
        expect(currencyService.formatNumber(10.2501,',',6,2)).toEqual('10,2501');
        expect(currencyService.formatNumber(10.250,',',3,3)).toEqual('10,250');
    });

});
