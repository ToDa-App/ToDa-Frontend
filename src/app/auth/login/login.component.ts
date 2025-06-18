import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  errorMessages: string[] = [];
  fieldErrors: { [key: string]: string } = {};
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessages = [];
      this.fieldErrors = {};
    });
  }

  submit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessages = [];
    this.fieldErrors = {};
    this.http.post(`${environment.apiBaseUrl}/auth/login`, this.loginForm.value).subscribe({
      next: (res: any) => {
        this.loading = false;
        const token = res.data.token;
        const refreshToken = res.data.refreshToken;
        if (token && refreshToken) {
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          setTimeout(() => {
            this.router.navigate(['/dashboard'], { replaceUrl: true });
          }, 100);
        } else { this.errorMessages.push('Login failed: Missing tokens.'); }
      },
      error: (err) => {
        this.loading = false;
        const error = err.error;
        this.errorMessages = [];
        this.fieldErrors = error?.errors || {};
        if (error?.message && !this.isFieldError(error.message)) {
          this.errorMessages.push(error.message);
        }
        if (!error?.message && !error?.errors) {
          this.errorMessages.push('An unexpected error occurred. Please try again.');
        }
      }
    });
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  private isFieldError(message: string): boolean {
    return Object.values(this.fieldErrors).includes(message);
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
