import { Directive, ElementRef, Input, Renderer } from '@angular/core';

@Directive({ selector: '[dynamicFontSize]' })
export class DynamicFontSize {
        
    @Input() maxFontSize:any;
    @Input() minFontSize:any;    
    @Input() content:string = "";

    constructor(private el: ElementRef, private renderer: Renderer) {
        this.el.nativeElement.style.fontSize = this.maxFontSize + "px";
    }

    calculateFontSize() {
        let childWidth     = this.el.nativeElement.clientWidth;
        let parentWidth    = this.el.nativeElement.parentElement.clientWidth; 
        let fontSize       = parseInt(this.el.nativeElement.style.fontSize) || parseInt(this.maxFontSize);
        let calculatedSize = (fontSize * ((parentWidth/childWidth)-0.1));

        if (calculatedSize < parseInt(this.maxFontSize) && calculatedSize > parseInt(this.minFontSize)) {
            this.el.nativeElement.style.fontSize = calculatedSize + "px";
            childWidth = this.el.nativeElement.clientWidth + 20;

            if (childWidth >= parentWidth) {
                setTimeout(() => {
                    this.calculateFontSize();
                },0);                             
            }
        }
    }

    ngAfterViewInit() {      
        setTimeout(() => {
            this.calculateFontSize();
        },50);          
    }    
    
    ngOnChanges() {
        this.calculateFontSize();
    }
}
