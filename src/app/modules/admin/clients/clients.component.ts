import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import IToastOption from '../../../core/models/IToastOptions';
import { Subscription } from 'rxjs';
import { ClientService } from '../../../core/services/admin/clientManagement/client.service';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { FetchClientData, IUser } from '../../../core/models/IUser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clients',
  imports: [SearchComponent, CommonModule],
  providers: [ClientService],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css',
})
export class ClientsComponent implements OnInit {
  @ViewChild(SearchComponent) searchComponent!: SearchComponent;
  private _subscription = new Subscription();
  private _clientService = inject(ClientService);
  private _toastService = inject(ToastService);
  currentFilter = 'all';
  searchTerm = '';
  filteredClients: FetchClientData[] = [];
  clients: IUser[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  totalItems = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.fetchUsers();
    console.log('Initial filteredClients:', this.filteredClients);
  }

  fetchUsers() {
    const getUserSub = this._clientService.seacrhAndFilterClient('', this.currentFilter, this.currentPage, this.itemsPerPage).subscribe({
      next: response => {
        console.log(response, 'response');
        if (response.data && response.data.users) {
          this.clients = response.data.users;
          this.filteredClients = [...this.clients];
          this.totalItems = response.data.totalUsers;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        } else {
          this.clients = [];
          this.filteredClients = [];
          this.totalItems = 0;
          this.totalPages = 0;
        }
      },
      error: error => {
        console.log(error, 'Error loading clients');
        console.error('Error fetching clients:', error);
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Failed to fetch clients',
        };
        this._toastService.showToast(toastOption);
      },
    });
    this._subscription.add(getUserSub);
  }

  handleSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    if (!searchTerm.trim()) {
      this.filteredClients = [...this.clients];
      this.totalItems = this.clients.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.currentPage = 1;
      return;
    }
    const searchSub = this._clientService.seacrhAndFilterClient(searchTerm, this.currentFilter, this.currentPage, this.itemsPerPage).subscribe({
      next: response => {
        console.log(response, 'Search results');
        if (response.data && response.data.users) {
          this.filteredClients = response.data.users;
          this.totalItems = response.data.totalUsers;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        } else {
          this.filteredClients = [];
          this.totalItems = 0;
          this.totalPages = 0;
        }
      },
      error: error => {
        console.log(error, 'Error searching clients');
        console.error('Error fetching clients:', error);
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Failed to fetch clients',
        };
        this._toastService.showToast(toastOption);
      },
    });

    this._subscription.add(searchSub);
  }

  handleFilterChange(filterStatus: string): void {
    console.log(filterStatus, 'filterStatus');
    this.currentFilter = filterStatus;
    this.currentPage = 1;
    this.handleSearch(this.searchComponent.searchTerm);
  }

  blockStatus(clientId: string, currentStatus: boolean) {
    console.log(clientId, currentStatus);
    this._clientService.blockUnblockUser(clientId, currentStatus).subscribe({
      next: response => {
        console.log(response);
        if (response.success) {
          const updatedClient = response.data;
          const clientIndex = this.filteredClients.findIndex(client => client._id === clientId);

          if (clientIndex !== -1) {
            this.filteredClients = [
              ...this.filteredClients.slice(0, clientIndex),
              { ...this.filteredClients[clientIndex], isBlocked: updatedClient.isBlocked },
              ...this.filteredClients.slice(clientIndex + 1),
            ];
          }
          const originalClientIndex = this.clients.findIndex(client => client._id === clientId);
          if (originalClientIndex !== -1) {
            this.clients = [
              ...this.clients.slice(0, originalClientIndex),
              { ...this.clients[originalClientIndex], isBlocked: updatedClient.isBlocked },
              ...this.clients.slice(originalClientIndex + 1),
            ];
          }

          const toastOption: IToastOption = {
            severity: 'success-toast',
            summary: 'Success',
            detail: `User ${response.data.isBlocked ? 'unblocked' : 'blocked'} successfully!`,
          };
          this._toastService.showToast(toastOption);
          // this.fetchUsers();
        }
      },
      error: error => {
        console.log(error, 'error');
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Failed to update User status.',
        };
        this._toastService.showToast(toastOption);
      },
    });
  }
}
