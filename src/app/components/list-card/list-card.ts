import { Component, Input } from '@angular/core';
import { CardComponent } from '../card/card';
import { Libro } from '../../models/libro.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-card',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './list-card.html',
  styleUrls: ['./list-card.css'],
})
export class ListCardComponent {
  @Input() libros: Libro[] = [];
}
