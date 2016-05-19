/// <reference path="../cordova-sqlite-plugin.d.ts" />
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
// import {Platform} from 'ionic-angular';
/*
txid: string;
    timestamp: number;
    currency: string;
    address: string;
    bitcoinAmount: number;
    fiatAmount: number;
 */
var DatabaseHelper = (function () {
    function DatabaseHelper() {
        this.ready = false;
        this.ready = false;
    }
    DatabaseHelper.prototype.initDb = function () {
        var _this = this;
        var dbOptions = {
            dbName: 'bitpocket',
            version: '1.0',
            comment: 'BitPocket SQL Database',
            sizeEstimation: 2 * 1024 * 1024
        };
        if (window.sqlitePlugin) {
        }
        else {
            this.db = window.openDatabase(dbOptions.dbName, dbOptions.version, dbOptions.comment, dbOptions.sizeEstimation);
        }
        return new Promise(function (resolve, reject) {
            _this.db.transaction(function (tx) {
                var sqlInit = "CREATE TABLE IF NOT EXISTS tx ( ";
                sqlInit += "timestamp INT, ";
                sqlInit += "txid TEXT, ";
                sqlInit += "currency TEXT, ";
                sqlInit += "address TEXT, ";
                sqlInit += "bitcoinAmount REAL, ";
                sqlInit += "fiatAmount REAL, ";
                sqlInit += "confirmations INT);";
                tx.executeSql(sqlInit, null, function () {
                    _this.ready = true;
                    resolve(true);
                }, function () {
                    _this.ready = false;
                    reject(false);
                });
            });
        });
    };
    DatabaseHelper.prototype.executeSql = function (statement, args) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.ready) {
                reject('db not ready');
            }
            else {
                _this.db.transaction(function (tx) {
                    tx.executeSql(statement, args, function (tx, results) {
                        resolve(results);
                    }, function (tx, error) {
                        reject(error.message);
                    });
                });
            }
        });
    };
    DatabaseHelper = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], DatabaseHelper);
    return DatabaseHelper;
})();
exports.DatabaseHelper = DatabaseHelper;
