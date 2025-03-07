import { Component, inject, OnInit } from '@angular/core';
import { ReusableTable1Component } from '../../../shared/components/admin/reusable-table1/reusable-table1.component';
import { TableAction, TableColumn } from '../../../core/models/ITable';
import { MiscellaneousService } from '../../../core/services/admin/miscellaneousService/miscellaneous.service';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { IMiscellaneous, IMiscellaneousCreate } from '../../../core/models/IMiscellaneous';
import IToastOption from '../../../core/models/IToastOptions';
import { CommonModule } from '@angular/common';
import { AddModalComponent } from "../../../shared/components/admin/add-edit-modal/add-modal.component";

@Component({
  selector: 'app-miscellaneous-management',
  imports: [ReusableTable1Component, CommonModule, AddModalComponent],
  templateUrl: './miscellaneous-management.component.html',
  styleUrl: './miscellaneous-management.component.css',
})
export class MiscellaneousManagementComponent implements OnInit{
  private _miscellaneouService = inject(MiscellaneousService);
  private _toastService = inject(ToastService);
  isModalOpen = false;
  modalHeading = '';
  editingItem: any = null;
  miscellaneouss: IMiscellaneous[] = [];
  isLoading = false;
  errorMessage = '';

  miscellaneousColumns: TableColumn[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'description', header: 'Description', type: 'text' },
    { key: 'estimatedCost', header: 'Estimated Cost', type: 'text' },
    { key: 'blocked', header: 'Status', type: 'toggle' },
  ];

  miscellaneousColumnWidths = ['160px', '320px', '160px', '150px'];

  miscellaneousActions: TableAction[] = [
    {
      icon: 'Edit',
      color: 'blue',
      action: (item) => this.editMiscellaneous(item),
    },
    {
      icon: 'Delete',
      color: 'red',
      action: (item) => this.deleteMiscellaneous(item),
    },
  ];
  ngOnInit(): void {
    this.getMiscellaneous();
  }

  getMiscellaneous() {
    this.isLoading = true;
    this.errorMessage = '';
    this._miscellaneouService.getMiscellaneous().subscribe({
      next: (response) => {
        console.log(response, 'res');
        if (response.success) {
          this.miscellaneouss = response.data.map((miscellaneous: any) => {
            if (
              miscellaneous.estimatedCost &&
              miscellaneous.estimatedCost.min !== undefined &&
              miscellaneous.estimatedCost.max !== undefined
            ) {
              miscellaneous.estimatedCost = `₹${miscellaneous.estimatedCost.min} - ₹${miscellaneous.estimatedCost.max}`;
            } else {
              miscellaneous.estimatedCost = 'Price not available';
            }
            miscellaneous.list = !miscellaneous.blocked;
            return miscellaneous;
          });
        } else {
          this.errorMessage =
            response.message || 'Failed to fetch miscellaneous features';

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
        console.error('Error fetching miscellaneous features:', error);
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

  addMiscellaneous() {
    this.modalHeading = 'Add miscellaneous features';
    this.editingItem = null;
    this.isModalOpen = true;
  }

  editMiscellaneous(item: any) {
    this.modalHeading = 'Edit miscellaneous features';
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

  handleSaveData(data: IMiscellaneousCreate) {
    if (this.editingItem && this.editingItem._id) {
      this._miscellaneouService.updateMiscellaneous(this.editingItem._id, data).subscribe({
        next: (response) => {
          console.log(response, 'resss');
          if (response.success) {
            const index = this.miscellaneouss.findIndex(
              (v) => v._id === this.editingItem._id
            );
            if (index !== -1) {
              this.miscellaneouss[index] = {
                ...this.miscellaneouss[index],
                ...data,
              };
              if (
                data.startingPrice !== undefined &&
                data.endingPrice !== undefined
              ) {
                this.miscellaneouss[
                  index
                ].estimatedCost = `₹${data.startingPrice} - ₹${data.endingPrice}`;
              } else {
                this.miscellaneouss[index].estimatedCost = 'Price not available';
              }
            }
          } else {
            this.errorMessage =
              response.message || 'Failed to update Photo & Video Features';
          }
        },
        error: (error) => {
          this.errorMessage =
            'An error occurred while updating Photo & Video Features';
          console.error('Error updating Photo & Video Features:', error);
        },
      });
    } else {
      this._miscellaneouService.addMiscellaneous(data).subscribe({
        next: (response) => {
          if (response.success) {
            const miscellaneousData = response.data;
            if (
              miscellaneousData.estimatedCost?.min !== undefined &&
              miscellaneousData.estimatedCost?.max !== undefined
            ) {
              miscellaneousData.estimatedCost = `₹${miscellaneousData.estimatedCost.min} - ₹${miscellaneousData.estimatedCost.max}`;
            } else {
              miscellaneousData.estimatedCost = 'Price not available';
            }

            miscellaneousData.list = !miscellaneousData.blocked;
            console.log('Updated miscellaneousData:', miscellaneousData);

            this.miscellaneouss.push(miscellaneousData);
            const toastOption: IToastOption = {
              severity: 'success-toast',
              summary: 'Success',
              detail: 'New miscellaneous is added',
            };
            this._toastService.showToast(toastOption);
            this.closeModal();
          } else {
            this.errorMessage =
              response.message || 'Failed to miscellaneous Features';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while adding miscellaneous';
          console.error('Error adding miscellaneous:', error);
        },
      });
    }
  }

  deleteMiscellaneous(item: IMiscellaneousCreate) {
    if (confirm('Are you sure you want to delete this miscellaneous?')) {
      this._miscellaneouService.deleteMiscellaneous(item._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.miscellaneouss = this.miscellaneouss.filter((miscellaneous) => miscellaneous._id !== item._id);
          } else {
            this.errorMessage =
              response.message || 'Failed to delete Miscellaneous';
          }
        },
        error: (error) => {
          this.errorMessage =
            'An error occurred while deleting Miscellaneous';
          console.error('Error deleting Miscellaneous', error);
        },
      });
    }
  }

  handleStatusChange(item: IMiscellaneousCreate, newStatus: boolean) {
    this._miscellaneouService.togglemiscellaneousStatus(item._id, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.miscellaneouss.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.miscellaneouss[index].blocked = !newStatus;
            this.miscellaneouss[index].list = newStatus;
          }
        } else {
          this.errorMessage = response.message || 'Failed to update status';
          const index = this.miscellaneouss.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.miscellaneouss[index].blocked = !newStatus;
            this.miscellaneouss[index].list = newStatus;
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while updating status';
        console.error('Error updating status:', error);
        const index = this.miscellaneouss.findIndex((v) => v._id === item._id);
        if (index !== -1) {
          this.miscellaneouss[index].blocked = !newStatus;
          this.miscellaneouss[index].list = newStatus;
        }
      },
    });
  }
}
