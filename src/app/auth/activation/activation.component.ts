import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {
  activationForm = this.fb.group({
    email: [{ value: '', disabled: true }, Validators.required],
    otp: ['', Validators.required]
  });

  loading = false;
  resending = false;
  errorMessages: string[] = [];
  successMessage = '';
  cooldownSeconds = 60; // 1 minute
currentCooldown = 0;
cooldownInterval: any;

startResendCooldown() {
  this.currentCooldown = this.cooldownSeconds;

  this.cooldownInterval = setInterval(() => {
    this.currentCooldown--;
    if (this.currentCooldown === 0) {
      clearInterval(this.cooldownInterval);
    }
  }, 1000);
}
  constructor(private fb: FormBuilder, private http: HttpClient,
  private route: ActivatedRoute,private router: Router) {}

  ngOnInit(): void {
    this.errorMessages = [];
  this.route.queryParams.subscribe(params => {
    const email = params['email'];
    if (email) {
      this.activationForm.get('email')?.setValue(email);
    }
  });
}


  activateAccount() {
    if (this.activationForm.invalid) return;

    this.loading = true;
    this.errorMessages = [];
    this.successMessage = '';

    const payload = {
      email: this.activationForm.get('email')?.value,
      otp: this.activationForm.get('otp')?.value
    };

    this.http.post(`${environment.apiBaseUrl}/auth/activate`, payload).subscribe({
      next: () => {
        this.successMessage = 'Account activated successfully!';
        this.loading = false;
        setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 3000); 
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

  resendOtp() {
  this.resending = true;
  this.successMessage = '';
  this.errorMessages = [];

  const email = this.activationForm.get('email')?.value;

  this.http.post(`${environment.apiBaseUrl}/auth/resend-otp`, { email }).subscribe({
    next: () => {
      this.successMessage = 'OTP resent successfully!';
      this.resending = false;
      this.startResendCooldown(); // ⏱️ تشغيل المؤقت
    },
    error: (err) => {
      this.resending = false;

      if (err.error?.message) {
        this.errorMessages = [err.error.message];

        if (err.error.message === 'Account is already activated') {
          this.successMessage = 'You can now log in.';
        }
      } else {
        this.errorMessages = ['Failed to resend OTP. Try again.'];
      }
    }
  });
}

}
