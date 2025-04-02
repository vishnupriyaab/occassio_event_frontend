import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee, ShowProfile } from '../../../core/models/IEmployee';
import { ProfileService } from '../../../core/services/employee/profileService/profile.service';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { emailFormatValidator, mobileNumberValidator, noAllSpacesValidator, passwordMatchValidator } from '../../../shared/validator/formValidator';
import IToastOption from '../../../core/models/IToastOptions';

@Component({
  selector: 'app-e-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './e-dashboard.component.html',
  styleUrl: './e-dashboard.component.css',
})
export class EDashboardComponent implements OnInit {
  employeeProfile: ShowProfile | undefined;
  editForm!: FormGroup;
  imagePreview = 'employee.png';
  isProfileModalOpen = false;
  isImgModalOpen = false;
  selectedImage: File | null = null;

  private _emplProfileService = inject(ProfileService);
  private _toastService = inject(ToastService);

  constructor(private _fb: FormBuilder) {
    this.editForm = this._fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(3), noAllSpacesValidator()]],
        email: ['', [Validators.required, noAllSpacesValidator(), emailFormatValidator()]],
        phone: ['', [Validators.required, mobileNumberValidator()]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this._emplProfileService.showProfile().subscribe({
      next: response => {
        console.log(response, '123456789');
        this.employeeProfile = response.data;
        this.imagePreview = this.employeeProfile?.imageUrl || 'user.png';
        this.editForm.patchValue({
          name: this.employeeProfile?.name,
          email: this.employeeProfile?.email,
          phone: this.employeeProfile?.phone,
        });
      },
      error: error => {
        console.error(error);
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Failed to fetch Employee profile.',
        };
        this._toastService.showToast(toastOption);
      },
    });
  }

  isProfileModal() {
    this.isProfileModalOpen = !this.isProfileModalOpen;
  }

  imgModal() {
    this.isImgModalOpen = !this.isImgModalOpen;
  }

  previewImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      console.log(this.selectedImage, 'wertyu');
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfileImage(): void {
    if (this.selectedImage) {
      const formData = new FormData();
      formData.append('img', this.selectedImage);
      console.log(formData, '12345678');
      this._emplProfileService.updateProfileImage(formData).subscribe({
        next: response => {
          console.log(response, 'res');
          const toastOption: IToastOption = {
            severity: 'success-toast',
            summary: 'Success',
            detail: 'Profile picture updated successfully.',
          };
          this._toastService.showToast(toastOption);
          this.loadProfile();
          this.isImgModalOpen = false;
          this.isProfileModalOpen = false;
        },
        error: error => {
          const toastOption: IToastOption = {
            severity: 'danger-toast',
            summary: 'Error',
            detail: 'Failed to update profile picture.',
          };
          this._toastService.showToast(toastOption);
        },
      });
    }
  }

  updateProfile(): void {
    if (this.editForm.valid) {
      const formData = this.editForm.value;
      this._emplProfileService.updateProfile(formData).subscribe({
        next: response => {
          console.log(response, 'responseee');
          const toastOption: IToastOption = {
            severity: 'success-toast',
            summary: 'Success',
            detail: 'Profile updated successfully.',
          };
          this._toastService.showToast(toastOption);
          this.loadProfile();
          this.isProfileModalOpen = false;
        },
        error: error => {
          const toastOption: IToastOption = {
            severity: 'danger-toast',
            summary: 'Error',
            detail: 'Failed to update picture.',
          };
          this._toastService.showToast(toastOption);
        },
      });
    }
  }
}
