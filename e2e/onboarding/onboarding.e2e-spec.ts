import { OnboardingPage } from './onboarding.po';
import { browser, element, by, promise } from 'protractor';

describe('OnboardingPage', function() {
    let page: OnboardingPage;

    beforeEach(() => {
        page = new OnboardingPage();
        browser.get('/#/onboarding');
    });

    it('should create a dialog error message', () => {
        page.setOnboardingInput('no-valid-address-or-key')
            .then(() => {
                return page.submit();
            }).then(() => {
                return page.hasAlert();
            }).then(hasAlert => {
                expect(hasAlert).toBeTruthy();
            });
    });

    /*
    it('should create account and navigate to amount page', () => {
        page.setOnboardingInput('n1RGwdbNTgNL868cRFCcimdCAQMft8HZKo').then(() => {
            return page.submit();
        }).then(() => {
            browser.pause();
            // expect(page.hasAlert).toBeTruthy();
        });
    });
    */

});