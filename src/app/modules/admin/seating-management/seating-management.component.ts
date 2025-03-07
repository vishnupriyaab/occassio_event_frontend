import { Component, inject, OnInit } from '@angular/core';
import { TableAction, TableColumn } from '../../../models/ITable';
import { ReusableTable1Component } from '../../../shared/components/admin/reusable-table1/reusable-table1.component';
import { AddModalComponent } from '../../../shared/components/admin/add-edit-modal/add-modal.component';
import { CommonModule } from '@angular/common';
import { ISeating, ISeatingCreate } from '../../../models/ISeating';
import { SeatingService } from '../../../core/services/admin/seatingService/seating.service';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import IToastOption from '../../../core/models/IToastOptions';

@Component({
  selector: 'app-seating-management',
  imports: [ReusableTable1Component, AddModalComponent, CommonModule],
  templateUrl: './seating-management.component.html',
  styleUrl: './seating-management.component.css',
})
export class SeatingManagementComponent implements OnInit {
  private _seatingService = inject(SeatingService);
  private _toastService = inject(ToastService);
  isModalOpen = false;
  modalHeading = '';
  editingItem: any = null;
  seatings: ISeating[] = [];
  isLoading = false;
  errorMessage = '';
  seatingColumns: TableColumn[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'description', header: 'Description', type: 'text' },
    { key: 'estimatedCost', header: 'Estimated Cost', type: 'text' },
    { key: 'blocked', header: 'Status', type: 'toggle' },
  ];

  seatingColumnWidths = ['160px', '320px', '160px', '150px'];

  seatingActions: TableAction[] = [
    {
      icon: 'Edit',
      color: 'blue',
      action: (item) => this.editSeating(item),
    },
    {
      icon: 'Delete',
      color: 'red',
      action: (item) => this.deleteSeating(item),
    },
  ];

  ngOnInit(): void {
    this.getSeatings();
  }

  getSeatings() {
    this.isLoading = true;
    this.errorMessage = '';
    this._seatingService.getSeatings().subscribe({
      next: (response) => {
        console.log(response, 'res');
        if (response.success) {
          this.seatings = response.data.map((venue: any) => {
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
          this.errorMessage = response.message || 'Failed to fetch seatings';

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
        console.error('Error fetching seatings:', error);
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

  addSeating() {
    this.modalHeading = 'Add Seating';
    this.editingItem = null;
    this.isModalOpen = true;
  }

  editSeating(item: any) {
    this.modalHeading = 'Edit Seating';
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

  handleSaveData(data: ISeatingCreate) {
    if (this.editingItem && this.editingItem._id) {
      this._seatingService.updateSeating(this.editingItem._id, data).subscribe({
        next: (response) => {
          console.log(response, 'resss');
          if (response.success) {
            const index = this.seatings.findIndex(
              (v) => v._id === this.editingItem._id
            );
            if (index !== -1) {
              this.seatings[index] = { ...this.seatings[index], ...data };
              if (
                data.startingPrice !== undefined &&
                data.endingPrice !== undefined
              ) {
                this.seatings[
                  index
                ].estimatedCost = `₹${data.startingPrice} - ₹${data.endingPrice}`;
              } else {
                this.seatings[index].estimatedCost = 'Price not available';
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
      this._seatingService.addSeating(data).subscribe({
        next: (response) => {
          if (response.success) {
            const seatingData = response.data;
            if (
              seatingData.estimatedCost?.min !== undefined &&
              seatingData.estimatedCost?.max !== undefined
            ) {
              seatingData.estimatedCost = `₹${seatingData.estimatedCost.min} - ₹${seatingData.estimatedCost.max}`;
            } else {
              seatingData.estimatedCost = 'Price not available';
            }

            seatingData.list = !seatingData.blocked;
            console.log('Updated seatingData:', seatingData);

            this.seatings.push(seatingData);
            const toastOption: IToastOption = {
              severity: 'success-toast',
              summary: 'Success',
              detail: 'New Seating is added',
            };
            this._toastService.showToast(toastOption);
            this.closeModal();
          } else {
            this.errorMessage = response.message || 'Failed to add seating';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while adding seating';
          console.error('Error adding seating:', error);
        },
      });
    }
  }

  deleteSeating(item: ISeatingCreate) {
    if (confirm('Are you sure you want to delete this seating?')) {
      this._seatingService.deleteSeating(item._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.seatings = this.seatings.filter(
              (seating) => seating._id !== item._id
            );
          } else {
            this.errorMessage = response.message || 'Failed to delete seating';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while deleting seating';
          console.error('Error deleting seating:', error);
        },
      });
    }
  }
  handleStatusChange(item: ISeatingCreate, newStatus: boolean) {
    this._seatingService.toggleSeatingStatus(item._id, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.seatings.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.seatings[index].blocked = !newStatus;
            this.seatings[index].list = newStatus;
          }
        } else {
          this.errorMessage = response.message || 'Failed to update status';
          const index = this.seatings.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.seatings[index].blocked = !newStatus;
            this.seatings[index].list = newStatus;
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while updating status';
        console.error('Error updating status:', error);
        const index = this.seatings.findIndex((v) => v._id === item._id);
        if (index !== -1) {
          this.seatings[index].blocked = !newStatus;
          this.seatings[index].list = newStatus;
        }
      },
    });
  }
}
