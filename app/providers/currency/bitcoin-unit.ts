export class BitcoinUnit {
    
    private bitcoinValue: number = 0;
    
    set value(value: number) {
        this.bitcoinValue = value;
    }
    
    constructor(value: number) {
        this.bitcoinValue = value;
    }
    
    static fromBitcoin(value: number) : BitcoinUnit {
        return new BitcoinUnit(parseFloat(value.toFixed(8)));
    }
    
    static fromFiat(fiatValue: number, exchangeRate: number) : BitcoinUnit {
        return new BitcoinUnit(parseFloat((fiatValue / exchangeRate).toFixed(8)));
    }
    
    toBitcoin() : number {
        return this.bitcoinValue;
    }   
    
    toSatoshis() : number {
        return parseInt((this.bitcoinValue * 1e8).toFixed(0));
    }
    
}