import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoModule } from './../../../components/logo/logo.module';
import { TranslateModule } from '@ngx-translate/core';
import { GeneralPage } from './general';

@NgModule({
  declarations: [
    GeneralPage
  ],
  imports: [
    IonicPageModule.forChild(GeneralPage),
    LogoModule ,
    TranslateModule
  ],
  exports: [
    GeneralPage
  ]
})
export class GeneralPageModule {}