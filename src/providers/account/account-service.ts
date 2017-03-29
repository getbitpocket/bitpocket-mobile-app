import {Injectable} from '@angular/core';
import * as regex from 'crypto-regex';
import * as bitcoin from 'bitcoinjs-lib';
import { Account } from '../../api/account';
import { Repository } from './../repository';

export const ACCOUNT_TYPE_BITCOIN_ADDRESS  = "bitcoin-static-address";
export const ACCOUNT_TYPE_BITCOIN_XPUB_KEY = "bitcoin-xpub-key";
export const ACCOUNT_TYPE_TESTNET_ADDRESS  = "testnet-static-address";
export const ACCOUNT_TYPE_TESTNET_TPUB_KEY = "testnet-tpub-key";

export const REGEX_BITCOIN_ADDRESS = new RegExp("^(" + regex['bitcoin-address'] + ")$");
export const REGEX_BITCOIN_URI     = new RegExp("^" + regex['bitcoin-uri']);
export const REGEX_XPUB_KEY        = new RegExp("^(" + regex['bitcoin-xpub-key'] + ")$");
export const REGEX_TESTNET_ADDRESS = new RegExp("^(" + regex['testnet-address'] + ")$");
export const REGEX_TESTNET_URI     = new RegExp("^" + regex['testnet-uri']);
export const REGEX_TPUB_KEY        = new RegExp("^(" + regex['testnet-tpub-key'] + ")$");

@Injectable()
export class AccountService {

    constructor(protected repository:Repository) {}

    parseXpubKeyInput(input: string) : Account {
        try {
            if (REGEX_XPUB_KEY.test(input) && (bitcoin.HDNode.fromBase58(input).toBase58() === input)) {
                return {
                    type : ACCOUNT_TYPE_BITCOIN_XPUB_KEY ,
                    data : input.match(REGEX_XPUB_KEY)[1]
                };
            }
            if (REGEX_TPUB_KEY.test(input) && (bitcoin.HDNode.fromBase58(input, [bitcoin.networks.testnet]).toBase58() === input)) {
                return {
                    type : ACCOUNT_TYPE_TESTNET_TPUB_KEY ,
                    data : input.match(REGEX_TPUB_KEY)[1]
                }
            }
        } catch(e) {            
            console.error("error", e);
        }

        return null;
    }

    parseAddressInput(input: string) : Account {
        let addressRegexs = [REGEX_BITCOIN_ADDRESS, REGEX_BITCOIN_URI, REGEX_TESTNET_ADDRESS, REGEX_TESTNET_URI];
        for(let i = 0; i < addressRegexs.length; i++) {
            if (addressRegexs[i].test(input)) {
                return {
                    type : i > 1 ? ACCOUNT_TYPE_TESTNET_ADDRESS : ACCOUNT_TYPE_BITCOIN_ADDRESS ,
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
    parseAccountInput(input:string) : Account {
       input = input.trim();
       let address = this.parseAddressInput(input);
       if (address) {
           return address;
       }

       let key = this.parseXpubKeyInput(input);
       if (key) {
           return key;
       }

       throw new Error('Could not parse account information');
    }

    addAccount(account:Account) : Promise<Account> {
        return new Promise<Account> ((resolve,reject) => {
            account['doctype'] = 'account';
            this.repository.addDocument(account)
                .then((response) => {
                    account._id = response.id;
                    resolve(account);
                }).catch((e) => {
                    reject(e);
                });
        });
    }

    editAccount(account:Account) : Promise<Account> {
        return new Promise<Account> ((resolve, reject) => {
            account['doctype'] = 'account';
            this.repository.editDocument(account)
                .then(() => {
                    resolve(account);
                }).catch((e) => {
                    reject(e);
                });
        });
    }

    getAccounts() : Promise<Array<Account>> {
        return new Promise<Array<Account>>((resolve,reject) => {
            this.repository.findByDocumentType('account')
                .then(result => {
                    resolve(result);
                })
                .catch(() => {
                    reject();
                });
        });
    }

    getAccount(id:string) : Promise<Account> {
        return new Promise<Account>((resolve, reject) => {
            this.repository.findById(id)
                .then(account => {
                    if (account['doctype'] == 'account') {
                        resolve(account);
                    } else {
                        reject();
                    }
                }).catch(() => {
                    reject();
                });
        });
    }

    removeAccount(id:string) : Promise<void> {
        return new Promise<void> ((resolve, reject) => {
            resolve(this.repository.removeDocument(id));
        });
    }

}
