import { Component, inject, OnInit } from '@angular/core';
import { SubscriptionService } from '../../../core/services/users/subscriptionUser/subscription.service';
import { IClientData } from '../../../core/models/IUser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-subscription-details',
  imports: [CommonModule, RouterModule],
  templateUrl: './subscription-details.component.html',
  styleUrl: './subscription-details.component.css',
})
export class SubscriptionDetailsComponent implements OnInit {
  private _subscriptionService = inject(SubscriptionService);
  selectedClient: IClientData | null = null;

  ngOnInit(): void {
    this.fetchSubClientData();
  }

  fetchSubClientData() {
    this._subscriptionService.fetchSubscribedUser().subscribe({
      next: response => {
        console.log(response, 'response');
        this.selectedClient = response.data;
      },
      error: error => {
        console.log(error);
      },
    });
  }
}
