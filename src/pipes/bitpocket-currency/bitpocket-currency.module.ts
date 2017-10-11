import { NgModule } from '@angular/core';
import { BitpocketCurrencyPipe } from './bitpocket-currency';

@NgModule({
  declarations: [BitpocketCurrencyPipe],
  exports: [BitpocketCurrencyPipe]
})
export class BitpocketCurrencyPipeModule {}