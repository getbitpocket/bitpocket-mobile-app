import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoModule } from '../../components/logo/logo.module';
import { DynamicFontSizeModule } from '../../components/dynamic-font-size/dynamic-font-size.module';
import { PaymentResultPage } from './payment-result';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PaymentResultPage
  ],
  imports: [
    IonicPageModule.forChild(PaymentResultPage),
    TranslateModule ,
    DynamicFontSizeModule ,
    LogoModule
  ],
  exports: [
    PaymentResultPage
  ]
})
export class PaymentResultPageModule {}