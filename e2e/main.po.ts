import { browser, element, by } from 'protractor';

export class MainPage {

    navigateTo(destination) {
        return browser.get(destination);
    }

    getTitle() {
        return browser.getTitle();
    }

    createAccount(input:string) {
        browser.ignoreSynchronization = true;
        browser.get('/#/onboarding');
        
        return this.setAccountCreationInput(input)
            .then(() => {
                return this.submitAccountCreation();
            }).then(() => {
                return browser.sleep(5000);
            });
    }

    setAccountCreationInput(input:string) {      
        let el = element(by.css('#account-creation-input input[type="text"]'));
        browser.sleep(500);
        return el.sendKeys(input);        
    }

    submitAccountCreation() {
        return element(by.css('button#account-creation-button')).click();
    }

}