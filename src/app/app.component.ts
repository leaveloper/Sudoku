import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SudokuComponent } from './components/sudoku/sudoku.component';
import { CenterDirective } from './directives/center/center.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SudokuComponent, CenterDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Sudoku';
}
