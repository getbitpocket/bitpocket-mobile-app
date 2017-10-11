import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoModule } from '../../components/logo/logo.module';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsPage } from './settings';

@NgModule({
  declarations: [
    SettingsPage
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),
    LogoModule,
    TranslateModule
  ],
  exports: [
    SettingsPage
  ]
})
export class SettingsPageModule {}