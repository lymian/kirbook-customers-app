import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Libro } from '../models/libro.model';

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  private baseUrl = 'https://kirbook.api.lymian.xyz/libros';

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
