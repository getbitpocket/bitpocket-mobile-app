import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoModule } from '../../components/logo/logo.module';
import { TranslateModule } from '@ngx-translate/core';
import { OfflinePage } from './offline';

@NgModule({
  declarations: [
    OfflinePage,
  ],
  imports: [
    IonicPageModule.forChild(OfflinePage),
    LogoModule ,
    TranslateModule
  ],
  exports: [
    OfflinePage
  ]
})
export class OfflinePageModule {}