import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
      console.warn('No valid token found.');
    }
  }
}
