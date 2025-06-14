import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm = this.fb.group({
    email: this.fb.control({ value: '', disabled: true }, [Validators.required, Validators.email]),
    resetCode: ['', Validators.required],
    newPassword: ['', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$'
      )
    ]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });
  errorMessages: string[] = [];
  successMessage: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    const emailFromUrl = this.route.snapshot.queryParamMap.get('email');
    if (emailFromUrl) {
      this.resetForm.get('email')?.setValue(emailFromUrl);
    }
  }

  submit() {
    if (this.resetForm.invalid) return;

    this.loading = true;
    this.errorMessages = [];
    this.successMessage = '';

    const payload = {
      email: this.resetForm.get('email')?.value,
      resetCode: this.resetForm.get('resetCode')?.value,
      newPassword: this.resetForm.get('newPassword')?.value,
      confirmPassword: this.resetForm.get('confirmPassword')?.value
    };

    this.http.post(`${environment.apiBaseUrl}/user/reset-password`, payload).subscribe({
      next: () => {
        this.successMessage = 'you changed your password successfully';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 400 && err.error?.errors) {
          this.errorMessages = Object.values(err.error.errors);
        } else if (err.error?.message) {
          this.errorMessages = [err.error.message];
        } else {
          this.errorMessages = ['Something went wrong. Try again.'];
        }
      }
    });
  }
}
