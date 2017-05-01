import { browser, element, by } from 'protractor';
import { MainPage } from './../main.po';

export class AccountPage extends MainPage {

    navigateNewAccountPage() {
        return element(by.css('ion-fab button')).click()
            .then(() => {
                return browser.sleep(500);
            });
    }

    countAccounts() {
        return element.all(by.css('.scroll-content ion-card'))
            .then(items => {
                return items.length;
            });
    }

    submitAccountData() {
        return element.all(by.css('ion-navbar .back-button'))
            .then(items => {
                return items[items.length - 1].click();
            })
            .then(() => {
                return browser.sleep(500);
            });
    }

    setAccountData(name:string, account:string) {
        return element.all(by.css('ion-list ion-item input[type="text"]'))
            .then(items => {
                browser.sleep(100);

                items[0].sendKeys(name);
                items[1].sendKeys(account);

                return browser.sleep(300);
            });
    }
  
}