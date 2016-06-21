import {Component, ChangeDetectorRef} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {PaymentPage} from '../payment/payment';
import {Config} from '../../providers/config';
import {Currency} from '../../providers/currency/currency';
import {BitcoinUnit} from '../../providers/currency/bitcoin-unit';
import * as bitcoin from 'bitcoinjs-lib';

const POSITION_DIGITS = 'digits';
const POSITION_DECIMALS = 'decimals';
const FONT_SIZE = 4.5;

@Component({
    templateUrl : 'build/pages/amount/amount.html'
})

export class AmountPage {
    
    exchangedAmount:string; // either BTC or Fiat    
    digits:string;
    decimals:string;
    separator:string;
    
    position:string; // digits or dicimals area
    index:number; // index of writing position
    entryInFiat:boolean = true;
    entryInBTC:boolean = false;
    
    currency:string;
    bitcoinUnit:string;
    
    fontSize:number;
    
    constructor(private platform: Platform, private currencyService: Currency, private config: Config, private navigation:NavController, private changeDetector:ChangeDetectorRef) {
        this.fontSize = FONT_SIZE;
    }
    
    ionViewWillEnter() {
        Promise.all<any>([
            this.config.get('currency') ,
            this.config.get('currency-format-s') ,
            this.config.get('bitcoin-unit') ,
        ]).then(settings => {
            this.currency    = settings[0];
            this.separator   = settings[1];
            this.bitcoinUnit = settings[2];
            this.digits   = "0";
            this.decimals = "00";        
            this.position = POSITION_DIGITS;
            this.index = 0;
            this.exchangedAmount = "0"+this.separator+"00";
            this.changeDetector.detectChanges();
        });
    }
    
    changeInputCurrency(inputCurrency: string) {
        this.entryInBTC  = !this.entryInBTC;
        this.entryInFiat = !this.entryInFiat;

        if (this.entryInFiat) {
            this.resetAmount();
        } else {
            this.digits = "0";
            this.decimals = "00";
            this.position = POSITION_DIGITS;
            this.index = 0;
            this.updateExchangedAmount();
        }        
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

        let currentLenght = this.digits.length + this.decimals.length + 1;
        this.resizeFont(currentLenght);

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
        let countDigits = this.digits.length + 1;
        let countDecimals = this.decimals.length;
        //blocking overflow input
        if (this.entryInFiat) {
            if((this.position === POSITION_DIGITS && countDigits > 8) || (this.position === POSITION_DECIMALS && countDecimals > 2)){
                return null;
            }
        } else {
            switch (this.bitcoinUnit)
            {
                case'BTC':
                    if((this.position === POSITION_DIGITS && countDigits > 8) || (this.position === POSITION_DECIMALS && countDecimals > 8)){
                        return null;
                    }
                    break;
                case'mBTC':
                    if((this.position === POSITION_DIGITS && countDigits > 8) || (this.position === POSITION_DECIMALS && countDecimals > 5)){
                        return null;
                    }
                    break;
                case'bits':
                    if((this.position === POSITION_DIGITS && countDigits > 8) || (this.position === POSITION_DECIMALS && countDecimals > 2)){
                        return null;
                    }
                    break;
                default:
                    console.log('amount - numberInput - error');
            }
        }

        let currentLenght = countDigits + countDecimals;
        this.resizeFont(currentLenght);


        if (this.position === POSITION_DIGITS) {
            this.digitInput(input.toString());
        } else if (this.position === POSITION_DECIMALS) {
            this.decimalInput(input.toString());
        }

        this.updateExchangedAmount();
    }

    resizeFont(currentLenght: number){
        if(currentLenght < 5){
            this.fontSize = FONT_SIZE;
        } else if (currentLenght === 5) {
            this.fontSize = 4;
        } else if (currentLenght === 6) {
            this.fontSize = 3.75;
        } else if (currentLenght === 7) {
            this.fontSize = 3.25;
        } else if (currentLenght === 8) {
            this.fontSize = 2.75;
        }
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
        this.entryInBTC = false;
        this.entryInFiat = true;
        this.fontSize = FONT_SIZE;
        this.updateExchangedAmount();
    }
    
    updateExchangedAmount() {
        let inputAmount = parseFloat(this.digits+"."+this.decimals);
        
        if (this.entryInBTC) {
            this.currencyService.getSelectedCurrencyRate().then(rate => {
                let amount = BitcoinUnit.from(inputAmount,this.bitcoinUnit).toFiat(rate);
                this.exchangedAmount = (amount.toFixed(0) + this.separator + amount.toFixed(2).substr(-2));
                this.changeDetector.detectChanges();
            });
        } else if (this.entryInFiat) {
            this.currencyService.getSelectedCurrencyRate().then(rate => {
                let amount = BitcoinUnit.fromFiat(inputAmount,rate).to(this.bitcoinUnit);
                let decimalsCount = BitcoinUnit.decimalsCount(this.bitcoinUnit);
                this.exchangedAmount = amount.toFixed(0) + this.separator + amount.toFixed(decimalsCount).substr(-decimalsCount);
                this.changeDetector.detectChanges();
            });
        }
    }

    requestPayment() {
        let amount = parseFloat(this.digits+"."+this.decimals);                
        
        if (amount <= 0) {            
            return;
        }
        
        if (this.entryInBTC) {
            this.navigation.push(PaymentPage,{
                bitcoinAmount : BitcoinUnit.from(amount,this.bitcoinUnit) ,
                newFontSize : this.fontSize ,
                entryInFiat : this.entryInFiat
            });                   
        } else {
            this.currencyService.getSelectedCurrencyRate().then(rate => {
                this.navigation.push(PaymentPage,{
                    bitcoinAmount: BitcoinUnit.fromFiat(amount,rate) ,
                    newFontSize : this.fontSize ,
                    entryInFiat : this.entryInFiat
                });
            });
        }    
    } 
               
}
