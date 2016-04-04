import {Page,NavController} from 'ionic-angular';
import {PaymentPage} from '../payment/payment';
import {Config} from '../../providers/config';
import {Currency} from '../../providers/currency/currency';

const POSITION_DIGITS = 'digits';
const POSITION_DECIMALS = 'decimals';

@Page({
    templateUrl : 'build/pages/amount/amount.html'    
})
export class AmountPage {
    
    digits:string;
    decimals:string;
    separator:string;
    currency:string;
    position:string;
    index:number;
    
    constructor(private currencyService: Currency, private navigation:NavController) {
        this.currency = Config.getItem('symbol');
        this.separator = ",";
        this.digits = "0";
        this.decimals = "00";
        
        this.position = POSITION_DIGITS;
        this.index = 0;
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
    
    requestPayment() {
        let amount = parseFloat(this.digits+"."+this.decimals);
        let readableAmount = this.currency + " " + this.digits + this.separator + this.decimals;
        
        if (amount <= 0) {            
            return;
        } else {
            amount = this.currencyService.convertToBitcoin(amount);
        }
        
        this.navigation.push(PaymentPage,{
            amount: amount ,
            readableAmount: readableAmount
        });
    }
    
}
