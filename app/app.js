var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require('es6-shim');
var ionic_angular_1 = require('ionic-angular');
// Pages
var amount_1 = require('./pages/amount/amount');
var settings_1 = require('./pages/settings/settings');
var history_1 = require('./pages/history/history');
//import {PaymentPage} from './pages/payment/payment';
// Providers
var database_helper_1 = require('./providers/database-helper');
var config_1 = require('./providers/config');
var currency_1 = require('./providers/currency/currency');
var payment_1 = require('./providers/payment/payment');
var address_1 = require('./providers/address');
var history_2 = require('./providers/history/history');
// Exchange Services
var blockchain_1 = require('./providers/currency/blockchain');
// Payment Services
var electrum_1 = require('./providers/payment/electrum');
var BitpocketApp = (function () {
    function BitpocketApp(platform, app, config, currency, dbHelper, history) {
        var _this = this;
        this.app = app;
        this.config = config;
        this.currency = currency;
        this.dbHelper = dbHelper;
        this.history = history;
        this.rootPage = amount_1.AmountPage;
        this.menu = [];
        this.menu[0] = { name: 'Payment', icon: 'keypad', page: amount_1.AmountPage };
        this.menu[1] = { name: 'History', icon: 'list', page: history_1.HistoryPage };
        this.menu[2] = { name: 'Settings', icon: 'options', page: settings_1.SettingsPage };
        //this.menu[3] = { name:'Payment-Try', icon:'options', page:PaymentPage };
        platform.ready().then(function () {
            _this.initApp();
        });
    }
    BitpocketApp.prototype.updateCurrencyRate = function () {
        var _this = this;
        this.currency.updateCurrencyRate();
        setTimeout(function () {
            _this.updateCurrencyRate();
        }, 1000 * 60 * 5);
    };
    BitpocketApp.prototype.initApp = function () {
        var _this = this;
        this.dbHelper.initDb().then(function () {
            _this.history.addTransaction({
                address: '2hh23',
                txid: 'blabla',
                bitcoinAmount: 0.12345678,
                fiatAmount: 1234567.90,
                currency: 'EUR'
            });
        });
        this.updateCurrencyRate();
    };
    BitpocketApp.prototype.openPage = function (page) {
        this.app.getComponent('menu').close();
        this.app.getComponent('nav').setRoot(page);
    };
    BitpocketApp = __decorate([
        ionic_angular_1.App({
            templateUrl: 'build/app.html',
            providers: [
                history_2.History,
                currency_1.Currency,
                address_1.Address,
                payment_1.Payment,
                config_1.Config,
                database_helper_1.DatabaseHelper,
                blockchain_1.BlockchainExchangeService,
                electrum_1.ElectrumPaymentService
            ],
            config: {} // http://ionicframework.com/docs/v2/api/config/Config/
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.Platform, ionic_angular_1.IonicApp, config_1.Config, currency_1.Currency, database_helper_1.DatabaseHelper, history_2.History])
    ], BitpocketApp);
    return BitpocketApp;
})();
exports.BitpocketApp = BitpocketApp;
