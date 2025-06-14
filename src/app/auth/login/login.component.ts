import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessages: string[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessages = [];

    this.http.post(`${environment.apiBaseUrl}/auth/login`, this.loginForm.value).subscribe({
      next: (res: any) => {
        const token = res.data.token;
        const refreshToken = res.data.refreshToken;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 400 && err.error?.errors) {
          this.errorMessages = Object.values(err.error.errors);
        } else if (err.error?.message) {
          this.errorMessages = [err.error.message];
        } else {
          this.errorMessages = ['Login failed. Please try again.'];
        }
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
