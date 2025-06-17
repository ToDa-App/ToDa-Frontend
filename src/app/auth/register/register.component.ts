import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  fieldErrors: { [key: string]: string } = {};
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) { }

  registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      this.passwordStrengthValidator
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }
  isPasswordWeak(): boolean {
    const value = this.password?.value || '';
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
    return value !== '' && !pattern.test(value);
  }


  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
    if (value && !pattern.test(value)) {
      return {
        passwordStrength: {
          message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, 1 special character, and be at least 8 characters long'
        }
      };
    }
    return null;
  }

  submit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.errorMessages = [];
    this.fieldErrors = {};

    this.http.post(`${environment.apiBaseUrl}/auth/register`, this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        alert('Registration successful! Please check your email for the OTP.');
        this.router.navigate(['/auth/activate'], {
          queryParams: { email: this.registerForm.value.email }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessages = [];
        this.fieldErrors = {};

        if (err.status === 400 && err.error?.errors) {
          this.fieldErrors = err.error.errors;
        } else if (err.error?.message) {
          this.errorMessages.push(err.error.message);
        } else {
          this.errorMessages.push('An unexpected error occurred. Please try again.');
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}
