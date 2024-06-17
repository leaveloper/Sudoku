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

  private emptyCells: number;
  private possibleCells: [number, number][];

  constructor() {
    this.rows = 1;
    this.cols = 1;

    this.arr = [];
    this.possibleNumbers = [];

    this.emptyCells = 0;
    this.possibleCells = [];
  }

  setSize(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
  }

  private initialize() {
    this.arr = [];
    let arrLength: number = this.rows * this.cols;
    for (let i = 0; i < arrLength; i++) {
      this.arr[i] = Array.from(Array(arrLength), () => 0);
    }

    const minEmptyCells = Math.floor(Math.log10(arrLength) * arrLength + arrLength);
    const maxEmptyCells = Math.floor(minEmptyCells / 2);

    this.emptyCells = getRandomRange(minEmptyCells, maxEmptyCells);
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

  generate() {
    this.initialize();
    this.fillPossibleNumbers();
    this.fillPossibleCells();

    this.arr = this.solve(this.arr);

    let arr: number[][] = [];
    let done = false;
    while (!done) {
      arr = structuredClone(this.arr);
      done = this.removeCells(arr);
    }

    return arr;
  }

  //#region Solve
  private solve(arr: number[][], row: number = 0, col: number = 0): number[][] {
    const emptyCell: number[] = this.getEmptyCell(arr, row, col);
    if (emptyCell.length === 0)
      return arr;

    row = emptyCell[0];
    col = emptyCell[1];

    let number = this.getNumber();
    const list: number[] = [];

    while (number !== 0) {
      if (this.checkLocation(arr, row, col, number)) {
        arr[row][col] = number;

        if (this.solve(arr, row, col + 1).length > 0)
          return arr;

        arr[row][col] = 0;
      }

      list.push(number);

      number = this.getNumber(this.possibleNumbers.filter(n => !list.includes(n)));
    }

    return [];
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
    const emptyCellsList = this.getEmptyCells(arr);
    if (emptyCellsList.length === this.emptyCells)
      return true;

    const cells: [number, number] = this.getCell(emptyCellsList);
    const number: number = arr[cells[0]][cells[1]];

    if (this.solve(arr).length > 0) {
      if (arr.toString() === this.arr.toString()) {
        for (const cell of emptyCellsList) {
          arr[cell[0]][cell[1]] = 0;
        }

        arr[cells[0]][cells[1]] = 0;

        return this.removeCells(arr);
      }

      return false;
    }

    arr[cells[0]][cells[1]] = number;

    return false;
  }

  private getEmptyCells(arr: number[][]) {
    const list: [number, number][] = [];

    for (let row = 0; row < arr.length; row++) {
      for (let col = 0; col < arr.length; col++) {
        if (arr[row][col] === 0)
          list.push([row, col])
      }
    }

    return list;
  }

  private getCell(list?: [number, number][]) {
    const newList: [number, number][] = this.possibleCells.filter(n => !list?.includes(n))

    let index: number = Math.floor(Math.random() * newList.length);
    return newList[index];
  }
  //#endregion
}
