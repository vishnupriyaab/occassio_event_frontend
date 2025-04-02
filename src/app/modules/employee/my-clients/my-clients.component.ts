import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../../core/services/employee/clientService/client.service';
import { IClientData } from '../../../core/models/IUser';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import IToastOption from '../../../core/models/IToastOptions';

@Component({
  selector: 'app-my-clients',
  imports: [CommonModule],
  templateUrl: './my-clients.component.html',
  styleUrl: './my-clients.component.css',
})
export class MyClientsComponent implements OnInit {
  private _clientService = inject(ClientService);
  private _toastService = inject(ToastService);
  clients: IClientData[] = [];
  selectedClient: IClientData | null = null;
  isModalOpen = false;

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients() {
    this._clientService.fetchClients().subscribe({
      next: response => {
        this.clients = response.data;
      },
      error: error => {
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Failed to fetch clients.',
        };
        this._toastService.showToast(toastOption);
      },
    });
  }

  openEventDetails(clientId: string) {
    this.selectedClient = this.clients.find(client => client.clientId === clientId) || null;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedClient = null;
  }
}
