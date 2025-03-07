import { Component, inject, OnInit } from '@angular/core';
import { ReusableTable1Component } from '../../../shared/components/admin/reusable-table1/reusable-table1.component';
import { TableAction, TableColumn } from '../../../core/models/ITable';
import { PhotoService } from '../../../core/services/admin/photoService/photo.service';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { IPhoto, IPhotoCreate } from '../../../core/models/IPhoto';
import IToastOption from '../../../core/models/IToastOptions';
import { CommonModule } from '@angular/common';
import { AddModalComponent } from '../../../shared/components/admin/add-edit-modal/add-modal.component';

@Component({
  selector: 'app-photo-management',
  imports: [ReusableTable1Component, CommonModule, AddModalComponent],
  templateUrl: './photo-management.component.html',
  styleUrl: './photo-management.component.css',
})
export class PhotoManagementComponent implements OnInit {
  private _photoService = inject(PhotoService);
  private _toastService = inject(ToastService);
  isModalOpen = false;
  modalHeading = '';
  editingItem: any = null;
  photos: IPhoto[] = [];
  isLoading = false;
  errorMessage = '';
  photoColumns: TableColumn[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'description', header: 'Description', type: 'text' },
    { key: 'estimatedCost', header: 'Estimated Cost', type: 'text' },
    { key: 'blocked', header: 'Status', type: 'toggle' },
  ];

  photoColumnWidths = ['160px', '320px', '160px', '150px'];

  photoActions: TableAction[] = [
    {
      icon: 'Edit',
      color: 'blue',
      action: (item) => this.editPhoto(item),
    },
    {
      icon: 'Delete',
      color: 'red',
      action: (item) => this.deletePhoto(item),
    },
  ];

  ngOnInit(): void {
    this.getPhotos();
  }

  getPhotos() {
    this.isLoading = true;
    this.errorMessage = '';
    this._photoService.getPhotos().subscribe({
      next: (response) => {
        console.log(response, 'res');
        if (response.success) {
          this.photos = response.data.map((decoration: any) => {
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
          this.errorMessage =
            response.message || 'Failed to fetch Photos & videos features';

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
        console.error('Error fetching Photos & videos features:', error);
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

  addPhoto() {
    this.modalHeading = 'Add Photo & Video Features';
    this.editingItem = null;
    this.isModalOpen = true;
  }

  editPhoto(item: any) {
    this.modalHeading = 'Edit Photo & Video Features';
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

  handleSaveData(data: IPhotoCreate) {
    if (this.editingItem && this.editingItem._id) {
      this._photoService.updatePhoto(this.editingItem._id, data).subscribe({
        next: (response) => {
          console.log(response, 'resss');
          if (response.success) {
            const index = this.photos.findIndex(
              (v) => v._id === this.editingItem._id
            );
            if (index !== -1) {
              this.photos[index] = {
                ...this.photos[index],
                ...data,
              };
              if (
                data.startingPrice !== undefined &&
                data.endingPrice !== undefined
              ) {
                this.photos[
                  index
                ].estimatedCost = `₹${data.startingPrice} - ₹${data.endingPrice}`;
              } else {
                this.photos[index].estimatedCost = 'Price not available';
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
      this._photoService.addPhoto(data).subscribe({
        next: (response) => {
          if (response.success) {
            const PhotoData = response.data;
            if (
              PhotoData.estimatedCost?.min !== undefined &&
              PhotoData.estimatedCost?.max !== undefined
            ) {
              PhotoData.estimatedCost = `₹${PhotoData.estimatedCost.min} - ₹${PhotoData.estimatedCost.max}`;
            } else {
              PhotoData.estimatedCost = 'Price not available';
            }

            PhotoData.list = !PhotoData.blocked;
            console.log('Updated PhotoData:', PhotoData);

            this.photos.push(PhotoData);
            const toastOption: IToastOption = {
              severity: 'success-toast',
              summary: 'Success',
              detail: 'New Photo & Video Features is added',
            };
            this._toastService.showToast(toastOption);
            this.closeModal();
          } else {
            this.errorMessage =
              response.message || 'Failed to add Photo & Video Features';
          }
        },
        error: (error) => {
          this.errorMessage = 'An error occurred while adding decoration';
          console.error('Error adding Photo & Video Features:', error);
        },
      });
    }
  }

  deletePhoto(item: IPhotoCreate) {
    if (confirm('Are you sure you want to delete this decoration?')) {
      this._photoService.deletePhoto(item._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.photos = this.photos.filter((photo) => photo._id !== item._id);
          } else {
            this.errorMessage =
              response.message || 'Failed to delete Photo & Video Features';
          }
        },
        error: (error) => {
          this.errorMessage =
            'An error occurred while deleting Photo & Video Features';
          console.error('Error deleting Photo & Video Features:', error);
        },
      });
    }
  }

  handleStatusChange(item: IPhotoCreate, newStatus: boolean) {
    this._photoService.togglePhotoStatus(item._id, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.photos.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.photos[index].blocked = !newStatus;
            this.photos[index].list = newStatus;
          }
        } else {
          this.errorMessage = response.message || 'Failed to update status';
          const index = this.photos.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.photos[index].blocked = !newStatus;
            this.photos[index].list = newStatus;
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while updating status';
        console.error('Error updating status:', error);
        const index = this.photos.findIndex((v) => v._id === item._id);
        if (index !== -1) {
          this.photos[index].blocked = !newStatus;
          this.photos[index].list = newStatus;
        }
      },
    });
  }
}
