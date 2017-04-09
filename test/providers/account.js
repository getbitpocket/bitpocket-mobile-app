"use strict";
var account_1 = require('./../../src/providers/account');
describe('Account', function () {
    var account = new account_1.Account();
    it('should correctly parse account inputs', function () {
        var address = "15mKKb2eos1hWa6tisdPwwDC1a5J1y9nma";
        expect(account.parseAccountInput("  " + address + "     ")).toEqual(address);
    });
});
