import {Injectable} from '@angular/core';
import * as regex from 'crypto-regex';
import * as bitcoin from 'bitcoinjs-lib';

export const BITCOIN = "bitcoin";
export const TESTNET = "testnet";

export const BITCOIN_ADDRESS  = "bitcoin-static-address";
export const BITCOIN_XPUB_KEY = "bitcoin-xpub-key";
export const TESTNET_ADDRESS  = "testnet-static-address";
export const TESTNET_TPUB_KEY = "testnet-tpub-key";

export const REGEX_BITCOIN_ADDRESS = new RegExp("^(" + regex['bitcoin-address'] + ")$");
export const REGEX_BITCOIN_URI     = new RegExp("^" + regex['bitcoin-uri']);
export const REGEX_XPUB_KEY        = new RegExp("^(" + regex['bitcoin-xpub-key'] + ")$");
export const REGEX_TESTNET_ADDRESS = new RegExp("^(" + regex['testnet-address'] + ")$");
export const REGEX_TESTNET_URI     = new RegExp("^" + regex['testnet-uri']);
export const REGEX_TPUB_KEY        = new RegExp("^(" + regex['testnet-tpub-key'] + ")$");

@Injectable()
export class CryptocurrencyService {

    deriveAddress(key:string, index:number) : string {
        try {
            let data = this.parseXpubKeyInput(key);
            if (data.currency == BITCOIN) {
                return bitcoin.HDNode.fromBase58(key).derive(0).derive(index).getAddress();
            } else {
                return bitcoin.HDNode.fromBase58(key, [bitcoin.networks.testnet]).derive(0).derive(index).getAddress();
            }
        } catch (e) {
            throw new Error('Could not derive index from key' + e);
        }        
    }

    parseXpubKeyInput(input: string) {
        try {
            if (REGEX_XPUB_KEY.test(input) && (bitcoin.HDNode.fromBase58(input).toBase58() === input)) {
                return {
                    type : BITCOIN_XPUB_KEY ,
                    currency : BITCOIN ,
                    data : input.match(REGEX_XPUB_KEY)[1]
                };
            }
            if (REGEX_TPUB_KEY.test(input) && (bitcoin.HDNode.fromBase58(input, [bitcoin.networks.testnet]).toBase58() === input)) {
                return {
                    type : TESTNET_TPUB_KEY ,
                    currency : TESTNET ,
                    data : input.match(REGEX_TPUB_KEY)[1]
                }
            }
        } catch(e) {            
            console.error("error", e);
        }

        return null;
    }

    parseAddressInput(input: string) {
        let addressRegexs = [REGEX_BITCOIN_ADDRESS, REGEX_BITCOIN_URI, REGEX_TESTNET_ADDRESS, REGEX_TESTNET_URI];
        for(let i = 0; i < addressRegexs.length; i++) {
            if (addressRegexs[i].test(input)) {
                return {
                    type : i > 1 ? TESTNET_ADDRESS : BITCOIN_ADDRESS ,
                    currency : i > 1 ? TESTNET : BITCOIN ,
                    data : input.match(addressRegexs[i])[1]
                };
            }
        }
        return null;
    }

    /**
     * Parses account input information
     * 
     * @param input account information
     * @return Account
     * @throws Error
     * 
     */
    parseInput(input:string) {
       input = input.trim();
       let address = this.parseAddressInput(input);
       if (address) {
           return address;
       }

       let key = this.parseXpubKeyInput(input);
       if (key) {
           return key;
       }

       throw new Error('Could not parse input information');
    }

}