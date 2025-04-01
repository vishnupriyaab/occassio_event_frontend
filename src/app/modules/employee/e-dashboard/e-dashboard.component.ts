import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Employee } from '../../../core/models/IEmployee';
import { ProfileService } from '../../../core/services/employee/profileService/profile.service';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { emailFormatValidator, mobileNumberValidator, noAllSpacesValidator, passwordMatchValidator } from '../../../shared/validator/formValidator';

@Component({
  selector: 'app-e-dashboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './e-dashboard.component.html',
  styleUrl: './e-dashboard.component.css'
})
export class EDashboardComponent {

  employeeProfile: Employee | undefined;
    editForm!: FormGroup;
    imagePreview: string = 'employee.png';
    isProfileModalOpen: boolean = false;
    isImgModalOpen: boolean = false;
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
        error: error => console.error(error),
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
            this._toastService.showToast({
              severity: 'success-toast',
              summary: 'Success',
              detail: 'Profile picture updated successfully',
            });
            this.loadProfile();
            this.isImgModalOpen = false;
            this.isProfileModalOpen = false;
          },
          error: error => {
            this._toastService.showToast({
              severity: 'danger-toast',
              summary: 'Error',
              detail: error.error.message || 'Failed to update profile picture',
            });
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
            this._toastService.showToast({
              severity: 'success-toast',
              summary: 'Success',
              detail: 'Profile updated successfully',
            });
            this.loadProfile();
            this.isProfileModalOpen = false;
          },
          error: error => {
            this._toastService.showToast({
              severity: 'danger-toast',
              summary: 'Error',
              detail: error.error.message || 'Failed to update profile',
            });
          },
        });
      }
    }

}
