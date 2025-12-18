import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibroService } from '../../services/libro';
import { Libro } from '../../models/libro.model';
import { Categoria } from '../../models/categoria.model';
import { ListCardComponent } from '../../components/list-card/list-card';

import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, ListCardComponent, FormsModule],
  templateUrl: './catalogo.html',

  styleUrls: ['./catalogo.css'],
})
export class Catalogo implements OnInit {
  libros: Libro[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionada: number | null = null;
  busqueda: string = '';
  error: string = '';

  cargando: boolean = true;

  constructor(private libroService: LibroService) { }

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarLibros();
  }

  cargarCategorias() {
    this.libroService.obtenerCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  cargarLibros() {
    this.cargando = true;
    this.error = '';
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

  filtrarPorCategoria(id: number) {
    this.cargando = true;
    this.categoriaSeleccionada = id;
    this.busqueda = ''; // Limpiar búsqueda al filtrar por categoría
    this.libroService.obtenerLibrosPorCategoria(id).subscribe({
      next: (data) => {
        this.libros = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar libros de la categoría';
        this.cargando = false;
      }
    });
  }

  buscar() {
    if (!this.busqueda.trim()) {
      this.limpiarFiltros();
      return;
    }
    this.cargando = true;
    this.categoriaSeleccionada = null; // Limpiar categoría al buscar
    this.libroService.buscarLibros(this.busqueda).subscribe({
      next: (data) => {
        this.libros = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al buscar libros';
        this.cargando = false;
      }
    });
  }

  limpiarFiltros() {
    this.categoriaSeleccionada = null;
    this.busqueda = '';
    this.cargarLibros();
  }

}
