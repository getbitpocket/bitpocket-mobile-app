import {Page,NavParams,NavController} from 'ionic-angular';
import {AmountPage} from '../amount/amount';

@Page({
    templateUrl : 'build/pages/payment/payment.html'    
})
export class PaymentResultPage {
    
    resultIcon : string = "";
    resultClass = { "transaction-success" : false , "transaction-failed" : true };
    resultText : string = "";
    success : boolean = false;
    
    constructor(private params: NavParams, private nav: NavController) {
        this.success = params.data.status !== false;
        
        if (this.success) {
            this.resultClass["transaction-success" ] = true;
            this.resultClass["transaction-failed" ] = false;
            this.resultIcon = "checkmark-circle";
        } else {
            this.resultClass["transaction-success" ] = false;
            this.resultClass["transaction-failed" ] = true;
            this.resultIcon = "close-circle";
        }             
        
        setTimeout(() => {
            nav.setRoot(AmountPage);
        }, 5000);                           
    }
    
}