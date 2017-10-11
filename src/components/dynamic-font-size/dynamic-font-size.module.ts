import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DynamicFontSize } from './dynamic-font-size';

@NgModule({
  declarations: [
    DynamicFontSize,
  ],
  imports: [
    IonicModule ,
    
  ],
  exports: [
    DynamicFontSize
  ]
})
export class DynamicFontSizeModule {}