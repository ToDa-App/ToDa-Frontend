import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');
    const isLoggedIn = token && token.split('.').length === 3;
    const publicAuthPages = ['/', '/auth/login', '/auth/register', '/auth/activate', '/auth/forget-password', '/auth/reset-password'];
    if (isLoggedIn) {
      if (publicAuthPages.includes(state.url)) {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
        return false;
      }
      return true;
    }
    if (!publicAuthPages.includes(state.url)) {
      console.warn('No valid token found. Login first');
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
