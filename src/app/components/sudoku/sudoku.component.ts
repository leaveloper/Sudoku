import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { CenterDirective } from '../../directives/center/center.directive';
import { GridContentDirective } from '../../directives/grid-content/grid-content.directive';
import { generateRange } from '../../utils'

@Component({
  selector: 'sudoku',
  standalone: true,
  imports: [GridComponent, CenterDirective, GridContentDirective],
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.scss'
})
export class SudokuComponent implements AfterViewInit {
  rowLength: number;
  colLength: number;

  outerRowGrid: number;
  outerColGrid: number;
  innerRowGrid: number;
  innerColGrid: number;

  arr: number[][];
  possibleNumbers: number[];

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.arr = []
    this.rowLength = 2;
    this.colLength = 2;

    const cells = this.rowLength * this.colLength;

    this.outerRowGrid = cells !== this.rowLength ? cells / this.rowLength : cells;
    this.outerColGrid = cells !== this.colLength ? cells / this.colLength : cells;
    this.innerRowGrid = cells / this.outerRowGrid;
    this.innerColGrid = cells / this.outerColGrid;

    this.possibleNumbers = [];
  }

  ngAfterViewInit(): void {
    let prevNumber = 0;
    this.elementRef.nativeElement.querySelectorAll('.inner-container').forEach((e: HTMLElement, i: number, array: Array<HTMLElement>) => {
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
        
        if (className.length > 0) {
          this.renderer.addClass(e, className);
          this.renderer.addClass(e.querySelectorAll('input')[index], className);
        }
      }
    })
  }
}
