import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[center]',
  standalone: true,
})
export class CenterDirective implements OnInit {
  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    const css = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    `;
    this.elementRef.nativeElement.setAttribute("style", css);
  }
}
