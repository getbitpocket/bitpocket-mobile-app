import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogoModule } from './../../components/logo/logo.module';
import { TranslateModule } from '@ngx-translate/core';
import { PincodePage } from './pincode';

@NgModule({
  declarations: [
    PincodePage
  ],
  imports: [
    IonicPageModule.forChild(PincodePage),
    LogoModule ,
    TranslateModule
  ],
  exports: [
    PincodePage
  ]
})
export class PincodePageModule {}