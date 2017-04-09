import { Account } from './../../src/providers/account';

describe('Account', () => {

    let account = new Account();

    it('should correctly parse account inputs', () => {
        let address = "15mKKb2eos1hWa6tisdPwwDC1a5J1y9nma";
        expect(account.parseAccountInput("  " + address + "     ")).toEqual(address);
    });

});