import { NgModule } from '@angular/core';
import { BitpocketFiatPipe } from './bitpocket-fiat';

@NgModule({
  declarations: [BitpocketFiatPipe],
  exports: [BitpocketFiatPipe]
})
export class BitpocketFiatPipeModule {}