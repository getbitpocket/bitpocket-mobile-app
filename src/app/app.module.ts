import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { IonicApp, IonicModule } from 'ionic-angular';

// Pouch DB
import PouchDB from 'pouchdb';
import pouchdbUpsert from 'pouchdb-upsert';
PouchDB.plugin(pouchdbUpsert);

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
import {DatabaseHelper} from '../providers/database-helper';
import {Repository} from '../providers/repository';
import {Config} from '../providers/config';
import {Currency} from '../providers/currency/currency';
import {Payment} from '../providers/payment/payment';
import {AccountService} from '../providers/account/account-service';
import {QRScanner} from '../providers/qrscanner/qrscanner';
import { TransactionService } from './../providers/transaction/transaction-service';

// Translations
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Exchange Services
import {BlockchainExchangeService} from '../providers/currency/blockchain';
import {BitcoinAverageExchangeService} from '../providers/currency/bitcoinaverage';

// Payment Services
import {ElectrumPaymentService} from '../providers/payment/electrum';

// Components, Directives
import {DynamicFontSize} from '../components/dynamic-font-size';
import {Logo} from '../components/logo';

// Pipes
import { BitpocketCurrencyPipe } from '../pipes/currency';
import { BitpocketUnitPipe } from './../pipes/unit';

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
    BitpocketUnitPipe
  ],
  imports: [
    IonicModule.forRoot(BitPocketApp) ,
    HttpModule,
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
    Repository ,
    Config ,
    Currency ,
    Payment ,
    AccountService ,
    QRScanner,
    BlockchainExchangeService ,
    BitcoinAverageExchangeService ,
    ElectrumPaymentService ,
    DatabaseHelper,
    TransactionService
  ]
})
export class AppModule {}
