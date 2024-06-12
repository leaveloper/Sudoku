import { AfterContentInit, AfterViewInit, Component, ContentChild, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { generateRange } from '../../utils'
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { GridContentDirective } from '../../directives/grid-content/grid-content.directive';

@Component({
  selector: 'grid',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit, AfterViewInit, AfterContentInit  {
  @Input() rows: number;
  @Input() cols: number;
  @Input() cells: number;

  @ViewChildren('content') elements!: QueryList<ElementRef>;

  @ContentChild(GridContentDirective) contentTemplate!: GridContentDirective;

  rangeRows: number[];
  rangeCols: number[];

  gridContainerTemplateRows: string;
  gridContainerTemplateCols: string;

  constructor () {
    this.rows = 1;
    this.cols = 1;
    this.cells = 1;

    this.rangeRows = [];
    this.rangeCols = [];

    this.gridContainerTemplateRows = '';
    this.gridContainerTemplateCols = '';
  }

  ngOnInit(): void {
    this.rangeRows = generateRange(0, this.rows);
    this.rangeCols = generateRange(0, this.cols);

    this.setGridContainerTemplates();
  }

  ngAfterViewInit(): void {
    // this.elements.forEach(element => {
    //   const el = element.nativeElement.previousElementSibling;
    //   el.classList.add('box')
    // });
  }

  ngAfterContentInit(): void {
  }

  setGridContainerTemplates() {
    this.gridContainerTemplateRows = `repeat(${this.rows}, 1fr)`;
    this.gridContainerTemplateCols = `repeat(${this.cols}, 1fr)`;
  }
}
