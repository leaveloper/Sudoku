import { Injectable } from '@angular/core';
import { generateRange } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {
  private rows: number;
  private cols: number;
  
  private arr: number[][];
  private possibleNumbers: number[];

  constructor() {
    this.rows = 1;
    this.cols = 1;

    this.arr = [];
    this.possibleNumbers = [];
  }

  setSize(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
  }

  private initialize() {
    let arrLength: number = this.rows * this.cols;
    for (let i = 0; i < arrLength; i++) {
      this.arr[i] = []
    }
  }

  private fillPossibleNumbers() {
    this.possibleNumbers = generateRange(1, (this.rows * this.cols) + 1);
  }

  private getNumber() {
    let index: number = Math.floor(Math.random() * this.possibleNumbers.length);
    return this.possibleNumbers[index];
  }

  generate() {
    this.initialize();
    this.fillPossibleNumbers();

    for (let row = 0; row < this.arr.length; row++) {
      for (let col = 0; col < this.arr.length; col++) {
        this.arr[row][col] = this.getNumber();
      }
    }
    
    return this.arr;
  }
}
