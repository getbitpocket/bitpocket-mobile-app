import { browser, element, by } from 'protractor';
import { MainPage } from './../main.po';

export class AmountPage extends MainPage {

    /**
     * 
     * Click on of the 14 buttons
     * index: 0 - 13
     * @param buttonIndex 
     */
    clickButton(buttonIndex:number = 0) {
        return element.all(by.css('.numpad button'))
            .then(items => {
                if (items.length > buttonIndex) {
                    return items[buttonIndex].click();
                }
            })
    }

    getActiveAmount() {
        return element(by.css('.payment-amount .active [dynamicfontsize]')).getText();
    }
  
}