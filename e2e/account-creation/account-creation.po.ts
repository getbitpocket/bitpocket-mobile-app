import { browser, element, by } from 'protractor';
import { MainPage } from "./../main.po";

export class OnboardingPage extends MainPage {

    isAmountPage() {
        return browser.getCurrentUrl().then((url:string) => {
            return /\/#\/amount$/.test(url);
        });
    }

    hasAlert() {
        browser.sleep(1000)
            .then(() => {
                return element(by.css('button[ion-button="alert-button"]')).click();
            });        
    }
  
}