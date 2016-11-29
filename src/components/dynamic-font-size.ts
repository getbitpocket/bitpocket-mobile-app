import { Directive, ElementRef, Input, Renderer } from '@angular/core';

@Directive({ selector: '[dynamicFontSize]' })
export class DynamicFontSize {
    
    @Input() dynamicText: any;    
    @Input() breakPoint: any;
    @Input() maxSize: any;
    
    maxFontSize = 0;

    constructor(private el: ElementRef, private renderer: Renderer) {
    }

    ngOnChanges() {
        /*
        if (this.el && this.el.parentElement && this.el.parentElement.parentElement) {
            this.maxFontSize = this.el.parentElement.parentElement.clientHeight * (this.maxSize ? 1 : 0.55);            
        }
        let textLength = this.dynamicText.length;
        let shrinkValue = this.maxFontSize * (1/this.breakPoint) * (textLength-this.breakPoint);

        if (this.maxFontSize > 0) {            
            this.el.style.fontSize = (textLength > this.breakPoint ? (this.maxFontSize - shrinkValue) : this.maxFontSize) + 'px';
        }
        */
    }
}
