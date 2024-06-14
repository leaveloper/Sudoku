import { Directive, ElementRef, OnInit } from '@angular/core';

const selectors = [
  "top", "right", "bottom", "left", "center"
]

@Directive({
  selector: '[top], [right], [bottom], [left], [center]',
  standalone: true,
})
export class DirectionDirective implements OnInit {
  readonly attrs: NamedNodeMap;
  
  private style: string;

  constructor(private elementRef: ElementRef) { 
    this.attrs = this.elementRef.nativeElement.attributes

    this.style = '';
  }

  ngOnInit(): void {    
    switch (this.getSelector()) {
      case 'top':
        this.style = this.getTopStyle();
        break;
      case 'right':
        this.style = this.getRightStyle();
        break;
      case 'bottom':
        this.style = this.getBottomStyle();
        break;
      case 'left':
        this.style = this.getLeftStyle();
        break;
      case 'center':
        this.style = this.getCenterStyle();
        break;
    }

    this.setStyle();
  }

  getSelector() {
    return [...selectors].filter(s => this.attrs.getNamedItem(s))[0];
  }

  private setStyle() {
    this.elementRef.nativeElement.setAttribute("style", this.style);
  }

  private getTopStyle() {
    return this.commonStyle() + `align-items: start;`;
  }

  private getRightStyle() {
    return this.commonStyle() + `justify-content: right;`;
  }

  private getBottomStyle() {
    return this.commonStyle() + `align-items: end;`;
  }

  private getLeftStyle() {
    return this.commonStyle() + `justify-content: left;`;
  }

  private getCenterStyle() {
    return `position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    `;
  }

  private commonStyle() {
    return `width: 100vw;
    height: 100vh;
    display: flex;`;
  }
}
