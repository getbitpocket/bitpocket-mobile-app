import { AccountPage } from './account.po';
import { browser, element, by, promise } from 'protractor';

describe('Account', function() {
    let page: AccountPage;

    beforeEach(() => {
        page = new AccountPage();
    });

    describe('Account Management', () => {

        beforeEach(() => {
            page.createAccount('n1RGwdbNTgNL868cRFCcimdCAQMft8HZKo')
                .then(() => {
                    browser.ignoreSynchronization = true;
                    browser.get('/#/account');   
                });
        });

        it('should create additional account', () => {
            page.navigateNewAccountPage()
                .then(() => {
                    return page.setAccountData('testnet 2', 'mqdquKXQPfyn4Qzu2HHPgULTX5ay8g4wPg');
                }).then(() => {
                    return page.submitAccountData();
                }).then(() => {
                    return page.countAccounts();                    
                }).then(count => {
                    expect(count).toEqual(2);
                });                   
        });

    });

});