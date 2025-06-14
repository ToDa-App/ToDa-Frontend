import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  loading = false;
  errorMessages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]]
  });

  submit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessages = [];

    this.http.post(`${environment.apiBaseUrl}/auth/register`, this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        alert('Registration successful! Please check your email for the OTP to activate your account.');
        this.router.navigate(['/auth/activate'], {
          queryParams: { email: this.registerForm.value.email }
        });
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 400 && err.error?.errors) {
          this.errorMessages = Object.values(err.error.errors);
        } else if (err.error?.message) {
          this.errorMessages = [err.error.message];
        } else {
          this.errorMessages = ['An unexpected error occurred.'];
        }
      }
    });
  }
}
