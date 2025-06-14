import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}
  userEmail: string = '';

  ngOnInit(): void {
    const token = localStorage.getItem('accessToken');

    if (token && token.split('.').length === 3) {
      try {
        const decoded: any = jwtDecode(token);
        this.userEmail = decoded.sub || decoded.email;
        console.log('Decoded Token:', decoded);
      } catch (err) {
        console.error('Invalid token', err);
        localStorage.removeItem('accessToken');
      }
    } else {
      console.warn('No valid token found.Login first');
    }
  }
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/auth/login']);
  }
}
