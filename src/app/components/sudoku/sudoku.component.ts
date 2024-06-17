import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { GridContentDirective } from '../../directives/grid-content/grid-content.directive';
import { SudokuService } from '../../services/sudoku.service';
import { DirectionDirective } from '../../directives/direction/direction.directive';
import { EdgeButtonComponent } from '../edge-button/edge-button.component';

@Component({
  selector: 'sudoku',
  standalone: true,
  imports: [GridComponent, GridContentDirective, DirectionDirective, EdgeButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sudoku.component.html',
  styleUrl: './sudoku.component.scss'
})
export class SudokuComponent implements OnInit, AfterViewInit {
  @Input() rows: number;
  @Input() cols: number;

  private cells: number;

  outerRowGrid: number;
  outerColGrid: number;
  innerRowGrid: number;
  innerColGrid: number;

  private arr: number[][];

  private process: boolean;

  @ViewChild('container', { static: false }) container!: GridComponent;

  constructor(
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

    this.process = false;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows'] && !changes['rows'].isFirstChange() || changes['cols'] && !changes['cols'].isFirstChange()) {
      this.initialize();
      this.process = true;
    }
  }

  ngOnInit(): void {
    this.initialize();
  }
    
  ngAfterViewInit(): void {
    this.fill();
  }

  ngAfterViewChecked(): void {
    if (this.process) {
      this.fill();
      this.process = false;
    }
  }

  initialize(): void {
    this.cells = this.rows * this.cols;
    this.outerRowGrid = this.cells !== this.rows ? this.cells / this.rows : this.cells;
    this.outerColGrid = this.cells !== this.cols ? this.cells / this.cols : this.cells;
    this.innerRowGrid = this.cells / this.outerRowGrid;
    this.innerColGrid = this.cells / this.outerColGrid;

    this.sudokuService.setSize(this.rows, this.cols);
    this.arr = this.sudokuService.generate();
    // TODO Evaluar si debería generar el arreglo inmediatamente
    // o sería mejor colocar un botón de generar
  }  

  fill() {
    this.resetStyle()

    let cellRowIndex: number = 0;
    let cellColIndex: number = 0;

    this.container.elements.forEach((el: ElementRef<HTMLElement>, i: number, array: Array<ElementRef<HTMLElement>>) => {
      const element: HTMLElement = el.nativeElement.previousElementSibling as HTMLElement;
      
      let className = '';
      let inputIndex = 0;

      switch (i) {
        case 0: 
          className = 'top-left-corner';
          inputIndex = 0;
          break;
        case this.outerColGrid - 1:
          className = 'top-right-corner';
          inputIndex = this.innerColGrid - 1;
          break;
        case (array.length - 1) - (this.outerColGrid - 1):
          className = 'bottom-left-corner';
          inputIndex = ((this.innerRowGrid * this.innerColGrid) - 1) - (this.innerColGrid - 1);
          break;
        case array.length - 1:
          className = 'bottom-right-corner';
          inputIndex = (this.innerRowGrid * this.innerColGrid) - 1;
          break;
      }

      if (className.length > 0)
        this.addClass(element, className, inputIndex);

      const prevCellColIndex = cellColIndex;
      const prevCellRowIndex = cellRowIndex;

      let counterCellColIndex = 0;
      Array.from(element.querySelectorAll('input')).forEach((ei: HTMLInputElement) => {
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

      if (this.outerRowGrid * this.outerColGrid === 1) {
        this.addClass(element, 'top-left-corner', 0);
        this.addClass(element, 'top-right-corner', 0);
        this.addClass(element, 'bottom-left-corner', 0);
        this.addClass(element, 'bottom-right-corner', 0);
        return;
      }
    })
  }

  resetStyle() {
    this.container.elements.forEach((el: ElementRef<HTMLElement>) => {
      const element: HTMLElement = el.nativeElement.previousElementSibling as HTMLElement;
      this.removeCornerClasses(element);

      Array.from(element.querySelectorAll('input')).forEach((input: HTMLInputElement) => {
        this.removeCornerClasses(input);
      });
    });
  }

  removeCornerClasses(element: HTMLElement | HTMLInputElement) {
    Array.from(element.classList).forEach(className => {
      if (className.endsWith('corner')) {
        this.renderer.removeClass(element, className);
      }
    });
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
