import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { GridContentDirective } from '../../directives/grid-content/grid-content.directive';
import { SudokuService } from '../../services/sudoku.service';

@Component({
  selector: 'sudoku',
  standalone: true,
  imports: [GridComponent, GridContentDirective],
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.scss'
})
export class SudokuComponent implements OnInit, AfterViewInit {
  @Input() rows: number;
  @Input() cols: number;

  cells: number;

  outerRowGrid: number;
  outerColGrid: number;
  innerRowGrid: number;
  innerColGrid: number;

  arr: number[][];
  possibleNumbers: number[];

  constructor(
    private elementRef: ElementRef, 
    private renderer: Renderer2,
    private sudokuService: SudokuService) {
    this.arr = []
    this.rows = 1;
    this.cols = 1;
    this.cells = 1;
    
    this.outerRowGrid = 1;
    this.outerColGrid = 1;
    this.innerRowGrid = 1;
    this.innerColGrid = 1;
    
    this.possibleNumbers = [];
  }
    
  ngOnInit(): void {      
    this.cells = this.rows * this.cols;
    this.outerRowGrid = this.cells !== this.rows ? this.cells / this.rows : this.cells;
    this.outerColGrid = this.cells !== this.cols ? this.cells / this.cols : this.cells;
    this.innerRowGrid = this.cells / this.outerRowGrid;
    this.innerColGrid = this.cells / this.outerColGrid;

    this.sudokuService.setSize(this.rows, this.cols);
    this.arr = this.sudokuService.generate();
  }

  ngAfterViewInit(): void {
    let all: boolean = false;
    
    if (this.outerRowGrid * this.outerColGrid === 1)
      all = true;
    
    let prevNumber: number = 0;
    let countIndex: number = 0;

    let cellRowIndex: number = 0;
    let cellColIndex: number = 0;

    let topRightCornerIndex: number = this.cells / this.cols;
    if (topRightCornerIndex === 1)
      topRightCornerIndex = this.cells;

    const bottomLetCornerIndex:number = this.getNumber((this.outerRowGrid * this.outerColGrid) - this.outerColGrid);

    this.elementRef.nativeElement.querySelectorAll('.inner-container').forEach((e: HTMLElement, i: number, array: Array<HTMLElement>) => {      
      if (i > 0 && (i === 1 || i !== prevNumber + 1)) { // Salvo el 1, los siguientes elementos no son consecutivos. Cada elemento es el siguiente índice más uno        
        let inputIndex = 0;
        countIndex++;

        prevNumber = i;
        let className = '';

        switch (i) {
          case 1: 
            className = 'top-left-corner';
            inputIndex = 0;
            break;
          case topRightCornerIndex + (i - countIndex):
            className = 'top-right-corner';
            inputIndex = this.innerColGrid - 1;
            break;
          case bottomLetCornerIndex:
            className = 'bottom-left-corner';
            inputIndex = (this.innerRowGrid * this.innerColGrid) - this.innerColGrid;
            break;
          case array.length - 1:
            className = 'bottom-right-corner';
            inputIndex = (this.innerRowGrid * this.innerColGrid) - 1;
            break;
        }        

        if (className.length > 0)
          this.addClass(e, className, inputIndex);

        const prevCellColIndex = cellColIndex;
        const prevCellRowIndex = cellRowIndex;

        let counterCellColIndex = 0;

        Array.from(e.querySelectorAll('input')).forEach((ei: HTMLInputElement) => {
          ei.value = this.arr[cellRowIndex][cellColIndex].toString();

          cellColIndex++;
          counterCellColIndex++;

          if (counterCellColIndex >= this.innerColGrid){
            cellColIndex = prevCellColIndex;
            counterCellColIndex = 0;
            cellRowIndex++;
          }
        })

        cellColIndex += this.innerColGrid;
        
        if (cellColIndex >= this.cells)
          cellColIndex = 0;
        else {
            if (cellRowIndex >= this.innerRowGrid)
              cellRowIndex = prevCellRowIndex;
        }

        if (all) {
          this.addClass(e, 'top-left-corner', 0);
          this.addClass(e, 'top-right-corner', 0);
          this.addClass(e, 'bottom-left-corner', 0);
          this.addClass(e, 'bottom-right-corner', 0);
          return;
        }
      }
    })
  }

  getNumber(count: number) {
    let result = 1;
    for (let i: number = 0; i < count; i++) {
      result += 2;
    }

    return result;
  }

  addClass(e: HTMLElement, className: string, index: number) {
    this.renderer.addClass(e, className);
    this.renderer.addClass(e.querySelectorAll('input')[index], className);
  }
}
