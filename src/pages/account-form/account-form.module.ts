import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoModule } from '../../components/logo/logo.module';
import { TranslateModule } from '@ngx-translate/core';
import { AccountFormPage } from './account-form';

@NgModule({
  declarations: [
    AccountFormPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountFormPage),
    LogoModule ,
    TranslateModule
  ],
  exports: [
    AccountFormPage
  ]
})
export class AccountFormPageModule {}