import { Component } from '@angular/core';
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

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [FooterComponent, NavBar2Component, CommonModule, ReactiveFormsModule],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css',
})
export class EntryFormComponent {
  step = 1;
  step1Form: FormGroup;
  step2Form: FormGroup;

  foodItems = ['welcomeDrink', 'starters', 'mainCourse', 'dessert'];
  selectedFoods: Record<string, boolean> = {};
  constructor(private fb: FormBuilder) {
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
    const formData = {
      ...this.step1Form.value,
      ...this.step2Form.value,
    };

    console.log('Form Submitted:', formData);
    alert('Booking Confirmed!');
  }
}
