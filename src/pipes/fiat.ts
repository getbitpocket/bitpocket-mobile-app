import { BitcoinUnit } from './../providers/currency/bitcoin-unit';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'bitpocketFiat'
})
export class BitpocketFiatPipe implements PipeTransform {

    transform(value:any, from="BTC", rate:number=0) : number {
        return  BitcoinUnit.from(parseFloat(value), from).toFiat(rate);
    }
}