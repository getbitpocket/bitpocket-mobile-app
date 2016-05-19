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
// Payment Services
var electrum_1 = require('./electrum');
exports.PAYMENT_STATUS_RECEIVED = 'received';
exports.PAYMENT_STATUS_NOT_RECEIVED = 'not_received';
exports.PAYMENT_STATUS_DOUBLE_SPENT = 'double_spent';
exports.PAYMENT_STATUS_ERROR = 'error';
exports.PAYMENT_STATUS_TIMEOUT = 'timeout';
exports.PAYMENT_STATUS_SERVICE_ERROR = 'service_error';
var Payment = (function () {
    function Payment(injector) {
        this.injector = injector;
        this.service = this.injector.get(electrum_1.ElectrumPaymentService);
    }
    Payment.prototype.checkPayment = function (address, amount) {
        return this.service.checkPayment(address, amount);
    };
    Payment = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [core_1.Injector])
    ], Payment);
    return Payment;
})();
exports.Payment = Payment;
