import { Component } from '@angular/core';
import { SudokuComponent } from '../sudoku/sudoku.component';
import { EdgeButtonComponent } from '../edge-button/edge-button.component';
import { DirectionDirective } from '../../directives/direction/direction.directive';
import { GameBoardDictionary } from '../../models/game-board-dictionary';

@Component({
  selector: 'game-board',
  standalone: true,
  imports: [SudokuComponent, EdgeButtonComponent, DirectionDirective],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.scss'
})
export class GameBoardComponent {

  rows: number = 1;
  cols: number = 3;

  private maxLimit: number;
  private minLimit: number;

  disableDict: GameBoardDictionary;

  constructor() {
    this.maxLimit = 3;
    this.minLimit = 1;

    this.disableDict = {
      top: this.rows === this.minLimit,
      right: this.cols === this.maxLimit,
      bottom: this.rows === this.maxLimit,
      left: this.cols === this.minLimit
    };
  }

  add(type: string): void {
    switch (type) {
      case 'row':        
        if (this.rows < this.maxLimit) {
          this.rows = this.disableDict.bottom ? this.rows : this.rows + 1;
          this.disableDict.top = false;
        }
        
        if (this.rows === this.maxLimit)
          this.disableDict.bottom = true;

        break;
      case 'col':        
        if (this.cols < this.maxLimit) {
          this.cols = this.disableDict.right ? this.cols : this.cols + 1;
          this.disableDict.left = false;          
        }        
        
        if (this.cols === this.maxLimit)
          this.disableDict.right = true;
          
        break;
    }
  }

  remove(type: string): void {
    switch (type) {
      case 'row':        
        if (this.rows >= this.minLimit) {
          this.rows--;
          this.disableDict.bottom = false;
        }
        
        if (this.rows === this.minLimit)
          this.disableDict.top = true;

        break;
      case 'col':        
        if (this.cols >= this.minLimit) {
          this.cols--;
          this.disableDict.right = false;
        }

        if (this.cols === this.minLimit)
          this.disableDict.left = true;
        
        break;
    }
  }
}
