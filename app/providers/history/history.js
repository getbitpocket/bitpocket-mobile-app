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
var database_helper_1 = require('../database-helper');
var SQL_ADD_TRANSACTION = "INSERT INTO tx (timestamp,txid,currency,address,bitcoinAmount,fiatAmount,confirmations) VALUES (?,?,?,?,?,?,?);";
var SQL_UPDATE_CONFIRMATIONS = "UPDATE tx SET confirmations = ? WHERE txid = ?";
var SQL_QUERY_TRANSACTIONS = "SELECT * FROM tx ORDER BY timestamp DESC;";
var History = (function () {
    function History(dbHelper) {
        this.dbHelper = dbHelper;
    }
    History.prototype.queryTransactions = function () {
        var _this = this;
        var transactions = [];
        return new Promise(function (resolve, reject) {
            _this.dbHelper.executeSql(SQL_QUERY_TRANSACTIONS, []).then(function (results) {
                for (var i = 0; i < results.rows.length; i++) {
                    var row = results.rows.item(i);
                    var tx = {
                        txid: row['txid'],
                        confirmations: row['confirmations'],
                        timestamp: row['timestamp'],
                        currency: row['currency'],
                        address: row['address'],
                        bitcoinAmount: row['bitcoinAmount'],
                        fiatAmount: row['fiatAmount']
                    };
                    transactions.push(tx);
                }
                resolve(transactions);
            });
        });
    };
    History.prototype.updateConfirmations = function (txid, confirmations) {
        this.dbHelper.executeSql(SQL_UPDATE_CONFIRMATIONS, [
            confirmations,
            txid
        ]);
    };
    History.prototype.addTransaction = function (transaction) {
        var inputs = [];
        inputs.push((new Date()).getTime());
        inputs.push(transaction.txid);
        inputs.push(transaction.currency);
        inputs.push(transaction.address);
        inputs.push(transaction.bitcoinAmount);
        inputs.push(transaction.fiatAmount);
        inputs.push(0);
        this.dbHelper.executeSql(SQL_ADD_TRANSACTION, inputs);
    };
    History = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [database_helper_1.DatabaseHelper])
    ], History);
    return History;
})();
exports.History = History;
