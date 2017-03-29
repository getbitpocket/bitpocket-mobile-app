import {
    AccountService,
    ACCOUNT_TYPE_BITCOIN_ADDRESS,
    ACCOUNT_TYPE_BITCOIN_XPUB_KEY,
    ACCOUNT_TYPE_TESTNET_ADDRESS,
    ACCOUNT_TYPE_TESTNET_TPUB_KEY
} from './account-service';

describe('Bitcoin Account', () => {

    let account = new AccountService(null);

    it('should correctly parse account address input', () => {
        let address = "15mKKb2eos1hWa6tisdPwwDC1a5J1y9nma";
        let result = account.parseAccountInput("  " + address + "     ");
        expect(result.data).toEqual(address);
        expect(result.type).toEqual(ACCOUNT_TYPE_BITCOIN_ADDRESS);
    });

    it('should correctly parse account uri input', () => {
        let address = "15mKKb2eos1hWa6tisdPwwDC1a5J1y9nma";
        let result = account.parseAccountInput("bitcoin:" + address + "?amount=100.0000&text=something");
        expect(result.data).toEqual(address);
        expect(result.type).toEqual(ACCOUNT_TYPE_BITCOIN_ADDRESS);
    });

    it('should correctly parse account xpub input', () => {
        let key = "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8";
        let result = account.parseAccountInput("  " + key + "     ");
        expect(result.data).toEqual(key);
        expect(result.type).toEqual(ACCOUNT_TYPE_BITCOIN_XPUB_KEY);
    });

});

describe('Testnet Account', () => {

    let account = new AccountService(null);

    it('should correctly parse account address input', () => {
        let address = "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn";
        let result = account.parseAccountInput("  " + address + "     ");
        expect(result.data).toEqual(address);
        expect(result.type).toEqual(ACCOUNT_TYPE_TESTNET_ADDRESS);
    });

    it('should correctly parse account uri input', () => {
        let address = "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn";
        let result = account.parseAccountInput("bitcoin:" + address + "?amount=100.0000&text=something");
        expect(result.data).toEqual(address);
        expect(result.type).toEqual(ACCOUNT_TYPE_TESTNET_ADDRESS);
    });

    it('should correctly parse account tpub input', () => {
        let key = "tpubD6NzVbkrYhZ4WUbpsyRwqJ8C2f5T7vXZVaiZkgsBCeNAT3gQxKAaFnqdM3jUzVJDAQsnnMBHvcwKUqt6NesoZRuW1ED8xEGoV5HDR3vad1j";
        let result = account.parseAccountInput("  " + key + "     ");
        expect(result.data).toEqual(key);
        expect(result.type).toEqual(ACCOUNT_TYPE_TESTNET_TPUB_KEY);
    });

});