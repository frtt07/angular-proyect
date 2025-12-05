import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    // Obtener el token de la sesión activa
    const user = this.securityService.activeUserSession;
    
    // Si hay token, agregarlo al header
    if (user && user.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`
        }
      });
    }
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si el error es 401 (no autorizado), cerrar sesión
        if (error.status === 401) {
          this.securityService.logout();
          this.router.navigate(['/login']);
        }
        
        return throwError(() => error);
      })
    );
  }
}
