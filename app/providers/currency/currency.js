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
var config_1 = require('../config');
var blockchain_1 = require('./blockchain');
var bitcoin_unit_1 = require('./bitcoin-unit');
var EXCHANGE_SERVICES = [
    { code: 'blockchain', name: 'Blockchain.info' },
    { code: 'bitcoinaverage', name: 'BitcoinAverage' }
];
var CURRENCY_SYMBOLS = {
    'USD': '$',
    'EUR': '€',
    'CRC': '₡',
    'GBP': '£',
    'ILS': '₪',
    'INR': '₹',
    'JPY': '¥',
    'KRW': '₩',
    'NGN': '₦',
    'PHP': '₱',
    'PLN': 'zł',
    'PYG': '₲',
    'THB': '฿',
    'UAH': '₴',
    'VND': '₫',
    'BTC': 'Ƀ'
};
var Currency = (function () {
    function Currency(config, injector) {
        this.config = config;
        this.injector = injector;
        this.config.initialize('exchange', 'blockchain');
        this.config.initialize('currency', 'EUR');
    }
    Currency.prototype.getAvailabeServices = function () {
        return EXCHANGE_SERVICES;
    };
    Currency.prototype.getSelectedService = function () {
        return this.config.get('exchange');
    };
    Currency.prototype.getExchangeService = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getSelectedService().then(function (exchange) {
                if (exchange === 'blockchain') {
                    resolve(_this.injector.get(blockchain_1.BlockchainExchangeService));
                }
                else {
                    resolve(_this.injector.get(blockchain_1.BlockchainExchangeService));
                }
            });
        });
    };
    Currency.prototype.getSelectedCurrency = function () {
        return this.config.get('currency');
    };
    Currency.prototype.getAvailableCurrencies = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.getExchangeService().then(function (exchangeService) {
                resolve(exchangeService.getAvailableCurrencies());
            });
        });
    };
    Currency.prototype.setSelectedService = function (code) {
        this.config.set('exchange', code);
        return this;
    };
    Currency.prototype.setSelectedCurrency = function (code) {
        var _this = this;
        this.config.set('currency', code).then(function () {
            _this.updateCurrencyRate();
        });
        return this;
    };
    Currency.prototype.updateCurrencyRate = function () {
        var _this = this;
        Promise.all([
            this.getExchangeService(),
            this.getSelectedCurrency()
        ]).then(function (promisedArray) {
            return promisedArray[0].getExchangeRate(promisedArray[1]);
        }).then(function (data) {
            _this.config.set('symbol', data.symbol);
            _this.config.set('rate', data.rate.toString());
        });
        return this;
    };
    Currency.prototype.getCurrencySymbol = function (currency) {
        if (CURRENCY_SYMBOLS.hasOwnProperty(currency)) {
            return CURRENCY_SYMBOLS[currency];
        }
        else {
            return currency;
        }
    };
    Currency.prototype.convertToBitcoin = function (amount) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.config.get('rate').then(function (rate) {
                resolve(bitcoin_unit_1.BitcoinUnit.fromFiat(amount, rate));
            });
        });
    };
    Currency = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [config_1.Config, core_1.Injector])
    ], Currency);
    return Currency;
})();
exports.Currency = Currency;
