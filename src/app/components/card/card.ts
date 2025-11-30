import { Component, Input } from '@angular/core';
import { Libro } from '../../models/libro.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card.html',
  styleUrls: ['./card.css'],
})
export class CardComponent {
  @Input() libro!: Libro;

  /** Devuelve la URL de la imagen, o default si no existe */
  getImagen(): string {
    return `http://localhost:8080/${this.libro.id}.png`;
  }

  /** Manejar error de imagen */
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default.png';
  }
}
