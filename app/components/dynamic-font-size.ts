import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[dynamicFontSize]' })
export class DynamicFontSize {
    
    @Input() dynamicText: string = "";    
    @Input() breakPoint: number = 7;
    @Input() maxSize: boolean = false;
    
    el: HTMLElement;
    maxFontSize = 0;

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
    }

    ngOnChanges() {
        if (this.el && this.el.parentElement && this.el.parentElement.parentElement) {
            this.maxFontSize = this.el.parentElement.parentElement.clientHeight * (this.maxSize ? 1 : 0.55);            
        }
        console.log("geht");
        let textLength = this.dynamicText.length;
        let shrinkValue = this.maxFontSize * (1/this.breakPoint) * (textLength-this.breakPoint);

        if (this.maxFontSize > 0) {
            console.log(textLength, this.breakPoint, this.maxFontSize, shrinkValue);
            this.el.style.fontSize = (textLength > this.breakPoint ? (this.maxFontSize - shrinkValue) : this.maxFontSize) + 'px';
        }
    }
}