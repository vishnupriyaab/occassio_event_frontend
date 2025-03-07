import { Component, inject, OnInit } from '@angular/core';
import { ReusableTable1Component } from '../../../shared/components/admin/reusable-table1/reusable-table1.component';
import { TableAction, TableColumn } from '../../../core/models/ITable';
import { AddModalComponent } from '../../../shared/components/admin/add-edit-modal/add-modal.component';
import { VenueService } from '../../../core/services/admin/venueService/venue.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import IToastOption from '../../../core/models/IToastOptions';
import { IVenue, IVenueCreate } from '../../../core/models/IVenue';

@Component({
  selector: 'app-venue-management',
  imports: [ReusableTable1Component, AddModalComponent, CommonModule],
  templateUrl: './venue-management.component.html',
  styleUrl: './venue-management.component.css',
})
export class VenueManagementComponent implements OnInit {
  private _venueService = inject(VenueService);
  private _toastService = inject(ToastService);
  isModalOpen = false;
  modalHeading = '';
  editingItem: any = null;
  venues: IVenue[] = [];
  isLoading = false;
  errorMessage = '';

  venueColumns: TableColumn[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'description', header: 'Description', type: 'text' },
    { key: 'estimatedCost', header: 'Estimated Cost', type: 'text' },
    { key: 'blocked', header: 'Status', type: 'toggle' },
  ];

  venueColumnWidths = ['160px', '320px', '160px', '150px'];

  venueActions: TableAction[] = [
    {
      icon: 'Edit',
      color: 'blue',
      action: (item) => this.editVenue(item),
    },
    {
      icon: 'Delete',
      color: 'red',
      action: (item) => this.deleteVenue(item),
    },
  ];

  ngOnInit(): void {
    this.getVenues();
  }

  getVenues() {
    this.isLoading = true;
    this.errorMessage = '';
    this._venueService.getVenue().subscribe({
      next: (response) => {
        console.log(response, 'res');
        if (response.success) {
          this.venues = response.data.map((venue: any) => {
            if (
              venue.estimatedCost &&
              venue.estimatedCost.min !== undefined &&
              venue.estimatedCost.max !== undefined
            ) {
              venue.estimatedCost = `₹${venue.estimatedCost.min} - ₹${venue.estimatedCost.max}`;
            } else {
              venue.estimatedCost = 'Price not available';
            }
            venue.list = !venue.blocked;
            return venue;
          });
        } else {
          this.errorMessage = response.message || 'Failed to fetch venues';

          const toastOption: IToastOption = {
            severity: 'error-toast',
            summary: 'Error',
            detail: this.errorMessage,
          };
          this._toastService.showToast(toastOption);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching venues:', error);
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: this.errorMessage,
        };
        this._toastService.showToast(toastOption);

        this.isLoading = false;
      },
    });
  }

  addVenue() {
    this.modalHeading = 'Add Venue';
    this.editingItem = null;
    this.isModalOpen = true;
  }

  editVenue(item: any) {
    this.modalHeading = 'Edit Venue';
    const startingPrice = item.estimatedCost?.min ?? 0;
    const endingPrice = item.estimatedCost?.max ?? 0;
    this.editingItem = {
      ...item,
      startingPrice,
      endingPrice,
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleSaveData(data: IVenueCreate) {
    if (this.editingItem && this.editingItem._id) {
      this._venueService.updateVenue(this.editingItem._id, data).subscribe({
        next: (response) => {
          console.log(response, 'resss');
          if (response.success) {
            const index = this.venues.findIndex(
              (v) => v._id === this.editingItem._id
            );
            if (index !== -1) {
              this.venues[index] = {
                ...this.venues[index],
                ...data,
              };
              if (
                data.startingPrice !== undefined &&
                data.endingPrice !== undefined
              ) {
                this.venues[
                  index
                ].estimatedCost = `₹${data.startingPrice} - ₹${data.endingPrice}`;
              } else {
                this.venues[index].estimatedCost = 'Price not available';
              }
            }
          } else {
            this.errorMessage = response.message || 'Failed to update venue';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while updating venue';
          console.error('Error updating venue:', error);
        },
      });
    } else {
      this._venueService.addVenue(data).subscribe({
        next: (response) => {
          if (response.success) {
            const venueData = response.data;

            if (
              venueData.estimatedCost?.min !== undefined &&
              venueData.estimatedCost?.max !== undefined
            ) {
              venueData.estimatedCost = `₹${venueData.estimatedCost.min} - ₹${venueData.estimatedCost.max}`;
            } else {
              venueData.estimatedCost = 'Price not available';
            }

            venueData.list = !venueData.blocked;
            console.log('Updated venueData:', venueData);

            this.venues.push(venueData);
            const toastOption: IToastOption = {
              severity: 'success-toast',
              summary: 'Success',
              detail: 'New Venue is added',
            };
            this._toastService.showToast(toastOption);
            this.closeModal();
          } else {
            this.errorMessage = response.message || 'Failed to add venue';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while adding venue';
          console.error('Error adding venue:', error);
        },
      });
    }
  }

  deleteVenue(item: IVenueCreate) {
    if (confirm('Are you sure you want to delete this venue?')) {
      this._venueService.deleteVenue(item._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.venues = this.venues.filter((venue) => venue._id !== item._id);
          } else {
            this.errorMessage = response.message || 'Failed to delete venue';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while deleting venue';
          console.error('Error deleting venue:', error);
        },
      });
    }
  }

  handleStatusChange(item: IVenueCreate, newStatus: boolean) {
    this._venueService.toggleVenueStatus(item._id, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.venues.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.venues[index].blocked = !newStatus;
            this.venues[index].list = newStatus;
          }
        } else {
          this.errorMessage = response.message || 'Failed to update status';
          const index = this.venues.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.venues[index].blocked = !newStatus;
            this.venues[index].list = newStatus;
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while updating status';
        console.error('Error updating status:', error);
        const index = this.venues.findIndex((v) => v._id === item._id);
        if (index !== -1) {
          this.venues[index].blocked = !newStatus;
          this.venues[index].list = newStatus;
        }
      },
    });
  }
}
