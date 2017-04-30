import { browser, element, by } from 'protractor';

export class OnboardingPage {

    navigateTo(destination) {
        return browser.get(destination);
    }

    getTitle() {
        return browser.getTitle();
    }

    setOnboardingInput(input:string) {      
        return element(by.css('.text-input')).sendKeys(input);
    }

    submit() {
        return element(by.css('.button-large')).click();
    }

    hasAlert() {
        return element(by.css('ion-alert')).isDisplayed();
    }
  
}