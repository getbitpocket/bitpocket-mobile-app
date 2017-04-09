import { CryptocurrencyService } from './../currency/cryptocurrency-service';
import { Config } from './../config';
import {Injectable} from '@angular/core';
import { Account } from '../../api/account';
import { Repository } from './../repository';
import * as bitcoin from 'bitcoinjs-lib';

export const ACCOUNT_TYPE_BITCOIN_ADDRESS  = "bitcoin-static-address";
export const ACCOUNT_TYPE_BITCOIN_XPUB_KEY = "bitcoin-xpub-key";
export const ACCOUNT_TYPE_TESTNET_ADDRESS  = "testnet-static-address";
export const ACCOUNT_TYPE_TESTNET_TPUB_KEY = "testnet-tpub-key";

@Injectable()
export class AccountService {

    constructor(
        protected cryptocurrencyService: CryptocurrencyService,
        protected config:Config,
        protected repository:Repository) {}

    parseAccountInput(input:string) : Account {
        return this.cryptocurrencyService.parseInput(input);
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
            this.repository.addOrEditDocument(account)
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

    getDefaultAddress() : Promise<string> {
        
        return new Promise<string> ((resolve, reject) => {
            this.config.get(Config.CONFIG_KEY_DEFAULT_ACCOUNT)
                .then(accountId => {
                    return this.getAccount(accountId);
                }).then(account => {
                    try {
                        let address = this.getNextAddress(account);
                        resolve(address);
                    } catch (e) {
                        reject(e);
                    }                   
                }).catch(() => {
                    reject("couldn't find default address");
                });
        });        
    }

    getNextAddress(account:Account, index=1) : string {
        if(/.*?-static-address/.test(account.type)) {            
            return account.data;
        } else if (/bitcoin-xpub-key/.test(account.type)) {
            // TODO: retrieve next index correctly...
            return bitcoin.HDNode.fromBase58(account.type).derive(0).derive(index).getAddress();
        } else if (/testnet-tpub-key/.test(account.type)) {
            return bitcoin.HDNode.fromBase58(account.type, [bitcoin.networks.testnet]).derive(0).derive(index).getAddress();
        }

        throw new Error('unknown account type');
    }

}
