import { Component, inject, OnInit } from '@angular/core';
import { ClientService } from '../../../core/services/employee/clientService/client.service';
import { response } from 'express';
import { IClientData } from '../../../core/models/IUser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-clients',
  imports: [CommonModule],
  templateUrl: './my-clients.component.html',
  styleUrl: './my-clients.component.css',
})
export class MyClientsComponent implements OnInit {
  private _clientService = inject(ClientService);
  clients: IClientData[] = [];
  selectedClient: IClientData | null = null;
  isModalOpen = false;

  ngOnInit(): void {
    this.fetchClients();
  }

  fetchClients() {
    this._clientService.fetchClients().subscribe({
      next: response => {
        console.log(response), 'responseeeeeeeeeeeeeee';
        this.clients = response.data;
      },
      error: error => {},
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
