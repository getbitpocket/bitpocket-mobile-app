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
var config_1 = require('../../../providers/config');
// t = thousands point
// s = separator
var CURRENCY_FORMATS = {
    'de': {
        t: '.',
        s: ','
    },
    'us': {
        t: ',',
        s: '.'
    }
};
var GeneralPage = (function () {
    function GeneralPage(config) {
        var _this = this;
        this.config = config;
        Promise.all([
            this.config.get('currency-format'),
        ]).then(function (promised) {
            _this.selectedFormat = promised[0];
        });
    }
    GeneralPage.prototype.formatChanged = function () {
        this.config.set('currency-format', this.selectedFormat);
        this.config.set('currency-format-t', CURRENCY_FORMATS[this.selectedFormat].t);
        this.config.set('currency-format-s', CURRENCY_FORMATS[this.selectedFormat].s);
    };
    GeneralPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/settings/general/general.html'
        }), 
        __metadata('design:paramtypes', [config_1.Config])
    ], GeneralPage);
    return GeneralPage;
})();
exports.GeneralPage = GeneralPage;
