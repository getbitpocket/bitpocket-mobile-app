import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExportPage } from './export';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ExportPage,
  ],
  imports: [
    IonicPageModule.forChild(ExportPage),
    TranslateModule 
  ],
})
export class ExportPageModule {}
