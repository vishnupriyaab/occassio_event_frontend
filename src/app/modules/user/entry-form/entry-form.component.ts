import { Component, inject } from '@angular/core';
import { FooterComponent } from '../../../shared/components/user/footer/footer.component';
import { NavBar2Component } from '../../../shared/components/user/nav-bar2/nav-bar2.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  dateRangeValidator,
  mobileNumberValidator,
  noAllSpacesValidator,
  pincodeValidator,
  startDateValidator,
} from '../../../shared/validator/formValidator';
import { FormSubmitService } from '../../../core/services/users/form/form-submit.service';
import IToastOption from '../../../core/models/IToastOptions';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [FooterComponent, NavBar2Component, CommonModule, ReactiveFormsModule],
  providers: [FormSubmitService],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css',
})
export class EntryFormComponent {
  step = 1;
  step1Form: FormGroup;
  step2Form: FormGroup;

  foodItems = ['welcomeDrink', 'starters', 'mainCourse', 'dessert'];
  selectedFoods: Record<string, boolean> = {};
  private _toastService = inject(ToastService);
  private router = inject(Router); 
  constructor(
    private fb: FormBuilder,
    private _entryFormReg: FormSubmitService
  ) {
    this.step1Form = this.fb.group(
      {
        name: new FormControl('', {
          validators: [Validators.required, noAllSpacesValidator()],
          updateOn: 'change',
        }),
        email: new FormControl('', {
          validators: [Validators.required, Validators.email],
          updateOn: 'change',
        }),
        phone: new FormControl('', {
          validators: [Validators.required, mobileNumberValidator()],
          updateOn: 'change',
        }),
        eventName: new FormControl('', {
          validators: [Validators.required, noAllSpacesValidator()],
          updateOn: 'change',
        }),
        startDate: ['', [Validators.required, startDateValidator()]],
        endDate: ['', [Validators.required]],
        district: new FormControl('', {
          validators: [Validators.required, noAllSpacesValidator()],
          updateOn: 'change',
        }),
        state: new FormControl('', {
          validators: [Validators.required, noAllSpacesValidator()],
          updateOn: 'change',
        }),
        pincode: new FormControl('', {
          validators: [Validators.required, pincodeValidator()],
          updateOn: 'change',
        }),
      },
      { validators: dateRangeValidator(), updateOn: 'change' }
    );

    this.step2Form = this.fb.group(
      {
        guestCount: ['', Validators.required],
        venue: ['', [Validators.required, noAllSpacesValidator()]],
        decoration: [false],
        sound: [false],
        seating: [false],
        photography: [false],
        foodOptions: this.fb.group({
          welcomeDrink: [false],
          starters: [false],
          mainCourse: [false],
          dessert: [false],
        }),
      },
      { updateOn: 'change' }
    );
  }

  toggleFoodSelection(food: string) {
    const foodOptions = this.step2Form.get('foodOptions') as FormGroup;
    const currentValue = foodOptions.get(food)?.value;
    foodOptions.patchValue({ [food]: !currentValue });
  }

  nextStep() {
    if (this.step === 1) {
      if (this.step1Form.valid) {
        this.step = 2;
      } else {
        this.step1Form.markAllAsTouched();
      }
    } else if (this.step === 2) {
      if (this.step2Form.valid) {
        this.onSubmit();
      } else {
        this.step2Form.markAllAsTouched();
      }
    }
  }

  prevStep() {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  onSubmit() {
    if (this.step1Form.valid && this.step2Form.valid) {
      const formData = {
        ...this.step1Form.value,
        ...this.step2Form.value,
      };
      this._entryFormReg.entryRegistration(formData).subscribe({
        next: response => {
          console.log(response, 'res'); //here i got email id
          if (response.success) {
            const toastOption: IToastOption = {
              severity: 'success-toast',
              summary: 'Success',
              detail: 'Entry form submitted!',
            };
            this._toastService.showToast(toastOption);
            this.router.navigate(['/entry-success']); //here i want to pass email id into next page
          }
        },
        error: error => {
          console.log(error);
        },
      });
    }
  }
}
