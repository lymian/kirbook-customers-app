import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
    const token = localStorage.getItem('token');
    const router = inject(Router);

    let authReq = req;
    const isWatsonRequest = req.url.includes('api.au-syd.assistant.watson.cloud.ibm.com');

    if (token && !isWatsonRequest) {
        authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                // Token expirado o inválido
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                router.navigate(['/store/login']);
            }
            return throwError(() => error);
        })
    );
};