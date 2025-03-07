import { Component, inject } from '@angular/core';
import { ReusableTable1Component } from '../../../shared/components/admin/reusable-table1/reusable-table1.component';
import { TableAction, TableColumn } from '../../../core/models/ITable';
import { SoundService } from '../../../core/services/admin/soundService/sound.service';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { ISound, ISoundCreate } from '../../../core/models/ISound';
import IToastOption from '../../../core/models/IToastOptions';
import { CommonModule } from '@angular/common';
import { AddModalComponent } from "../../../shared/components/admin/add-edit-modal/add-modal.component";

@Component({
  selector: 'app-sound-management',
  imports: [ReusableTable1Component, CommonModule, AddModalComponent],
  templateUrl: './sound-management.component.html',
  styleUrl: './sound-management.component.css',
})
export class SoundManagementComponent {
  private _soundService = inject(SoundService);
  private _toastService = inject(ToastService);
  isModalOpen = false;
  modalHeading = '';
  editingItem: any = null;
  sounds: ISound[] = [];
  isLoading = false;
  errorMessage = '';
  soundColumns: TableColumn[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'description', header: 'Description', type: 'text' },
    { key: 'estimatedCost', header: 'Estimated Cost', type: 'text' },
    { key: 'blocked', header: 'Status', type: 'toggle' },
  ];

  soundColumnWidths = ['160px', '320px', '160px', '150px'];

  soundActions: TableAction[] = [
    {
      icon: 'Edit',
      color: 'blue',
      action: (item) => this.editSound(item),
    },
    {
      icon: 'Delete',
      color: 'red',
      action: (item) => this.deleteSound(item),
    },
  ];

  ngOnInit(): void {
    this.getSounds();
  }

  getSounds() {
    this.isLoading = true;
    this.errorMessage = '';
    this._soundService.getSounds().subscribe({
      next: (response) => {
        console.log(response, 'res');
        if (response.success) {
          this.sounds = response.data.map((decoration: any) => {
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
          this.errorMessage = response.message || 'Failed to fetch sounds';

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
        console.error('Error fetching Sound:', error);
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

  addSound() {
    this.modalHeading = 'Add Sound';
    this.editingItem = null;
    this.isModalOpen = true;
  }

  editSound(item: any) {
    this.modalHeading = 'Edit Sound';
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

  handleSaveData(data: ISoundCreate) {
    if (this.editingItem && this.editingItem._id) {
      this._soundService
        .updateSound(this.editingItem._id, data)
        .subscribe({
          next: (response) => {
            console.log(response, 'resss');
            if (response.success) {
              const index = this.sounds.findIndex(
                (v) => v._id === this.editingItem._id
              );
              if (index !== -1) {
                this.sounds[index] = {
                  ...this.sounds[index],
                  ...data,
                };
                if (
                  data.startingPrice !== undefined &&
                  data.endingPrice !== undefined
                ) {
                  this.sounds[
                    index
                  ].estimatedCost = `₹${data.startingPrice} - ₹${data.endingPrice}`;
                } else {
                  this.sounds[index].estimatedCost = 'Price not available';
                }
              }
            } else {
              this.errorMessage =
                response.message || 'Failed to update decoration';
            }
          },
          error: (error) => {
            this.errorMessage = 'An error occurred while updating decoration';
            console.error('Error updating decoration:', error);
          },
        });
    } else {
      this._soundService.addSound(data).subscribe({
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

            this.sounds.push(decorationData);
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

  deleteSound(item: ISoundCreate) {
    if (confirm('Are you sure you want to delete this decoration?')) {
      this._soundService.deleteSound(item._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.sounds = this.sounds.filter(
              (sound) => sound._id !== item._id
            );
          } else {
            this.errorMessage =
              response.message || 'Failed to delete decorations';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while deleting decoration';
          console.error('Error deleting decorations:', error);
        },
      });
    }
  }

  handleStatusChange(item: ISoundCreate, newStatus: boolean) {
    this._soundService
      .toggleSoundStatus(item._id, newStatus)
      .subscribe({
        next: (response) => {
          if (response.success) {
            const index = this.sounds.findIndex((v) => v._id === item._id);
            if (index !== -1) {
              this.sounds[index].blocked = !newStatus;
              this.sounds[index].list = newStatus;
            }
          } else {
            this.errorMessage = response.message || 'Failed to update status';
            const index = this.sounds.findIndex((v) => v._id === item._id);
            if (index !== -1) {
              this.sounds[index].blocked = !newStatus;
              this.sounds[index].list = newStatus;
            }
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while updating status';
          console.error('Error updating status:', error);
          const index = this.sounds.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.sounds[index].blocked = !newStatus;
            this.sounds[index].list = newStatus;
          }
        },
      });
  }
}
