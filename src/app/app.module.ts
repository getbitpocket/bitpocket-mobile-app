import { NgModule, ErrorHandler  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Http, HttpModule } from '@angular/http';
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

// Pages
import {AmountPage} from '../pages/amount/amount';
import {AccountPage} from '../pages/account/account';
import {AccountCreationPage} from '../pages/account-creation/account-creation';
import {AccountFormPage} from '../pages/account-form/account-form';
import {PaymentPage} from '../pages/payment/payment';
import {PaymentResultPage} from '../pages/payment-result/payment-result';
import {HistoryPage} from '../pages/history/history';
import {SettingsPage} from '../pages/settings/settings';
import {GeneralPage} from '../pages/settings/general/general';
import {CurrencyPage} from '../pages/settings/currency/currency';
import {QRScannerPage} from '../pages/qrscanner/qrscanner';
import {PincodePage} from '../pages/pincode/pincode';
import {OfflinePage} from '../pages/offline/offline';

// Providers
import {
  Config,
  Repository,
  QRScanner,
  CurrencyService,
  AccountService,
  InsightTransactionService,
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

// Translations
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Exchange Services
import { BitcoinAverageExchangeService } from '../providers/currency/bitcoinaverage-service';

// Components, Directives
import {DynamicFontSize} from '../components/dynamic-font-size';
import {Logo} from '../components/logo';

// Pipes
import { BitpocketCurrencyPipe } from '../pipes/currency';
import { BitpocketUnitPipe } from './../pipes/unit';
import { BitpocketFiatPipe } from './../pipes/fiat';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    BitPocketApp ,
    AccountPage,
    AmountPage ,
    SettingsPage ,
    HistoryPage ,
    AccountCreationPage ,
    OfflinePage ,
    GeneralPage ,
    CurrencyPage ,
    QRScannerPage,
    PaymentPage,
    PaymentResultPage,
    AccountFormPage,
    PincodePage,
    DynamicFontSize ,
    Logo,
    BitpocketCurrencyPipe ,
    BitpocketUnitPipe ,
    BitpocketFiatPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(BitPocketApp, {}, {
      links: [
        { component: AccountCreationPage, name: 'AccountCreationPage', segment: 'account-creation' } ,
        { component: AmountPage, name: 'AmountPage', segment: 'amount' } ,
        { component: AccountPage, name: 'AccountPage', segment: 'account' } ,
        { component: AccountFormPage, name: 'AccountFormPage', segment: 'account-form' } ,
        { component: OfflinePage, name: 'OfflinePage', segment: 'offline' } ,
        { component: SettingsPage, name: 'SettiongsPage', segment: 'settings' } ,
        { component: CurrencyPage, name: 'CurrencyPage', segment: 'currency' } ,
        { component: GeneralPage, name: 'GeneralPage', segment :'general' } ,
        { component: HistoryPage, name: 'HistoryPage', segment: 'history' } ,
        { component: PaymentPage, name: 'PaymentPage', segment: 'payment' } ,
        { component: PaymentResultPage, name: 'PaymentResultPage', segment: 'payment-result' }
      ]
    }) ,    
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader : {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    BitPocketApp,
    AmountPage ,
    AccountPage,
    SettingsPage ,
    HistoryPage ,
    AccountCreationPage ,
    OfflinePage ,
    GeneralPage ,
    CurrencyPage ,
    PaymentPage,
    PaymentResultPage,
    PincodePage,
    AccountFormPage,
    QRScannerPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler } ,
    { provide: CurrencyService, useFactory: provideCurrencyService, deps: [Config, BitcoinAverageExchangeService] } ,
    { provide: AccountService, useFactory: provideAccountService, deps: [CryptocurrencyService, Config, Repository] } ,
    { provide: AccountSyncService, useFactory: provideAccountSyncService, deps: [InsightTransactionService, TransactionStorageService, AccountService, CryptocurrencyService] } ,
    { provide: InsightTransactionService, useFactory: provideTransactionService, deps: [Http, CryptocurrencyService] } ,
    { provide: TransactionStorageService, useFactory: provideTransactionStorageService, deps: [Repository] } ,
    { provide: PaymentService, useFactory: providePaymentService, deps: [InsightTransactionService] } ,
    { provide: CryptocurrencyService, useFactory: provideCryptocurrencyService } ,  
    { provide: Repository, useFactory:provideRepository } ,
    { provide:Config, useFactory:provideConfig, deps:[Storage] } ,
    { provide:QRScanner, useFactory:provideQRScanner, deps:[ModalController] },
    { provide:BitcoinAverageExchangeService, useFactory:provideBitcoinAverageExchangeService, deps:[Http] },
    SplashScreen,
    Network,
    StatusBar
  ]
})
export class AppModule {}
