import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoModule } from './../../../components/logo/logo.module';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyPage } from './currency';

@NgModule({
  declarations: [
    CurrencyPage
  ],
  imports: [
    IonicPageModule.forChild(CurrencyPage),
    LogoModule ,
    TranslateModule
  ],
  exports: [
    CurrencyPage
  ]
})
export class CurrencyPageModule {}