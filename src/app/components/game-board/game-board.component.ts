import { Component } from '@angular/core';
import { SudokuComponent } from '../sudoku/sudoku.component';
import { EdgeButtonComponent } from '../edge-button/edge-button.component';
import { DirectionDirective } from '../../directives/direction/direction.directive';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [SudokuComponent, EdgeButtonComponent, DirectionDirective],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {

  rows: number = 1;
  cols: number = 1;

  maxLimit: number;
  minLimit: number;

  constructor() {
    this.maxLimit = 3;
    this.minLimit = 1;
  }

  add(type: string): void {
    switch (type) {
      case 'row':
        if (this.rows < this.maxLimit)
          this.rows++;
        break;
      case 'col':
        if (this.cols < this.maxLimit)
          this.cols++;
        break;
    }
  }

  remove(type: string): void {
    switch (type) {
      case 'row':
        if (this.rows > this.minLimit)
          this.rows--;
        break;
      case 'col':
        if (this.cols > this.minLimit)
          this.cols--;
        break;
    }
  }
}
