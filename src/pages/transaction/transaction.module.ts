import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BitpocketCurrencyPipeModule } from '../../pipes/bitpocket-currency/bitpocket-currency.module';
import { BitpocketUnitPipeModule } from '../../pipes/bitpocket-unit/bitpocket-unit.module';
import { BitpocketFiatPipeModule } from '../../pipes/bitpocket-fiat/bitpocket-fiat.module';
import { TranslateModule } from '@ngx-translate/core';
import { TransactionPage } from './transaction';

@NgModule({
  declarations: [
    TransactionPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionPage),
    TranslateModule ,
    BitpocketCurrencyPipeModule ,
    BitpocketUnitPipeModule ,
    BitpocketFiatPipeModule
  ],
})
export class TransactionPageModule {}
