import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Libro } from '../models/libro.model';
import { Categoria } from '../models/categoria.model';


@Injectable({
  providedIn: 'root',
})
export class LibroService {
  private baseUrl = 'https://kirbook.api.lymian.xyz/libros';
  private categoriasUrl = 'https://kirbook.api.lymian.xyz/categorias';


  constructor(private http: HttpClient) { }

  /** Obtener todos los libros activos */
  obtenerLibrosActivos(): Observable<Libro[]> {
    return this.http
      .get<Libro[]>(`${this.baseUrl}/estado/true`)
      .pipe(catchError(this.manejarError));
  }

  /** Obtener un libro por su ID */
  obtenerLibroPorId(id: number): Observable<Libro> {
    return this.http
      .get<Libro>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.manejarError));
  }

  /** Obtener todas las categorías */
  obtenerCategorias(): Observable<Categoria[]> {
    return this.http
      .get<Categoria[]>(this.categoriasUrl)
      .pipe(catchError(this.manejarError));
  }

  /** Obtener libros por categoría */
  obtenerLibrosPorCategoria(id: number): Observable<Libro[]> {
    return this.http
      .get<Libro[]>(`${this.baseUrl}/categoria/${id}/estado/true`)
      .pipe(catchError(this.manejarError));
  }

  /** Buscar libros por frase */
  buscarLibros(frase: string): Observable<Libro[]> {
    return this.http
      .get<Libro[]>(`${this.baseUrl}/buscar?frase=${frase}&estado=true`)
      .pipe(catchError(this.manejarError));
  }


  /** Manejo de errores */
  private manejarError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      console.error('Error del cliente:', error.error.message);
    } else {
      // Error del servidor
      console.error(
        `Error del servidor: ${error.status}, ` + `mensaje: ${error.error?.error || error.message}`
      );
    }
    return throwError(() => new Error('Error en la solicitud HTTP'));
  }
}
