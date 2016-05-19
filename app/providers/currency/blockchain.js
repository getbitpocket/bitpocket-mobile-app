var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var http_1 = require('angular2/http');
var core_1 = require('angular2/core');
var BlockchainExchangeService = (function () {
    function BlockchainExchangeService(http) {
        this.http = http;
    }
    BlockchainExchangeService.prototype.prepareOutput = function (json) {
        var output = [];
        for (var key in json) {
            if (json.hasOwnProperty(key)) {
                output.push({
                    code: key,
                    symbol: json[key].symbol,
                    rate: json[key].last
                });
            }
        }
        return output;
    };
    BlockchainExchangeService.prototype.getAvailableCurrencies = function () {
        return this.getExchangeRates();
    };
    BlockchainExchangeService.prototype.getExchangeRates = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.http.get('https://blockchain.info/ticker?cors=true')
                    .subscribe(function (response) {
                    if (response.status === 200) {
                        resolve(_this.prepareOutput(response.json()));
                    }
                    else {
                        reject();
                    }
                });
            }
            catch (e) {
                console.error(e);
                reject();
            }
        });
    };
    BlockchainExchangeService.prototype.getExchangeRate = function (code) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.http.get('https://blockchain.info/ticker?cors=true')
                    .subscribe(function (response) {
                    if (response.status === 200) {
                        var output = {};
                        var json = response.json();
                        for (var key in json) {
                            if (key === code) {
                                output = {
                                    code: key,
                                    symbol: json[key].symbol,
                                    rate: json[key].last
                                };
                            }
                        }
                        resolve(output);
                    }
                    else {
                        reject();
                    }
                });
            }
            catch (e) {
                console.error(e);
                reject();
            }
        });
    };
    BlockchainExchangeService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], BlockchainExchangeService);
    return BlockchainExchangeService;
})();
exports.BlockchainExchangeService = BlockchainExchangeService;
