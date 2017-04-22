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
PouchDB.debug.enable('pouchdb:find');
window['PouchDB'] = PouchDB;

// Main Component
import { BitPocketApp } from './app.component';

// Pages
import {AccountPage} from '../pages/account/account';
import {AmountPage} from '../pages/amount/amount';
import {SettingsPage} from '../pages/settings/settings';
import {HistoryPage} from '../pages/history/history';
import {AccountCreationPage} from '../pages/onboarding/account-creation';
import {OfflinePage} from '../pages/onboarding/offline';
import {GeneralPage} from '../pages/settings/general/general';
import {CurrencyPage} from '../pages/settings/currency/currency';
import {PaymentPage} from '../pages/payment/payment';
import {PaymentResultPage} from '../pages/payment/payment-result';
import {QRScannerPage} from '../pages/qrscanner/qrscanner';
import {PincodePage} from '../pages/pincode/pincode';
import { AccountFormPage } from '../pages/account/account-form';

// Providers
import {
  Config,
  Repository,
  QRScanner,
  CurrencyService,
  AccountService,
  TransactionService,
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
    IonicModule.forRoot(BitPocketApp) ,    
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
    { provide: AccountSyncService, useFactory: provideAccountSyncService, deps: [TransactionService, TransactionStorageService, AccountService, CryptocurrencyService] } ,
    { provide: TransactionService, useFactory: provideTransactionService, deps: [Http, CryptocurrencyService] } ,
    { provide: TransactionStorageService, useFactory: provideTransactionStorageService, deps: [Repository] } ,
    { provide: PaymentService, useFactory: providePaymentService, deps: [TransactionService] } ,
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
