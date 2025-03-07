import { Component, inject } from '@angular/core';
import { ReusableTable1Component } from '../../../shared/components/admin/reusable-table1/reusable-table1.component';
import { TableAction, TableColumn } from '../../../core/models/ITable';
import { DecorationService } from '../../../core/services/admin/decorationService/decoration.service';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { IDecoration, IDecorationCreate } from '../../../core/models/IDecoration';
import IToastOption from '../../../core/models/IToastOptions';
import { CommonModule } from '@angular/common';
import { AddModalComponent } from "../../../shared/components/admin/add-edit-modal/add-modal.component";

@Component({
  selector: 'app-decoration-management',
  imports: [ReusableTable1Component, CommonModule, AddModalComponent],
  templateUrl: './decoration-management.component.html',
  styleUrl: './decoration-management.component.css',
})
export class DecorationManagementComponent {
  private _decorationService = inject(DecorationService);
  private _toastService = inject(ToastService);
  isModalOpen = false;
  modalHeading = '';
  editingItem: any = null;
  decorations: IDecoration[] = [];
  isLoading = false;
  errorMessage = '';
  decorationColumns: TableColumn[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'description', header: 'Description', type: 'text' },
    { key: 'estimatedCost', header: 'Estimated Cost', type: 'text' },
    { key: 'blocked', header: 'Status', type: 'toggle' },
  ];

  decorationColumnWidths = ['160px', '320px', '160px', '150px'];

  decorationActions: TableAction[] = [
    {
      icon: 'Edit',
      color: 'blue',
      action: (item) => this.editDecoration(item),
    },
    {
      icon: 'Delete',
      color: 'red',
      action: (item) => this.deleteDecoration(item),
    },
  ];

  ngOnInit(): void {
    this.getDecorations();
  }

  getDecorations() {
    this.isLoading = true;
    this.errorMessage = '';
    this._decorationService.getDecorations().subscribe({
      next: (response) => {
        console.log(response, 'res');
        if (response.success) {
          this.decorations = response.data.map((decoration: any) => {
            if (
              decoration.estimatedCost &&
              decoration.estimatedCost.min !== undefined &&
              decoration.estimatedCost.max !== undefined
            ) {
              decoration.estimatedCost = `₹${decoration.estimatedCost.min} - ₹${decoration.estimatedCost.max}`;
            } else {
              decoration.estimatedCost = 'Price not available';
            }
            decoration.list = !decoration.blocked;
            return decoration;
          });
        } else {
          this.errorMessage = response.message || 'Failed to fetch decorations';

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
        console.error('Error fetching Decoration:', error);
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

  addDecoration() {
    this.modalHeading = 'Add Decoration';
    this.editingItem = null;
    this.isModalOpen = true;
  }

  editDecoration(item: any) {
    this.modalHeading = 'Edit Decoration';
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

    handleSaveData(data: IDecorationCreate) {
      if (this.editingItem && this.editingItem._id) {
        this._decorationService.updateDecoration(this.editingItem._id, data).subscribe({
          next: (response) => {
            console.log(response, 'resss');
            if (response.success) {
              const index = this.decorations.findIndex(
                (v) => v._id === this.editingItem._id
              );
              if (index !== -1) {
                this.decorations[index] = { ...this.decorations[index], ...data };
                if (
                  data.startingPrice !== undefined &&
                  data.endingPrice !== undefined
                ) {
                  this.decorations[
                    index
                  ].estimatedCost = `₹${data.startingPrice} - ₹${data.endingPrice}`;
                } else {
                  this.decorations[index].estimatedCost = 'Price not available';
                }
              }
            } else {
              this.errorMessage = response.message || 'Failed to update decoration';
            }
          },
          error: (error) => {
            this.errorMessage = 'An error occurred while updating decoration';
            console.error('Error updating decoration:', error);
          },
        });
      } else {
        this._decorationService.addDecoration(data).subscribe({
          next: (response) => {
            if (response.success) {
              const decorationData = response.data;
              if (
                decorationData.estimatedCost?.min !== undefined &&
                decorationData.estimatedCost?.max !== undefined
              ) {
                decorationData.estimatedCost = `₹${decorationData.estimatedCost.min} - ₹${decorationData.estimatedCost.max}`;
              } else {
                decorationData.estimatedCost = 'Price not available';
              }
  
              decorationData.list = !decorationData.blocked;
              console.log('Updated decorationData:', decorationData);
  
              this.decorations.push(decorationData);
              const toastOption: IToastOption = {
                severity: 'success-toast',
                summary: 'Success',
                detail: 'New Decoration is added',
              };
              this._toastService.showToast(toastOption);
              this.closeModal();
            } else {
              this.errorMessage = response.message || 'Failed to add decoration';
            }
          },
          error: (error) => {
            this.errorMessage = 'An error occurred while adding decoration';
            console.error('Error adding decoration:', error);
          },
        });
      }
    }

  deleteDecoration(item: IDecorationCreate) {
    if (confirm('Are you sure you want to delete this decoration?')) {
      this._decorationService.deleteDecoration(item._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.decorations = this.decorations.filter((decoration) => decoration._id !== item._id);
          } else {
            this.errorMessage = response.message || 'Failed to delete decorations';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while deleting decoration';
          console.error('Error deleting decorations:', error);
        },
      });
    }
  }

    handleStatusChange(item: IDecorationCreate, newStatus: boolean) {
      this._decorationService.toggleDecorationStatus(item._id, newStatus).subscribe({
        next: (response) => {
          if (response.success) {
            const index = this.decorations.findIndex((v) => v._id === item._id);
            if (index !== -1) {
              this.decorations[index].blocked = !newStatus;
              this.decorations[index].list = newStatus;
            }
          } else {
            this.errorMessage = response.message || 'Failed to update status';
            const index = this.decorations.findIndex((v) => v._id === item._id);
            if (index !== -1) {
              this.decorations[index].blocked = !newStatus;
              this.decorations[index].list = newStatus;
            }
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while updating status';
          console.error('Error updating status:', error);
          const index = this.decorations.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.decorations[index].blocked = !newStatus;
            this.decorations[index].list = newStatus;
          }
        },
      });
    }

}
