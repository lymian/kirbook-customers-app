import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroService } from '../../services/libro';
import { Libro } from '../../models/libro.model';
import { ListCardComponent } from '../../components/list-card/list-card';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ListCardComponent],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css'],
})
export class Catalogo implements OnInit {
  libros: Libro[] = [];
  error: string = '';
  cargando: boolean = true;

  constructor(private libroService: LibroService) { }

  ngOnInit(): void {
    this.libroService.obtenerLibrosActivos()
      .pipe(
        catchError(err => {
          this.error = 'No se pudieron cargar los libros';
          return of([]);
        })
      )
      .subscribe((data: Libro[]) => {
        this.libros = data;
        this.cargando = false;
      });
  }
}
