import { Component, inject, OnDestroy } from '@angular/core';
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
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { Router } from '@angular/router';
import { PaymentService } from '../../../core/services/users/payment/payment.service';
import { Subscription } from 'rxjs';
import IToastOption from '../../../core/models/IToastOptions';

@Component({
  selector: 'app-entry-form',
  standalone: true,
  imports: [FooterComponent, NavBar2Component, CommonModule, ReactiveFormsModule],
  providers: [FormSubmitService],
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.css',
})
export class EntryFormComponent implements OnDestroy {
  private _subscription = new Subscription();
  step = 1;
  step1Form: FormGroup;
  step2Form: FormGroup;

  foodItems = ['welcomeDrink', 'starters', 'mainCourse', 'dessert'];
  selectedFoods: Record<string, boolean> = {};
  private _toastService = inject(ToastService);
  private _paymentService = inject(PaymentService);
  private router = inject(Router);
  constructor(
    private _fb: FormBuilder,
    private _entryFormReg: FormSubmitService
  ) {
    this.step1Form = this._fb.group(
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

    this.step2Form = this._fb.group(
      {
        guestCount: ['', Validators.required],
        venue: ['', [Validators.required, noAllSpacesValidator()]],
        decoration: [false],
        sound: [false],
        seating: [false],
        photography: [false],
        foodOptions: this._fb.group({
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
      const entrySub = this._entryFormReg.entryRegistration(formData).subscribe({
        next: (response: any) => {
          console.log(response, 'res');
          if (response.success && response.data) {
            const email = response.data.email;
            const entryId = response.data._id;
            console.log(email);
            const paymentSub = this._paymentService.entryPaymentLink(email, entryId).subscribe({
              next: response => {
                console.log('Payment link sent:', response);
                const toastOption: IToastOption = {
                  severity: 'success-toast',
                  summary: 'Success',
                  detail: 'Entry form submitted! Payment link sent.',
                };
                this._toastService.showToast(toastOption);
                this.router.navigate(['/entry-success'], { queryParams: { email } });
              },
              error: error => {
                console.log(error, 'payment error');
                const toastOption: IToastOption = {
                  severity: 'danger-toast',
                  summary: 'Error',
                  detail: 'Failed to payment',
                };
                this._toastService.showToast(toastOption);
              },
            });
            this._subscription.add(paymentSub);
          }
        },
        error: error => {
          console.log(error, 'page error');
        },
      });
      this._subscription.add(entrySub);
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    console.log('EntryFormComponent destroyed and unsubscribed.');
  }
}
