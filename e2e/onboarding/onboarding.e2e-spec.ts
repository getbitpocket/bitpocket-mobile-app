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
            page.setOnboardingInput('n1RGwdbNTgNL868cRFCcimdCAQMft8HZKo')
                .then(() => {
                    return page.submit();
                }).then(() => {
                    browser.sleep(4000);
                    return page.isAmountPage();
                }).then(amountPage => {
                    expect(amountPage).toBeTruthy();
                });
        });

        it('should create a dialog error message', () => {
            page.setOnboardingInput('no-valid-input')
                .then(() => {                    
                    return page.submit();
                }).then(() => {
                    return page.hasAlert();
                }).then(hasAlert => {
                    expect(hasAlert).toBeTruthy();
                });
        });    

    });

});