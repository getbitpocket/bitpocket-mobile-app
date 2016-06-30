import { Directive, ElementRef, Input } from '@angular/core';

@Directive({ selector: '[dynamicFontSize]' })
export class DynamicFontSize {

    @Input() dynamicText: string;
    @Input() maxSize: boolean = false;

    private el: HTMLElement;
    private currentFontSize: number = 0;

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
    }

    calculateFontSize(text:string, element:HTMLElement, parent:HTMLElement, maxSize:boolean = false) {
        let maxFontSize;
        if (parent.clientHeight > 0) {
            maxFontSize = parent.clientHeight;
            if (!maxSize) {
                maxFontSize *= 0.55;
            }
        }

        if (this.currentFontSize <= 0 && element.clientWidth > 0) {
            this.currentFontSize = parent.clientHeight;
            if (!maxSize) {
                this.currentFontSize *= 0.55;
            }
        }
                
        let relativeSizeDifference = parent.clientWidth / element.clientWidth;
        if (relativeSizeDifference < 1.2) {
            this.currentFontSize *= 0.9;
            this.el.style.fontSize = this.currentFontSize + "px";
        } 
    }

    ngOnChanges() {
        this.calculateFontSize(this.dynamicText, this.el, this.el.parentElement.parentElement, this.maxSize);        
    }
}