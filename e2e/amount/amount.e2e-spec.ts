import { AmountPage } from './amount.po';
import { browser, element, by, promise } from 'protractor';

describe('Amount', function() {
    let page: AmountPage;

    beforeEach(() => {
        browser.restartSync();
        page = new AmountPage();
    });

    describe('Amount', () => {

        beforeEach(() => {
            browser.ignoreSynchronization = true;
            page.createAccount('n1RGwdbNTgNL868cRFCcimdCAQMft8HZKo')
                .then(() => {                    
                    browser.get('/#/amount');   
                });         
        });

        it('should set amount correctly', () => {
            browser.sleep(1000);

            page.clickButton(0)
                .then(() => {
                    return page.clickButton(1);
                }).then(() => {
                    return page.clickButton(2);
                }).then(() => {
                    return page.clickButton(9);
                }).then(() => {
                    return page.clickButton(6);
                }).then(() => {
                    return page.getActiveAmount();
                }).then(amount => {
                    expect(amount).toMatch(/123(,|\.)70/);
                });                
        });

    });

});