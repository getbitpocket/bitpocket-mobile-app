import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoModule } from '../../components/logo/logo.module';
import { DynamicFontSizeModule } from '../../components/dynamic-font-size/dynamic-font-size.module';
import { PaymentPage } from './payment';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    PaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentPage),
    TranslateModule ,
    DynamicFontSizeModule ,
    LogoModule
  ],
  exports: [
    PaymentPage
  ]
})
export class PaymentPageModule {}