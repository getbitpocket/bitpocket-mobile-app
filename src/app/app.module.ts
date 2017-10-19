import { NgModule, ErrorHandler  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler, ModalController } from 'ionic-angular';

// Pouch DB
import PouchDB from 'pouchdb';
import pouchdbUpsert from 'pouchdb-upsert';
import pouchFind from 'pouchdb-find';
PouchDB.plugin(pouchdbUpsert);
PouchDB.plugin(pouchFind);
// PouchDB.debug.enable('pouchdb:find');
window['PouchDB'] = PouchDB;

// Main Component
import { BitPocketApp } from './app.component';

// Providers
import {
  Config,
  Repository,
  QRScanner,
  CurrencyService,
  AccountService,
  TransactionServiceWrapper,
  CryptocurrencyService,
  PaymentService,
  TransactionStorageService,
  AccountSyncService,
  provideCurrencyService,
  provideAccountService,
  provideAccountSyncService,
  provideTransactionService,
  provideTransactionStorageService,
  providePaymentService,
  provideCryptocurrencyService,
  provideRepository,
  provideConfig,
  provideQRScanner,
  provideBitcoinAverageExchangeService
} from '../providers/index';

// Ionic Native
import { StatusBar } from '@ionic-native/status-bar';
import { Network } from '@ionic-native/network';
import { SplashScreen } from '@ionic-native/splash-screen';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

// Translations
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Exchange Services
import { BitcoinAverageExchangeService } from '../providers/currency/bitcoinaverage-service';

// Pipes
import { BitpocketCurrencyPipe } from '../pipes/currency';
import { BitpocketUnitPipe } from './../pipes/unit';
import { BitpocketFiatPipe } from './../pipes/fiat';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    BitPocketApp    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(BitPocketApp) ,    
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader : {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    BitPocketApp
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler } ,
    { provide: CurrencyService, useFactory: provideCurrencyService, deps: [Config, BitcoinAverageExchangeService] } ,
    { provide: AccountService, useFactory: provideAccountService, deps: [CryptocurrencyService, Config, Repository] } ,
    { provide: AccountSyncService, useFactory: provideAccountSyncService, deps: [TransactionServiceWrapper, TransactionStorageService, AccountService, CryptocurrencyService] } ,
    { provide: TransactionServiceWrapper, useFactory: provideTransactionService, deps: [HttpClient, CryptocurrencyService] } ,
    { provide: TransactionStorageService, useFactory: provideTransactionStorageService, deps: [Repository] } ,
    { provide: PaymentService, useFactory: providePaymentService, deps: [TransactionServiceWrapper, CryptocurrencyService] } ,
    { provide: CryptocurrencyService, useFactory: provideCryptocurrencyService } ,  
    { provide: Repository, useFactory:provideRepository } ,
    { provide:Config, useFactory:provideConfig, deps:[Storage] } ,
    { provide:QRScanner, useFactory:provideQRScanner, deps:[ModalController] },
    { provide:BitcoinAverageExchangeService, useFactory:provideBitcoinAverageExchangeService, deps:[HttpClient, Config] },
    SplashScreen,
    Network,
    StatusBar,
    File,
    FileOpener
  ]
})
export class AppModule {}
