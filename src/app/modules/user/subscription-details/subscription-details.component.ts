import { Component, inject, OnInit } from '@angular/core';
import { SubscriptionService } from '../../../core/services/users/subscriptionUser/subscription.service';
import { IClientData } from '../../../core/models/IUser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import IToastOption from '../../../core/models/IToastOptions';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../core/services/users/payment/payment.service';

@Component({
  selector: 'app-subscription-details',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './subscription-details.component.html',
  styleUrl: './subscription-details.component.css',
})
export class SubscriptionDetailsComponent implements OnInit {
  private _subscriptionService = inject(SubscriptionService);
  private _toastService = inject(ToastService);
  private _paymentService = inject(PaymentService);
  selectedClient: IClientData | null = null;
  token: string = '';
  access_token: string = '';
  estimation: any;
  showTermsModal: boolean = false;
  termsAccepted: boolean = false;

  ngOnInit(): void {
    this.fetchSubClientData();
  }

  fetchSubClientData() {
    this._subscriptionService.fetchEstimation().subscribe({
      next: response => {
        // console.log(response, 'response');
        if (response.data.fetchEstimation === null) {
          this._subscriptionService.fetchSubscribedUser().subscribe({
            next: response => {
              console.log(response, 'response');
              this.selectedClient = response.data;
            },
            error: error => {
              console.log(error);
              const toastOption: IToastOption = {
                severity: 'danger-toast',
                summary: 'Error',
                detail: 'Failed to fetch user.',
              };
              this._toastService.showToast(toastOption);
            },
          });
        } else {
          console.log(response.data, '12345678900987654321');
          this.estimation = response.data;
        }
      },
      error: error => {
        console.log(error, 'error');
      },
    });
  }

  toggleTermsAndCondition() {
    this.showTermsModal = !this.showTermsModal;
  }

  onTermsAcceptedChange(event: any) {
    this.termsAccepted = event.target.checked;
  }

  makeYourDay() {
    if (!this.termsAccepted) {
      const toastOption: IToastOption = {
        severity: 'warning-toast',
        summary: 'Terms Required',
        detail: 'Please read and accept the terms and conditions',
      };
      this._toastService.showToast(toastOption);
      return;
    }
    console.log(this.estimation.fetchEstimation._id, 'qwertyuiodfghjkxcvbnm,');
    this._paymentService.oneByThirdPayment(this.estimation.fetchEstimation._id).subscribe({
      next: response => {
        console.log(response, 'ressss');
        const toastOption: IToastOption = {
          severity: 'success-toast',
          summary: 'Success',
          detail: 'Please check your email for payment instructions',
        };
        this._toastService.showToast(toastOption);
      },
      error: error => {
        console.log(error);
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: error.error.message,
        };
        this._toastService.showToast(toastOption);
      },
    });

    document.querySelector('.payment-notification')?.classList.remove('hidden');
  }
}
