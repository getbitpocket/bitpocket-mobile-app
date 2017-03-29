import {Component} from '@angular/core';
import {NavController, LoadingController, Platform, Loading} from 'ionic-angular';
import {PaymentPage} from '../payment/payment';
import {Config} from '../../providers/config';
import {Currency} from '../../providers/currency/currency';
import {BitcoinUnit} from '../../providers/currency/bitcoin-unit';
import {TranslateService} from '@ngx-translate/core'

const POSITION_DIGITS = 'digits';
const POSITION_DECIMALS = 'decimals';

@Component({
    templateUrl : 'amount.html'
})
export class AmountPage {

    loader: Loading;
    exchangedAmount:string; // either BTC or Fiat    
    digits:string   = "0";
    decimals:string = "00";
    separator:string = ".";
 
    position:string; // digits or decimals area
    index:number; // index of writing position
    entryInFiat:boolean = true;
    entryInBTC:boolean = false;
        
    currency:string;
    bitcoinUnit:string;
            
    constructor(
        private translation: TranslateService,
        private platform: Platform,
        private currencyService: Currency,
        private config: Config,
        private navigation:NavController,
        private loading: LoadingController) {                                   
    }

    startLoading() {
        this.loader = this.loading.create({
            content : "Loading Currencies..."
        });
        this.loader.present();
    }

    stopLoading() {
        this.loader.dismiss();
    }

    ionViewWillEnter() {
        Promise.all<any>([
            this.config.get('currency') ,
            this.translation.get('FORMAT.CURRENCY_S').toPromise() ,
            this.config.get('bitcoin-unit') ,
            this.currencyService.getSelectedCurrencyRate()
        ]).then(settings => {
            this.currency    = settings[0];
            this.separator   = settings[1];
            this.bitcoinUnit = settings[2];            

            if (settings[3] < 0) {
                this.startLoading();
                this.currencyService.updateCurrencyRate().then(() => {
                    this.stopLoading();
                    this.resetAmount();
                });
            } else {
                this.resetAmount();
            }        
        });
    }

    changeInputCurrency(inputCurrency: string) {
        this.entryInBTC  = !this.entryInBTC;
        this.entryInFiat = !this.entryInFiat;
        this.resetAmount(); 
    }

    backspaceInput() {
        if (this.position === POSITION_DECIMALS) {
            let emptyDecimals = "";
            for (let i = 0; i < this.decimals.length; i++) {
                emptyDecimals += "0";
            }

            if (emptyDecimals === this.decimals) {
                this.position = POSITION_DIGITS;
            }
        }

        if (this.position === POSITION_DIGITS) {
            if (this.digits.length === 1) {
                this.digits = "0";
            } else {
                this.digits = this.digits.slice(0,-1);
            }
        } else if (this.position === POSITION_DECIMALS) {
            if (this.index > 0) {
                this.decimals = this.decimals.slice(0,this.index-1) + "0" + this.decimals.slice(this.index);
                this.index--;
            } else {
                this.decimals = "0" + this.decimals.slice(1);
            }
        }

        this.updateExchangedAmount();
    }

    switchInput(input:string) {
        if (input === POSITION_DECIMALS) {
            this.position = POSITION_DECIMALS;
        } else {
            this.position = POSITION_DIGITS;
        }
    }

    numberInput(input:string) {        
        if (this.position === POSITION_DIGITS) {
            this.digitInput(input.toString());
        } else if (this.position === POSITION_DECIMALS) {
            this.decimalInput(input.toString());
        }

        this.updateExchangedAmount();
    }

    decimalInput(input:string) {
        if (this.index >= this.decimals.length) {
            this.index = this.decimals.length-1;
        }

        this.decimals = this.decimals.slice(0,this.index) + input + this.decimals.slice(this.index+1);
        this.index++;
    }

    digitInput(input:string) {
        if (this.digits.length > 0 && this.digits.charAt(0) === "0") {
            this.digits = input;
        } else {
            this.digits += input;
        }
    }

    resetAmount() {
        this.digits = "0";
        this.decimals = "00";
        this.position = POSITION_DIGITS;
        this.index = 0;        
        this.updateExchangedAmount();
    }
    
    updateExchangedAmount() {
        let inputAmount = parseFloat(this.digits+"."+this.decimals);

        this.currencyService.getSelectedCurrencyRate().then(rate => {
            if (this.entryInBTC) {
                let amount = BitcoinUnit.from(inputAmount,this.bitcoinUnit).toFiat(rate);
                this.exchangedAmount = this.currencyService.formatNumber(amount, this.separator, 2);                
            } else if (this.entryInFiat) {
                let amount = BitcoinUnit.fromFiat(inputAmount,rate).to(this.bitcoinUnit);
                let decimalsCount = BitcoinUnit.decimalsCount(this.bitcoinUnit);
                this.exchangedAmount = this.currencyService.formatNumber(amount, this.separator, decimalsCount, 2);
            }            
        });        
    }

    requestPayment() {
        let amount = parseFloat(this.digits+"."+this.decimals);                
        
        if (amount <= 0) {            
            return;
        }
        
        if (this.entryInBTC) {
            this.navigation.push(PaymentPage,{
                amount: BitcoinUnit.from(amount,this.bitcoinUnit)
            });                   
        } else {
            this.currencyService.getSelectedCurrencyRate().then(rate => {
                this.navigation.push(PaymentPage,{
                    amount: BitcoinUnit.fromFiat(amount,rate) ,                
                });
            });
        }    
    } 
               
}
