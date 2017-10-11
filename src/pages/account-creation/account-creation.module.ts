import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoModule } from '../../components/logo/logo.module';
import { TranslateModule } from '@ngx-translate/core';
import { AccountCreationPage } from './account-creation';

@NgModule({
  declarations: [
    AccountCreationPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountCreationPage),
    LogoModule ,
    TranslateModule
  ],
  exports: [
    AccountCreationPage
  ]
})
export class AccountCreationPageModule {}