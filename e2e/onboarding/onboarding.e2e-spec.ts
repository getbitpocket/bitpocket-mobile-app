import { OnboardingPage } from './onboarding.po';
import { browser, element, by, promise } from 'protractor';

describe('Onboarding', function() {
    let page: OnboardingPage;

    beforeEach(() => {
        page = new OnboardingPage();
    });

    describe('Create Account', () => {

        beforeEach(() => {
            browser.get('/#/onboarding');
            browser.ignoreSynchronization = true;
        });

        it('should create account and navigate to amount page', () => {
            page.setAccountCreationInput('n1RGwdbNTgNL868cRFCcimdCAQMft8HZKo')
                .then(() => {
                    return page.submitAccountCreation();
                }).then(() => {
                    browser.sleep(4000);
                    return page.isAmountPage();
                }).then(amountPage => {
                    expect(amountPage).toBeTruthy();
                });
        });

        it('should create a dialog error message', () => {
            page.setAccountCreationInput('no-valid-input')
                .then(() => {                    
                    return page.submitAccountCreation();
                }).then(() => {
                    return page.hasAlert();
                }).then(hasAlert => {
                    expect(hasAlert).toBeTruthy();
                });
        });    

    });

});