import { AfterViewInit, Component, ElementRef, Input, EventEmitter, Optional, Output, Renderer2, ViewChild, HostListener } from '@angular/core';
import { DirectionDirective } from '../../directives/direction/direction.directive';

@Component({
  selector: 'edge-button',
  standalone: true,
  imports: [DirectionDirective],
  templateUrl: './edge-button.component.html',
  styleUrl: './edge-button.component.scss'
})
export class EdgeButtonComponent implements AfterViewInit {
  @ViewChild('box') box!: ElementRef;

  @Input() label: string;
  @Input() key: string;
  @Input() disabled: boolean;
  @Input() tooltip: string;

  @Output() event = new EventEmitter<void>();

  constructor(private renderer: Renderer2, private directive: DirectionDirective) { 
    this.label = '';
    this.key = '';
    this.disabled = false;
    this.tooltip = '';
  }
  
  @HostListener('click', ['$event'])
  handleClick(): void {
    this.event.emit();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(keyboardEvent: KeyboardEvent) {
    if (!this.disabled && keyboardEvent.key === this.key)
      this.event.emit();
  }

  ngAfterViewInit(): void {
    this.setStyle('box');
    
    if (this.directive)
      this.setStyle(this.directive.getSelectors()[0])
  }

  setStyle(className: string) {
    this.renderer.addClass(this.box.nativeElement, className);
  }
}
