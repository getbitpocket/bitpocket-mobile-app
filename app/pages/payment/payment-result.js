var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ionic_angular_1 = require('ionic-angular');
var amount_1 = require('../amount/amount');
var common_1 = require('angular2/common');
var PaymentResultPage = (function () {
    function PaymentResultPage(params, nav) {
        this.params = params;
        this.nav = nav;
        this.resultIcon = "";
        this.resultClass = { "transaction-success": false, "transaction-failed": true };
        this.resultText = "";
        this.success = false;
        this.success = params.data.status !== false;
        if (this.success) {
            this.resultClass["transaction-success"] = true;
            this.resultClass["transaction-failed"] = false;
            this.resultIcon = "checkmark-circle";
        }
        else {
            this.resultClass["transaction-success"] = false;
            this.resultClass["transaction-failed"] = true;
            this.resultIcon = "close-circle";
        }
        setTimeout(function () {
            nav.setRoot(amount_1.AmountPage);
        }, 5000);
    }
    PaymentResultPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/payment/payment.html',
            directives: [common_1.NgClass]
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavParams, ionic_angular_1.NavController])
    ], PaymentResultPage);
    return PaymentResultPage;
})();
exports.PaymentResultPage = PaymentResultPage;
