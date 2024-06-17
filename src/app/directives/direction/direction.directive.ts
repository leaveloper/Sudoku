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
    const selectorList: string[] = this.getSelectors();

    switch (selectorList[0]) {
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

    if (selectorList[1]) {
      if (selectorList[0] === 'top' || selectorList[0] === 'bottom')
        this.style += this.horizontalCenteringStyle();
      else if (selectorList[0] !== 'center')
        this.style += this.vericalCenteringStyle();
    }

    this.setStyle();
  }

  getSelectors() {
    return [...selectors].filter(s => this.attrs.getNamedItem(s));
  }

  private setStyle() {
    this.elementRef.nativeElement.setAttribute("style", this.style);
  }

  private getTopStyle() {
    return `position: absolute;
    top: 0;
    `;
  }

  private getRightStyle() {
    return `position: absolute;
    right: 0;
    `;
  }

  private getBottomStyle() {
    return `position: absolute;
    bottom: 0;
    `;
  }

  private getLeftStyle() {
    return `position: absolute;
    left: 0;
    `;
  }

  private horizontalCenteringStyle() {
    return `left: 50%;
    transform: translateX(-50%)`;
  }

  private vericalCenteringStyle() {
    return `top: 50%;
    transform: translateY(-50%)`;
  }

  private getCenterStyle() {
    return `position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    `;
  }
}
