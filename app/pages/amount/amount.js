var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var ionic_angular_1 = require('ionic-angular');
var payment_1 = require('../payment/payment');
var config_1 = require('../../providers/config');
var currency_1 = require('../../providers/currency/currency');
var bitcoin_unit_1 = require('../../providers/currency/bitcoin-unit');
var POSITION_DIGITS = 'digits';
var POSITION_DECIMALS = 'decimals';
var AmountPage = (function () {
    function AmountPage(platform, currencyService, config, navigation, changeDetector) {
        var _this = this;
        this.platform = platform;
        this.currencyService = currencyService;
        this.config = config;
        this.navigation = navigation;
        this.changeDetector = changeDetector;
        this.entryInFiat = true;
        this.entryInBTC = false;
        this.digits = "0";
        this.decimals = "00";
        this.position = POSITION_DIGITS;
        this.index = 0;
        Promise.all([
            this.config.get('currency'),
            this.config.get('currency-format-s'),
            this.config.get('bitcoin-unit'),
        ]).then(function (settings) {
            _this.currency = settings[0];
            _this.separator = settings[1];
            _this.bitcoinUnit = settings[2];
            _this.exchangedAmount = "0" + _this.separator + "0000";
            changeDetector.detectChanges();
        });
    }
    AmountPage.prototype.changeInputCurrency = function (inputCurrency) {
        this.entryInBTC = !this.entryInBTC;
        this.entryInFiat = !this.entryInFiat;
        if (this.entryInFiat) {
            this.resetAmount();
        }
        else {
            this.digits = "0";
            this.decimals = "0000";
            this.position = POSITION_DIGITS;
            this.index = 0;
        }
    };
    AmountPage.prototype.backspaceInput = function () {
        if (this.position === POSITION_DECIMALS) {
            var emptyDecimals = "";
            for (var i = 0; i < this.decimals.length; i++) {
                emptyDecimals += "0";
            }
            if (emptyDecimals === this.decimals) {
                this.position = POSITION_DIGITS;
            }
        }
        if (this.position === POSITION_DIGITS) {
            if (this.digits.length === 1) {
                this.digits = "0";
            }
            else {
                this.digits = this.digits.slice(0, -1);
            }
        }
        else if (this.position === POSITION_DECIMALS) {
            if (this.index > 0) {
                this.decimals = this.decimals.slice(0, this.index - 1) + "0" + this.decimals.slice(this.index);
                this.index--;
            }
            else {
                this.decimals = "0" + this.decimals.slice(1);
            }
        }
        this.updateExchangedAmount();
    };
    AmountPage.prototype.switchInput = function (input) {
        if (input === POSITION_DECIMALS) {
            this.position = POSITION_DECIMALS;
        }
        else {
            this.position = POSITION_DIGITS;
        }
    };
    AmountPage.prototype.numberInput = function (input) {
        if (this.position === POSITION_DIGITS) {
            this.digitInput(input.toString());
        }
        else if (this.position === POSITION_DECIMALS) {
            this.decimalInput(input.toString());
        }
        this.updateExchangedAmount();
    };
    AmountPage.prototype.decimalInput = function (input) {
        if (this.index >= this.decimals.length) {
            this.index = this.decimals.length - 1;
        }
        this.decimals = this.decimals.slice(0, this.index) + input + this.decimals.slice(this.index + 1);
        this.index++;
    };
    AmountPage.prototype.digitInput = function (input) {
        if (this.digits.length > 0 && this.digits.charAt(0) === "0") {
            this.digits = input;
        }
        else {
            this.digits += input;
        }
    };
    AmountPage.prototype.resetAmount = function () {
        this.digits = "0";
        this.decimals = "00";
        this.position = POSITION_DIGITS;
        this.index = 0;
        this.entryInBTC = false;
        this.entryInFiat = true;
        this.updateExchangedAmount();
    };
    AmountPage.prototype.updateExchangedAmount = function () {
        var _this = this;
        var inputAmount = parseFloat(this.digits + "." + this.decimals);
        if (this.entryInBTC) {
            this.currencyService.getSelectedCurrencyRate().then(function (rate) {
                var amount = bitcoin_unit_1.BitcoinUnit.from(inputAmount, _this.bitcoinUnit).toFiat(rate);
                _this.exchangedAmount = (amount.toFixed(0) + _this.separator + amount.toFixed(2).substr(-2));
                _this.changeDetector.detectChanges();
            });
        }
        else if (this.entryInFiat) {
            this.currencyService.getSelectedCurrencyRate().then(function (rate) {
                var amount = bitcoin_unit_1.BitcoinUnit.fromFiat(inputAmount, rate).to(_this.bitcoinUnit);
                _this.exchangedAmount = amount.toFixed(0) + _this.separator + amount.toFixed(4).substr(-4);
                _this.changeDetector.detectChanges();
            });
        }
    };
    AmountPage.prototype.requestPayment = function () {
        var _this = this;
        var amount = parseFloat(this.digits + "." + this.decimals);
        if (amount <= 0) {
            return;
        }
        if (this.entryInBTC) {
            this.navigation.push(payment_1.PaymentPage, {
                bitcoinAmount: bitcoin_unit_1.BitcoinUnit.from(amount, this.bitcoinUnit)
            });
        }
        else {
            this.currencyService.getSelectedCurrencyRate().then(function (rate) {
                _this.navigation.push(payment_1.PaymentPage, {
                    bitcoinAmount: bitcoin_unit_1.BitcoinUnit.fromFiat(amount, rate),
                });
            });
        }
    };
    AmountPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/amount/amount.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Platform, currency_1.Currency, config_1.Config, ionic_angular_1.NavController, core_1.ChangeDetectorRef])
    ], AmountPage);
    return AmountPage;
})();
exports.AmountPage = AmountPage;
