import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  imagePreviewUrl: string | null = null;
  selectedImageFile: File | null = null;
  successMessage = '';
  errorMessages: string[] = [];
  loading = false;
  constructor(private fb: FormBuilder, private http: HttpClient,private router: Router) { }
  ngOnInit(): void {
    this.profileForm = this.fb.group({
      nickname: [''],
    });
    this.getProfile();
  }
  getProfile() {
    this.http.get<any>(`${environment.apiBaseUrl}/user/profile`).subscribe({
      next: (res) => {
        const data = res.data;
        this.profileForm.patchValue({ nickname: data.nickname });
        this.imagePreviewUrl = "http://localhost:8081" + res.data.profileImageUrl;
      },
      error: () => {
        this.errorMessages = ['Failed to load profile data'];
      }
    });
  }
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.imagePreviewUrl = reader.result as string);
      reader.readAsDataURL(file);
    }
  }
  updateProfile() {
    this.loading = true;
    this.successMessage = '';
    this.errorMessages = [];
    const formData = new FormData();
    formData.append('nickname', this.profileForm.get('nickname')?.value);
    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }
    this.http.put<any>(`${environment.apiBaseUrl}/user/profile`, formData).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.imagePreviewUrl = "http://localhost:8081" + res.data.profileImageUrl;
        this.loading = false;
        this.router.navigate(['/dashboard']);
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
