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
var ionic_native_1 = require('ionic-native');
var bip21 = require('bip21');
var config_1 = require('../../../providers/config');
var ADDRESS_TYPE = 'static';
var StaticAddressPage = (function () {
    function StaticAddressPage(config, nav) {
        var _this = this;
        this.config = config;
        this.nav = nav;
        this.address = "";
        this.active = false;
        Promise.all([
            this.config.get('address-type'),
            this.config.get('static-address')
        ]).then(function (promised) {
            if (promised[0] === ADDRESS_TYPE) {
                _this.active = true;
            }
            _this.address = promised[1];
        });
    }
    StaticAddressPage.prototype.activationChanged = function () {
        if (!this.active) {
            this.config.set('address-type', ADDRESS_TYPE);
        }
    };
    StaticAddressPage.prototype.addressChanged = function () {
        this.config.set('static-address', this.address);
    };
    StaticAddressPage.prototype.scan = function () {
        var _this = this;
        var alert;
        ionic_native_1.BarcodeScanner.scan().then(function (barcodeData) {
            try {
                // TODO: check if this is a valid address
                _this.address = bip21.decode(barcodeData.text).address;
            }
            catch (e) {
                _this.nav.present(alert);
            }
        }, function (error) {
            console.error(error);
            _this.nav.present(alert);
        });
        alert = ionic_angular_1.Alert.create({
            title: 'Scanning Error',
            subTitle: 'There was a scanning error, please try again!',
            buttons: ['Ok']
        });
    };
    StaticAddressPage = __decorate([
        ionic_angular_1.Page({
            templateUrl: 'build/pages/settings/addresses/static.html'
        }), 
        __metadata('design:paramtypes', [config_1.Config, ionic_angular_1.NavController])
    ], StaticAddressPage);
    return StaticAddressPage;
})();
exports.StaticAddressPage = StaticAddressPage;
