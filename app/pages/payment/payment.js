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
var address_1 = require('../../providers/address');
var payment = require('../../providers/payment/payment');
var payment_result_1 = require('./payment-result');
var bip21 = require('bip21');
var qrcode = require('qrcode-generator');
var PaymentPage = (function () {
    function PaymentPage(addressService, paymentService, params, navigation) {
        var _this = this;
        this.addressService = addressService;
        this.paymentService = paymentService;
        this.params = params;
        this.navigation = navigation;
        this.waitingTime = 0;
        this.checkInterval = 4000;
        this.timeout = 1000 * 20; // one minute, should be configurable
        this.serviceErrorCounts = 0;
        this.maxServiceErrors = 4;
        this.amount = params.data.bitcoinAmount;
        this.readableAmount = params.data.readableFiatAmount;
        this.addressService.getAddress().then(function (address) {
            var bip21uri = bip21.encode(address, {
                amount: _this.amount.toBitcoin(),
                label: 'Test Payment'
            });
            var qr = qrcode(6, 'M');
            qr.addData(bip21uri);
            qr.make();
            _this.qrImage = qr.createImgTag(5, 5);
            _this.checkPayment();
        });
    }
    PaymentPage.prototype.paymentError = function (status) {
        this.navigation.setRoot(payment_result_1.PaymentResultPage, {
            status: status
        });
    };
    PaymentPage.prototype.paymentReceived = function (tx) {
        this.navigation.setRoot(payment_result_1.PaymentResultPage, {
            status: payment.PAYMENT_STATUS_RECEIVED
        });
    };
    PaymentPage.prototype.checkPayment = function () {
        var _this = this;
        setTimeout(function () {
            _this.waitingTime += _this.checkInterval;
            if (_this.waitingTime > _this.timeout) {
                _this.paymentError(payment.PAYMENT_STATUS_TIMEOUT);
            }
            else {
                _this.paymentService
                    .checkPayment(_this.address, _this.amount)
                    .then(function (result) {
                    if (result.status === payment.PAYMENT_STATUS_RECEIVED && result.tx != '') {
                        _this.paymentReceived(result.tx);
                    }
                    else {
                        _this.paymentError(payment.PAYMENT_STATUS_ERROR);
                    }
                })
                    .catch(function (result) {
                    if (result.status === payment.PAYMENT_STATUS_NOT_RECEIVED) {
                        _this.checkPayment();
                    }
                    else if (result.status === payment.PAYMENT_STATUS_SERVICE_ERROR && _this.serviceErrorCounts <= _this.maxServiceErrors) {
                        _this.checkPayment();
                    }
                    else {
                        _this.paymentError(result.status);
                    }
                });
            }
        }, this.checkInterval);
    };
    PaymentPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/payment/payment-result.html'
        }), 
        __metadata('design:paramtypes', [address_1.Address, payment.Payment, ionic_angular_1.NavParams, ionic_angular_1.NavController])
    ], PaymentPage);
    return PaymentPage;
})();
exports.PaymentPage = PaymentPage;
