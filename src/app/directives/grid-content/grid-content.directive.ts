import { AfterContentInit, Directive, ElementRef, HostBinding, OnInit, Renderer2, TemplateRef } from '@angular/core';

@Directive({
  selector: '[gridContent]',
  standalone: true,
})
export class GridContentDirective {
  constructor(public template: TemplateRef<any>) { }
}
