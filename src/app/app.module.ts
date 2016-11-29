import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

// Main Component
import { BitPocketApp } from './app.component';

// Pages
import {AmountPage} from '../pages/amount/amount';
import {SettingsPage} from '../pages/settings/settings';
import {HistoryPage} from '../pages/history/history';
import {AddressesPage} from '../pages/onboarding/addresses';
import {OfflinePage} from '../pages/onboarding/offline';
import {GeneralPage} from '../pages/settings/general/general';
import {CurrencyPage} from '../pages/settings/currency/currency';
import {StaticAddressPage} from '../pages/settings/addresses/static-address';
import {MasterPublicKeyPage} from '../pages/settings/addresses/master-public-key';
import {PaymentPage} from '../pages/payment/payment';
import {PaymentResultPage} from '../pages/payment/payment-result';
import {QRScannerPage} from '../pages/qrscanner/qrscanner';
import {PincodePage} from '../pages/pincode/pincode';


// Providers
import {DatabaseHelper} from '../providers/database-helper';
import {Config} from '../providers/config';
import {Currency} from '../providers/currency/currency';
import {Payment} from '../providers/payment/payment';
import {Address} from '../providers/address';
import {History} from '../providers/history/history';
import {QRScanner} from '../providers/qrscanner/qrscanner';

// Exchange Services
import {BlockchainExchangeService} from '../providers/currency/blockchain';
import {BitcoinAverageExchangeService} from '../providers/currency/bitcoinaverage';

// Payment Services
import {ElectrumPaymentService} from '../providers/payment/electrum';

// Components, Directives
import {DynamicFontSize} from '../components/dynamic-font-size';
import {Logo} from '../components/logo';

@NgModule({
  declarations: [
    BitPocketApp ,
    AmountPage ,
    SettingsPage ,
    HistoryPage ,
    AddressesPage ,
    OfflinePage ,
    GeneralPage ,
    CurrencyPage ,
    StaticAddressPage ,
    MasterPublicKeyPage ,
    QRScannerPage,
    PaymentPage,
    PaymentResultPage,
    PincodePage,
    DynamicFontSize ,
    Logo
  ],
  imports: [
    IonicModule.forRoot(BitPocketApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    BitPocketApp,
    AmountPage ,
    SettingsPage ,
    HistoryPage ,
    AddressesPage ,
    OfflinePage ,
    GeneralPage ,
    CurrencyPage ,
    StaticAddressPage ,
    MasterPublicKeyPage ,
    PaymentPage,
    PaymentResultPage,
    PincodePage,
    QRScannerPage
  ],
  providers: [
    DatabaseHelper ,
    Config ,
    Currency ,
    Payment ,
    Address ,
    History ,
    QRScanner,
    BlockchainExchangeService ,
    BitcoinAverageExchangeService ,
    ElectrumPaymentService
  ]
})
export class AppModule {}
