import { Component } from '@angular/core';
import { FooterComponent } from '../../../shared/components/user/footer/footer.component';
import { NavBar2Component } from '../../../shared/components/user/nav-bar2/nav-bar2.component';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionService } from '../../../core/services/users/subscriptionUser/subscription.service';
import { response } from 'express';
import { IBookingEstimation } from '../../../core/models/IBooking';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-firstpayment-success',
  imports: [FooterComponent, NavBar2Component, CommonModule],
  templateUrl: './firstpayment-success.component.html',
  styleUrl: './firstpayment-success.component.css',
})
export class FirstpaymentSuccessComponent {
  estimatedId: string = '';
  bookingDetails!:IBookingEstimation;
  balanceAmount!:Number;
  constructor(
    private route: ActivatedRoute,
    private _subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.estimatedId = params['estimatedId'];
      console.log('Estimated ID:', this.estimatedId);
    });
    this.fetchBookingDetails();
  }
  fetchBookingDetails() {
    console.log(this.estimatedId);
    this._subscriptionService.fetchBookingDetails(this.estimatedId).subscribe({
      next: response => {
        console.log(response, 'responseee');
        this.bookingDetails = response.data;
        const grandTotal = Number(this.bookingDetails?.grandTotal ?? 0);
      const paidAmount = Number(this.bookingDetails?.paidAmount ?? 0);

      this.balanceAmount = grandTotal - paidAmount;

      console.log('Grand Total:', grandTotal);
      console.log('Paid Amount:', paidAmount);
      console.log('Balance Amount:', this.balanceAmount);
      },
      error: error => { 
        console.log(error, 'error');
      },
    });
  }
}
