import { Component, inject } from '@angular/core';
import { ReusableTable1Component } from '../../../shared/components/admin/reusable-table1/reusable-table1.component';
import { TableAction, TableColumn } from '../../../core/models/ITable';
import { AddModalComponent } from '../../../shared/components/admin/add-edit-modal/add-modal.component';
import { FoodService } from '../../../core/services/admin/foodService/food.service';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { IFood, IFoodCreate } from '../../../core/models/IFood';
import IToastOption from '../../../core/models/IToastOptions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-food-management',
  imports: [ReusableTable1Component, AddModalComponent, CommonModule],
  templateUrl: './food-management.component.html',
  styleUrl: './food-management.component.css',
})
export class FoodManagementComponent {
  private _foodService = inject(FoodService);
  private _toastService = inject(ToastService);
  isModalOpen = false;
  modalHeading = '';
  editingItem: any = null;
  foods: IFood[] = [];
  isLoading = false;
  errorMessage = '';
  foodColumns: TableColumn[] = [
    { key: 'name', header: 'Name', type: 'text' },
    { key: 'description', header: 'Description', type: 'text' },
    { key: 'estimatedCost', header: 'Estimated Cost', type: 'text' },
    { key: 'blocked', header: 'Status', type: 'toggle' },
  ];

  foodColumnWidths = ['160px', '320px', '160px', '150px'];

  foodActions: TableAction[] = [
    {
      icon: 'Edit',
      color: 'blue',
      action: (item) => this.editFood(item),
    },
    {
      icon: 'Delete',
      color: 'red',
      action: (item) => this.deleteFood(item),
    },
  ];

  ngOnInit(): void {
    this.getFoods();
  }

  getFoods() {
    this.isLoading = true;
    this.errorMessage = '';
    this._foodService.getFoods().subscribe({
      next: (response) => {
        console.log(response, 'res');
        if (response.success) {
          this.foods = response.data.map((venue: any) => {
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
          this.errorMessage = response.message || 'Failed to fetch foods';

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
        console.error('Error fetching foods:', error);
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

  addFood() {
    this.modalHeading = 'Add Food';
    this.editingItem = null;
    this.isModalOpen = true;
  }

  editFood(item: any) {
    this.modalHeading = 'Edit Food';
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

  handleSaveData(data: IFoodCreate) {
    if (this.editingItem && this.editingItem._id) {
      this._foodService.updateFood(this.editingItem._id, data).subscribe({
        next: (response) => {
          console.log(response, 'resss');
          if (response.success) {
            const index = this.foods.findIndex(
              (v) => v._id === this.editingItem._id
            );
            if (index !== -1) {
              this.foods[index] = { ...this.foods[index], ...data };
              if (
                data.startingPrice !== undefined &&
                data.endingPrice !== undefined
              ) {
                this.foods[
                  index
                ].estimatedCost = `₹${data.startingPrice} - ₹${data.endingPrice}`;
              } else {
                this.foods[index].estimatedCost = 'Price not available';
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
      this._foodService.addFood(data).subscribe({
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

            this.foods.push(seatingData);
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

  deleteFood(item: IFoodCreate) {
    if (confirm('Are you sure you want to delete this seating?')) {
      this._foodService.deleteSeating(item._id).subscribe({
        next: (response) => {
          if (response.success) {
            this.foods = this.foods.filter((food) => food._id !== item._id);
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

  handleStatusChange(item: IFoodCreate, newStatus: boolean) {
    this._foodService.toggleFoodStatus(item._id, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          const index = this.foods.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.foods[index].blocked = !newStatus;
            this.foods[index].list = newStatus;
          }
        } else {
          this.errorMessage = response.message || 'Failed to update status';
          const index = this.foods.findIndex((v) => v._id === item._id);
          if (index !== -1) {
            this.foods[index].blocked = !newStatus;
            this.foods[index].list = newStatus;
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'An error occurred while updating status';
        console.error('Error updating status:', error);
        const index = this.foods.findIndex((v) => v._id === item._id);
        if (index !== -1) {
          this.foods[index].blocked = !newStatus;
          this.foods[index].list = newStatus;
        }
      },
    });
  }
}
