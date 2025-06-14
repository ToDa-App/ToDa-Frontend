import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    if (token && token.split('.').length === 3) {
      return true;
    }
    console.warn('No valid token found.Login first');
    this.router.navigate(['/auth/login']);
    return false;
  }
}
