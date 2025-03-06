import { Component, inject, OnInit } from '@angular/core';
import { ReusableTable1Component } from '../../../shared/components/admin/reusable-table1/reusable-table1.component';
import { TableAction, TableColumn } from '../../../models/ITable';
import { AddModalComponent } from '../../../shared/components/admin/add-edit-modal/add-modal.component';
import { VenueService } from '../../../core/services/admin/venueService/venue.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import IToastOption from '../../../core/models/IToastOptions';

@Component({
  selector: 'app-venue-management',
  imports: [ReusableTable1Component, AddModalComponent, CommonModule],
  templateUrl: './venue-management.component.html',
  styleUrl: './venue-management.component.css',
})
export class VenueManagementComponent implements OnInit{

  private _venueService = inject(VenueService);
  private _toastService = inject(ToastService);
  isModalOpen = false;
  modalHeading = '';
  editingItem: any = null;

  venueColumns: TableColumn[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'description', header: 'Description', type: 'text' },
    { key: 'estimatedCost', header: 'Estimated Cost', type: 'text' },
    { key: 'blocked', header: 'Status', type: 'toggle' },
  ];

  venueColumnWidths = ['160px', '320px', '190px', '120px'];

  venues: any[] = [];
  isLoading = false;
  errorMessage = '';

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

  ngOnInit():void{
    this.getVenues();
  }

  getVenues(){
    this.isLoading = true;
    this.errorMessage = '';
    this._venueService.getVenue().subscribe({
      next:(response)=>{
        console.log(response,"res")
        if (response.success) {
          this.venues = response.data.map((venue: any) => {
            if (venue.estimatedCost && 
                venue.estimatedCost.min !== undefined && 
                venue.estimatedCost.max !== undefined) {
              venue.estimatedCost = `₹${venue.estimatedCost.min} - ₹${venue.estimatedCost.max}`;
            } else {
              venue.estimatedCost = 'Price not available';
            }
            venue.list = !venue.blocked;
            return venue;
          });
          
          const toastOption: IToastOption = {
            severity: 'success-toast',
            summary: 'Success',
            detail: 'Venues loaded successfully',
          };
          this._toastService.showToast(toastOption);
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
      error:(error)=>{
        // this.errorMessage = 'An error occurred while fetching venues';
        console.error('Error fetching venues:', error);
        
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: this.errorMessage,
        };
        this._toastService.showToast(toastOption);
        
        this.isLoading = false;
      }
    })
  }

  addVenue() {
    this.modalHeading = 'Add Venue';
    this.editingItem = null;
    this.isModalOpen = true;
  }

  editVenue(item: any) {
    console.log('Editing venue:', item);
    this.modalHeading = 'Edit Venue';
    this.editingItem = item;
    this.isModalOpen = true;
    // Implement edit logic
    // For example, open a modal or navigate to an edit page
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleSaveData(data: any) {
    if (this.editingItem) {
      console.log(this.editingItem.id,"123456")
      this._venueService.updateVenue(this.editingItem.id, data).subscribe({
        next: (response) => {
          if (response.success) {
            // Update the local array with the updated venue
            const index = this.venues.findIndex(
              (v) => v.id === this.editingItem.id
            );
            if (index !== -1) {
              this.venues[index] = { ...this.venues[index], ...data };
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
            if (venueData.estimatedCost && venueData.estimatedCost.min !== undefined && venueData.estimatedCost.max !== undefined) {
              venueData.estimatedCost = `₹${venueData.estimatedCost.min} - ₹${venueData.estimatedCost.max}`;
            } else {
              console.warn('Estimated cost format is incorrect:', venueData.estimatedCost);
              venueData.estimatedCost = 'Price not available';
            }
            venueData.list = !venueData.blocked;

            console.log('Updated venueData:', venueData);

            this.venues.push(venueData);
            const toastOption: IToastOption = {
              severity: 'success-toast',
              summary: 'Success',
              detail: 'Login successful',
            };
            this._toastService.showToast(toastOption);
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

  deleteVenue(item: any) {
    if (confirm('Are you sure you want to delete this venue?')) {
      this._venueService.deleteVenue(item.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.venues = this.venues.filter((venue) => venue.id !== item.id);
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

  handleStatusChange(item: any, newStatus: boolean) {
    this._venueService.toggleVenueStatus(item.id, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          // Update the local array with the new status
          const index = this.venues.findIndex((v) => v.id === item.id);
          if (index !== -1) {
            this.venues[index].blocked = newStatus;
          }
        } else {
          this.errorMessage = response.message || 'Failed to update status';
          // Revert UI change if API call fails
          const index = this.venues.findIndex((v) => v.id === item.id);
          if (index !== -1) {
            this.venues[index].blocked = !newStatus;
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while updating status';
        console.error('Error updating status:', error);
        // Revert UI change if API call fails
        const index = this.venues.findIndex((v) => v.id === item.id);
        if (index !== -1) {
          this.venues[index].blocked = !newStatus;
        }
      },
    });
  }
}
