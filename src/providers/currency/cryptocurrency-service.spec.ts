import {
    CryptocurrencyService,
    BITCOIN_ADDRESS,
    BITCOIN_XPUB_KEY,
    TESTNET_ADDRESS,
    TESTNET_TPUB_KEY
} from './cryptocurrency-service';

describe('Bitcoin', () => {

    let service = new CryptocurrencyService();

    it('should correctly parse account address input', () => {
        let address = "15mKKb2eos1hWa6tisdPwwDC1a5J1y9nma";
        let result = service.parseInput("  " + address + "     ");
        expect(result.data).toEqual(address);
        expect(result.type).toEqual(BITCOIN_ADDRESS);
    });

    it('should correctly parse account uri input', () => {
        let address = "15mKKb2eos1hWa6tisdPwwDC1a5J1y9nma";
        let result = service.parseInput("bitcoin:" + address + "?amount=100.0000&text=something");
        expect(result.data).toEqual(address);
        expect(result.type).toEqual(BITCOIN_ADDRESS);
    });

    it('should correctly parse account xpub input', () => {
        let key = "xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8NqtwybGhePY2gZ29ESFjqJoCu1Rupje8YtGqsefD265TMg7usUDFdp6W1EGMcet8";
        let result = service.parseInput("  " + key + "     ");
        expect(result.data).toEqual(key);
        expect(result.type).toEqual(BITCOIN_XPUB_KEY);
    });

});

describe('Testnet', () => {

    let service = new CryptocurrencyService();

    it('should correctly parse account address input', () => {
        let address = "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn";
        let result = service.parseInput("  " + address + "     ");
        expect(result.data).toEqual(address);
        expect(result.type).toEqual(TESTNET_ADDRESS);
    });

    it('should correctly parse account uri input', () => {
        let address = "mipcBbFg9gMiCh81Kj8tqqdgoZub1ZJRfn";
        let result = service.parseInput("bitcoin:" + address + "?amount=100.0000&text=something");
        expect(result.data).toEqual(address);
        expect(result.type).toEqual(TESTNET_ADDRESS);
    });

    it('should correctly parse account tpub input', () => {
        let key = "tpubD6NzVbkrYhZ4WUbpsyRwqJ8C2f5T7vXZVaiZkgsBCeNAT3gQxKAaFnqdM3jUzVJDAQsnnMBHvcwKUqt6NesoZRuW1ED8xEGoV5HDR3vad1j";
        let result = service.parseInput("  " + key + "     ");
        expect(result.data).toEqual(key);
        expect(result.type).toEqual(TESTNET_TPUB_KEY);
    });

});