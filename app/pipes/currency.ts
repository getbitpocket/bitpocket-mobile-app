import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'bitpocketCurrency'
})
export class CurrencyPipe implements PipeTransform {
    transform(value, [separator=".",thousandsDelimiter=",",precision=2,symbol=""]) : string {
                 
        symbol = symbol === "" ? "" : (symbol + " ");
                 
        let n:any = value, 
            c = isNaN(precision = Math.abs(precision)) ? 2 : precision, 
            d = separator == undefined ? "." : separator, 
            t = thousandsDelimiter == undefined ? "," : thousandsDelimiter, 
            s = value < 0 ? "-" : "", 
            i:any = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
            j = (i.length) > 3 ? i.length % 3 : 0;
            
        return symbol + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""); 
         
    }
}