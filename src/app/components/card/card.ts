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
  // nueva url de la imagen: https://firebasestorage.googleapis.com/v0/b/kirbook.firebasestorage.app/o/3.png?alt=media
  getImagen(): string {
    return `https://firebasestorage.googleapis.com/v0/b/kirbook.firebasestorage.app/o/${this.libro.id}.png?alt=media`;
  }

  /** Manejar error de imagen */
  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/default.png';
  }
}
