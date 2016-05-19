/// <reference path="../../bitcoinjs-lib.d.ts" />
var payment = require('./payment');
var bitcoin = require('bitcoinjs-lib');
var buffer_1 = require('buffer');
var ElectrumPaymentService = (function () {
    function ElectrumPaymentService() {
    }
    ElectrumPaymentService.prototype.checkTransaction = function (transaction, address, amount) {
        var buffer = new buffer_1.Buffer(transaction, 'hex');
        var t = bitcoin.Transaction.fromBuffer(buffer);
        for (var _i = 0, _a = t.outs; _i < _a.length; _i++) {
            var out = _a[_i];
            if (address === bitcoin.address.fromOutputScript(out.script) && amount.toSatoshis() <= out.value) {
                return t.getId();
            }
        }
        return false;
    };
    ElectrumPaymentService.prototype.checkPayment = function (address, amount) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var nD = new electrum.NetworkDiscovery();
            var requestId = Math.round(Math.random() * 10000000);
            var txRequestId = Math.round(Math.random() * 10000000);
            var txCount = 0, txResultCount = 0;
            nD.init();
            nD.on('peers:discovered', function () {
                nD.sendRandomRequest({
                    id: requestId,
                    method: 'blockchain.address.get_mempool',
                    params: [address] });
            });
            nD.on('peers:response', function (response) {
                console.log(response);
                if (response.id == requestId && Array.isArray(response.result) && response.result.length > 0) {
                    txCount = response.result.length;
                    for (var _i = 0, _a = response.result; _i < _a.length; _i++) {
                        var tx = _a[_i];
                        if (typeof tx.tx_hash === 'string') {
                            nD.sendRandomRequest({
                                id: 'tid-' + txRequestId++,
                                method: 'blockchain.transaction.get',
                                params: [tx.tx_hash]
                            });
                        }
                    }
                }
                else if (typeof response.id === 'string' && response.id.indexOf('tid-') === 0) {
                    txResultCount++;
                    var txid = _this.checkTransaction(response.result, address, amount);
                    if (txid !== false) {
                        resolve({ status: payment.PAYMENT_STATUS_RECEIVED, tx: txid });
                    }
                    else if (txCount <= txResultCount) {
                        reject({ status: payment.PAYMENT_STATUS_NOT_RECEIVED });
                    }
                }
                else {
                    reject({ status: payment.PAYMENT_STATUS_NOT_RECEIVED });
                }
            });
        });
    };
    return ElectrumPaymentService;
})();
exports.ElectrumPaymentService = ElectrumPaymentService;
