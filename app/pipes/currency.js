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
var CurrencyPipe = (function () {
    function CurrencyPipe() {
    }
    CurrencyPipe.prototype.transform = function (value, _a) {
        var _b = _a[0], separator = _b === void 0 ? "." : _b, _c = _a[1], thousandsDelimiter = _c === void 0 ? "," : _c, _d = _a[2], precision = _d === void 0 ? 2 : _d, _e = _a[3], symbol = _e === void 0 ? "" : _e;
        symbol = symbol === "" ? "" : (symbol + " ");
        var n = value, c = isNaN(precision = Math.abs(precision)) ? 2 : precision, d = separator == undefined ? "." : separator, t = thousandsDelimiter == undefined ? "," : thousandsDelimiter, s = value < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (i.length) > 3 ? i.length % 3 : 0;
        return symbol + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };
    CurrencyPipe = __decorate([
        core_1.Pipe({
            name: 'bitpocketCurrency'
        }), 
        __metadata('design:paramtypes', [])
    ], CurrencyPipe);
    return CurrencyPipe;
})();
exports.CurrencyPipe = CurrencyPipe;
