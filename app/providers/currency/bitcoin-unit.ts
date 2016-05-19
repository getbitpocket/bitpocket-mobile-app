const BITCOIN_UNITS = {
    'BTC'  :     [1e8,8] ,
    'mBTC' :     [1e5,5] ,
    'bits' :     [1e2,2] ,
    'satoshis' : [1,0]
};

export class BitcoinUnit {
    
    // internal representation is in satoshis
    private satoshis: number = 0;
    
    set value(value: number) {
        this.satoshis = value;
    }
    
    constructor(value: number) {
        this.satoshis = value;
    }
    
    static getUnitSpecification(bitcoinUnit: string) : Array<number> {        
        // fallback to satoshis...
        if (!BITCOIN_UNITS.hasOwnProperty(bitcoinUnit)) {
            bitcoinUnit = 'satoshis';
        }        
        return BITCOIN_UNITS[bitcoinUnit];        
    }
    
    static from(value: number, bitcoinUnit: string = 'satoshis') : BitcoinUnit {
        let unitSpec = BitcoinUnit.getUnitSpecification(bitcoinUnit);        
        return new BitcoinUnit( parseInt((value * unitSpec[0]).toFixed(0)) );
    }
    
    static fromFiat(fiatValue: number, exchangeRate: number) : BitcoinUnit {
        let valueInBTC:number = fiatValue / exchangeRate;        
        return BitcoinUnit.from(valueInBTC, 'BTC');
    }
    
    to(bitcoinUnit: string) : number {        
        let unitSpec = BitcoinUnit.getUnitSpecification(bitcoinUnit);       
        return parseFloat( (this.satoshis / unitSpec[0]).toFixed(unitSpec[1]) );
    }
    
    toFiat(exchangeRate: number, decimals: number = 2) : number {
        let btcValue = this.to('BTC');
        return parseFloat((btcValue * exchangeRate).toFixed(decimals));
    }
    
    toString() {
        return this.satoshis.toFixed(0);
    }
    
}