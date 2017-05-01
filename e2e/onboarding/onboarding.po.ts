import { browser, element, by } from 'protractor';
import { MainPage } from "./../main.po";

export class OnboardingPage extends MainPage {

    isAmountPage() {
        return browser.getCurrentUrl().then((url:string) => {
            return /\/#\/amount$/.test(url);
        });
    }

    hasAlert() {
        return element(by.css('ion-alert')).isDisplayed();
    }
  
}