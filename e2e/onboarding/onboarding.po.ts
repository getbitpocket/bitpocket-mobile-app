import { browser, element, by } from 'protractor';

export class OnboardingPage {

    navigateTo(destination) {
        return browser.get(destination);
    }

    getTitle() {
        return browser.getTitle();
    }

    setOnboardingInput(input:string) {      
        let el = element(by.css('#account-creation-input input[type="text"]'));
        browser.sleep(100);
        return el.sendKeys(input);        
    }

    submit() {
        return element(by.css('button#account-creation-button')).click();
    }

    isAmountPage() {
        return browser.getCurrentUrl().then((url:string) => {
            console.log(url);
            return /\/#\/amount$/.test(url);
        });
    }

    hasAlert() {
        return element(by.css('ion-alert')).isDisplayed();
    }
  
}