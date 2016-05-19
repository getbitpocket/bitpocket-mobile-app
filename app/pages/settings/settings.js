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
// pages
var currency_1 = require('./currency/currency');
var static_1 = require('./addresses/static');
var general_1 = require('./general/general');
var SettingsPage = (function () {
    function SettingsPage(navigation) {
        this.navigation = navigation;
        this.settings = [];
        this.settings[0] = { name: 'General Settings', description: 'Formatting', page: general_1.GeneralPage };
        this.settings[1] = { name: 'Currency', description: 'Select the currency you want to specify payment amounts', page: currency_1.CurrencyPage };
        this.settings[2] = { name: 'Static address', description: 'Static address to receive payments', page: static_1.StaticAddressPage };
    }
    SettingsPage.prototype.openPage = function (page) {
        this.navigation.push(page);
    };
    SettingsPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/settings/settings.html'
        }), 
        __metadata('design:paramtypes', [ionic_angular_1.NavController])
    ], SettingsPage);
    return SettingsPage;
})();
exports.SettingsPage = SettingsPage;
