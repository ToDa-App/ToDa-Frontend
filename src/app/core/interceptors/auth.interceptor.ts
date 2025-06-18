import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpClient
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  constructor(private http: HttpClient, private router: Router) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const isProtectedRequest = !req.url.includes('/auth/login') && !req.url.includes('/auth/register') && !req.url.includes('/auth/refresh');
    let cloned = req;
    if (token && isProtectedRequest) {
      cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }
    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          const refreshToken = localStorage.getItem('refreshToken');

          if (!refreshToken) {
            this.logoutAndRedirect();
            return throwError(() => error);
          }
          return this.http.post<any>(`${environment.apiBaseUrl}/auth/refresh`, { refreshToken }).pipe(
            switchMap((res) => {
              const newAccessToken = res.data.token;
              localStorage.setItem('token', newAccessToken);
              this.isRefreshing = false;
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` }
              });
              return next.handle(retryReq);
            }),
            catchError(() => {
              this.isRefreshing = false;
              this.logoutAndRedirect();
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
  private logoutAndRedirect(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}
