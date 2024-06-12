import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { CenterDirective } from '../../directives/center/center.directive';
import { GridContentDirective } from '../../directives/grid-content/grid-content.directive';

@Component({
  selector: 'sudoku',
  standalone: true,
  imports: [GridComponent, CenterDirective, GridContentDirective],
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.scss'
})
export class SudokuComponent implements OnInit, AfterViewInit {
  @Input() rows: number;
  @Input() cols: number;

  outerRowGrid: number;
  outerColGrid: number;
  innerRowGrid: number;
  innerColGrid: number;

  arr: number[][];
  possibleNumbers: number[];

  constructor(
    private elementRef: ElementRef, 
    private renderer: Renderer2) {
    this.arr = []
    this.rows = 1;
    this.cols = 1;

    this.outerRowGrid = 1;
    this.outerColGrid = 1;
    this.innerRowGrid = 1;
    this.innerColGrid = 1;

    this.possibleNumbers = [];
  }

  ngOnInit(): void {
    const cells = this.rows * this.cols;

    this.outerRowGrid = cells !== this.rows ? cells / this.rows : cells;
    this.outerColGrid = cells !== this.cols ? cells / this.cols : cells;
    this.innerRowGrid = cells / this.outerRowGrid;
    this.innerColGrid = cells / this.outerColGrid;
  }

  ngAfterViewInit(): void {
    let all: boolean = false;

    if (this.outerRowGrid * this.outerColGrid === 1)
      all = true;

    let prevNumber = 0;
    this.elementRef.nativeElement.querySelectorAll('.inner-container').forEach((e: HTMLElement, i: number, array: Array<HTMLElement>) => {
      if (all) {
        this.addClass(e, 'top-left-corner', 0);
        this.addClass(e, 'top-right-corner', 0);
        this.addClass(e, 'bottom-left-corner', 0);
        this.addClass(e, 'bottom-right-corner', 0);

        return;
      }

      if (i > 0 && (i === 1 || i !== prevNumber + 1)) { // Salvo el 1, los siguientes elementos no son consecutivos. Cada elemento es el siguiente índice más uno
        prevNumber = i;
        let className = '';
        let index = 0;
        
        switch (i) {
          case 1: 
            className = 'top-left-corner';
            index = 0;
            break;
          case this.outerColGrid + (this.outerColGrid - 1):
            className = 'top-right-corner';
            index = this.innerColGrid - 1;
            break;
          case (array.length - 1) - ((this.outerColGrid - 1) * 2): // Offset de 2
            className = 'bottom-left-corner';
            index = (this.innerRowGrid * this.innerColGrid) - this.innerColGrid;
            break;
          case array.length - 1:
            className = 'bottom-right-corner';
            index = (this.innerRowGrid * this.innerColGrid) - 1;
            break;
        }

        if (className.length > 0)
          this.addClass(e, className, index);
      }
    })
  }

  addClass(e: HTMLElement, className: string, index: number) {
    this.renderer.addClass(e, className);
    this.renderer.addClass(e.querySelectorAll('input')[index], className);
  }
}
