import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent {
  loading = false;
  errorMessages: string[] = [];
  successMessage = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) { }

  forgetForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  submit() {
    if (this.forgetForm.invalid) return;
    this.loading = true;
    this.errorMessages = [];
    this.successMessage = '';
    this.http.post(`${environment.apiBaseUrl}/user/forget-password`, this.forgetForm.value).subscribe({
      next: () => {
        this.successMessage = 'Reset code sent! Please check your email inbox.';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/auth/reset-password'], {
            queryParams: { email: this.forgetForm.value.email }
          });
        }, 3000);
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
  get email() {
  return this.forgetForm.get('email');
}

}
