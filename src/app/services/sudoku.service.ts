import { Injectable } from '@angular/core';
import { generateRange, getRandomRange } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {
  private rows: number;
  private cols: number;
  
  private arr: number[][];
  private possibleNumbers: number[];

  private notEmptyCells: number;
  private possibleCells: [number, number][];

  constructor() {
    this.rows = 1;
    this.cols = 1;

    this.arr = [];
    this.possibleNumbers = [];

    this.notEmptyCells = 0;
    this.possibleCells = [];
  }

  setSize(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;

    this.fillPossibleNumbers();
  }

  private initialize() {
    this.arr = [];
    let arrLength: number = this.rows * this.cols;
    for (let i = 0; i < arrLength; i++) {
      this.arr[i] = Array.from(Array(arrLength), () => 0);
    }

    const minNotEmptyCells = Math.floor(Math.log10(arrLength) * arrLength + arrLength);
    const minCellsToBeRemoved = Math.floor(minNotEmptyCells / 2);

    const maxNotEmptyCells = minNotEmptyCells + minCellsToBeRemoved;

    if (arrLength >= 9)
      this.notEmptyCells = getRandomRange(65, 73);
    else
    this.notEmptyCells = getRandomRange(maxNotEmptyCells, maxNotEmptyCells + minCellsToBeRemoved);

    this.fillPossibleCells();
  }

  private fillPossibleNumbers() {
    this.possibleNumbers = generateRange(1, (this.rows * this.cols) + 1);
  }

  private fillPossibleCells() {
    this.possibleCells = [];

    for (let row = 0; row < this.arr.length; row++) {
      for (let col = 0; col < this.arr.length; col++) {
        this.possibleCells.push([row, col]);
      }
    }
  }

  async generate(): Promise<number[][]> {
    this.initialize();

    this.solve(this.arr);
    
    let arr: number[][] = [];

    arr = structuredClone(this.arr);
    this.removeCells(arr);

    return arr;
  }

  //#region Solve
  private solve(arr: number[][], row: number = 0, col: number = 0): boolean {
    const emptyCell: number[] = this.getEmptyCell(arr, row, col);
    if (emptyCell.length === 0)
      return true;

    row = emptyCell[0];
    col = emptyCell[1];

    let number = this.getNumber();
    const list: number[] = [];

    while (number !== 0) {
      if (this.checkLocation(arr, row, col, number)) {
        arr[row][col] = number;

        if (this.solve(arr, row, col + 1))
          return true;

        arr[row][col] = 0;
      }

      list.push(number);

      number = this.getNumber(this.possibleNumbers.filter(n => !list.includes(n)));
    }

    return false;
  }

  private getEmptyCell(arr: number[][], row: number, col: number) {
    if (col > arr.length - 1) {
      col = 0;
      row++;
    }

    if (row > arr.length - 1)
      return [];

    for (let i = row; i < arr.length; i++) {
      const indexCol: number = arr[i].indexOf(0);
      if (i === row && col === indexCol)
        return [row, col]
      
      if (indexCol !== -1) {
        row = i;
        col = indexCol;

        return [row, col];
      }
    }
    
    return [];
  }

  private checkLocation(arr: number[][], row: number, col: number, num: number) {
    return !this.inRow(arr[row], num) && !this.inColumn(arr, col, num) && !this.inGrid(arr, row, col, num);
  }

  private inRow(row: number[], num: number) {
    return row.includes(num);
  }

  private inColumn(arr: number[][], col: number, num: number) {
    return arr.some(c => c[col] === num);
  }

  private inGrid(arr: number[][], row: number, col: number, num: number) {
    const rowVal: number = row % this.rows;
    let firstRowIndex: number = row - rowVal;
    const lastRowIndex: number = firstRowIndex + this.rows - 1;

    let matrixRow: number[]
    
    const colVal: number = col % this.cols;
    const firstColumnIndex: number = col - colVal;
    const lastColumnIndex: number = firstColumnIndex + this.cols - 1;

    while (firstRowIndex < lastRowIndex) {
      matrixRow = arr[firstRowIndex].slice(firstColumnIndex, lastColumnIndex + 1);

      if (this.inRow(matrixRow, num))
        return true;

      firstRowIndex++;
    }

    return false;
  }

  private getNumber(list?: number[]) {
    if (!list)
      list = this.possibleNumbers;

    if (list.length === 0)
      return 0;

    let index: number = Math.floor(Math.random() * this.possibleNumbers.length);
    return this.possibleNumbers[index];
  }
  //#endregion

  //#region Remove numbers
  private removeCells(arr: number[][]): boolean {
    const notEmptyCells = this.getNotEmptyCells(arr);
    if (notEmptyCells === this.notEmptyCells)
      return true;

    const cells: [number, number] = this.getCell();
    const number: number = arr[cells[0]][cells[1]];

    this.possibleCells.splice(this.possibleCells.findIndex(cell => 
      cell[0] === cells[0] && cell[1] === cells[1]), 1);

    arr[cells[0]][cells[1]] = 0;

    const newArr = structuredClone(arr);
    
    if (this.solve(newArr) && this.compareArray(newArr)) {
      if (this.removeCells(arr))
        return true;
    }

    arr[cells[0]][cells[1]] = number;
    this.possibleCells.push(cells);

    return this.removeCells(arr);
  }

  private getNotEmptyCells(arr: number[][]) {
    let notEmptyCells = 0;

    for (let row = 0; row < arr.length; row++) {
      for (let col = 0; col < arr.length; col++) {
        if (arr[row][col] !== 0)
          notEmptyCells++;
      }
    }

    return notEmptyCells;
  }

  private getCell() {
    let index: number = Math.floor(Math.random() * this.possibleCells.length);
    return this.possibleCells[index];
  }

  private compareArray(arr: number[][]) {
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = 0; j < this.arr.length; j++) {
        if (this.arr[i][j] !== arr[i][j]) {
          return false;
        }
      }
    }

    return true;
  }
  //#endregion
}
