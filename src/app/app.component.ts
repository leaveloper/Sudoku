import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SudokuComponent } from './components/sudoku/sudoku.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SudokuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Sudoku';
}
