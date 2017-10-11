import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoModule } from '../../components/logo/logo.module';
import { TranslateModule } from '@ngx-translate/core';
import { QRScannerPage } from './qrscanner';

@NgModule({
  declarations: [
    QRScannerPage
  ],
  imports: [
    IonicPageModule.forChild(QRScannerPage),
    LogoModule ,
    TranslateModule
  ],
  exports: [
    QRScannerPage
  ]
})
export class QRScannerPageModule {}