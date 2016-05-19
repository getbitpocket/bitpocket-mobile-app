var BitcoinUnit = (function () {
    function BitcoinUnit(value) {
        this.bitcoinValue = 0;
        this.bitcoinValue = value;
    }
    Object.defineProperty(BitcoinUnit.prototype, "value", {
        set: function (value) {
            this.bitcoinValue = value;
        },
        enumerable: true,
        configurable: true
    });
    BitcoinUnit.fromBitcoin = function (value) {
        return new BitcoinUnit(parseFloat(value.toFixed(8)));
    };
    BitcoinUnit.fromFiat = function (fiatValue, exchangeRate) {
        return new BitcoinUnit(parseFloat((fiatValue / exchangeRate).toFixed(8)));
    };
    BitcoinUnit.prototype.toBitcoin = function () {
        return this.bitcoinValue;
    };
    BitcoinUnit.prototype.toSatoshis = function () {
        return parseInt((this.bitcoinValue * 1e8).toFixed(0));
    };
    return BitcoinUnit;
})();
exports.BitcoinUnit = BitcoinUnit;
