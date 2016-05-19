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
var history_1 = require('../../providers/history/history');
var currency_1 = require('../../providers/currency/currency');
var config_1 = require('../../providers/config');
var currency_2 = require('../../pipes/currency');
var HistoryPage = (function () {
    function HistoryPage(history, currency, config) {
        var _this = this;
        this.history = history;
        this.currency = currency;
        this.config = config;
        Promise.all([
            history.queryTransactions(),
            config.get('currency-format-s'),
            config.get('currency-format-t')
        ]).then(function (promises) {
            // currency formatting
            _this.currencyFormatSeparator = promises[1];
            _this.currencyFormatThousandsPoint = promises[2];
            // transactions
            for (var _i = 0, _a = promises[0]; _i < _a.length; _i++) {
                var transaction = _a[_i];
                transaction['symbol'] = _this.currency.getCurrencySymbol(transaction.currency);
            }
            _this.transactionList = promises[0];
        });
    }
    HistoryPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/history/history.html',
            pipes: [currency_2.CurrencyPipe]
        }), 
        __metadata('design:paramtypes', [history_1.History, currency_1.Currency, config_1.Config])
    ], HistoryPage);
    return HistoryPage;
})();
exports.HistoryPage = HistoryPage;
