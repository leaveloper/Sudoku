import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { generateRange } from '../../utils'
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { GridContentDirective } from '../../directives/grid-content/grid-content.directive';

@Component({
  selector: 'grid',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit {
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
    this.initialize();
  }

  ngOnChanges(): void {
    this.initialize();
  }

  initialize() {
    this.rangeRows = generateRange(0, this.rows);
    this.rangeCols = generateRange(0, this.cols);

    this.setGridContainerTemplates();
  }

  setGridContainerTemplates() {
    this.gridContainerTemplateRows = `repeat(${this.rows}, 1fr)`;
    this.gridContainerTemplateCols = `repeat(${this.cols}, 1fr)`;
  }
}
