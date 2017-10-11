import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoModule } from '../../components/logo/logo.module';
import { TranslateModule } from '@ngx-translate/core';
import { AccountPage } from './account';

@NgModule({
  declarations: [
    AccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPage),
    LogoModule ,
    TranslateModule
  ],
  exports: [
    AccountPage
  ]
})
export class AccountPageModule {}