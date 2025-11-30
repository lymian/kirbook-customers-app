import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from '../models/auth.model';
import { RegisterRequest } from '../models/auth.model';
import { LoginRequest } from '../models/auth.model';
import { LoginResponse } from '../models/auth.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = 'http://localhost:8080/auth';

    constructor(private http: HttpClient) { }

    /** Registro de usuario */
    register(data: RegisterRequest): Observable<Usuario> {
        return this.http.post<Usuario>(`${this.baseUrl}/register`, data)
            .pipe(catchError(this.manejarError));
    }

    /** Login */
    login(data: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data)
            .pipe(catchError(this.manejarError));
    }

    /** Manejo de errores */
    private manejarError(error: HttpErrorResponse) {
        if (error.error?.error) {
            return throwError(() => new Error(error.error.error));
        }
        return throwError(() => new Error('Error en la solicitud HTTP'));
    }
}
