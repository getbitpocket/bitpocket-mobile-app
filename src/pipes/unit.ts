import { BitcoinUnit } from './../providers/currency/bitcoin-unit';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'bitpocketUnit'
})
export class BitpocketUnitPipe implements PipeTransform {
    transform(value:any, from="BTC", to="BTC") : number {
        return BitcoinUnit.from(parseFloat(value), from).to(to);
    }
}