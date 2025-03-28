import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeManagementService } from '../../../core/services/admin/employeeManagement/employee-management.service';
import { Subscription } from 'rxjs';
import { Employee, IEmployee } from '../../../core/models/IEmployee';
import { mobileNumberValidator, noAllSpacesValidator } from '../../../shared/validator/formValidator';
import { SearchComponent } from '../search/search.component';
import { PaginationComponent } from '../pagination/pagination.component';
import IToastOption from '../../../core/models/IToastOptions';
import { ToastService } from '../../../core/services/common/toaster/toast.service';
import { response } from 'express';
import { error } from 'console';
import { SweetAlertService } from '../../../core/services/common/sweetAlert/sweet-alert.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SearchComponent, PaginationComponent],
  providers: [EmployeeManagementService],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnDestroy, OnInit {
  @ViewChild(SearchComponent) searchComponent!: SearchComponent;

  private _subscription = new Subscription();
  private _employeeService = inject(EmployeeManagementService);

  showModal = false;
  employeeForm!: FormGroup;

  employees: Employee[] = [];
  filteredEmployees: any[] = [];

  currentFilter = 'all';
  searchTerm = '';

  currentPage = 1;
  itemsPerPage = 4;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private _fb: FormBuilder,
    private _toastService: ToastService,
    private _sweetAlert: SweetAlertService
  ) {
    this.employeeForm = this._fb.group({
      name: new FormControl('', {
        validators: [Validators.required, noAllSpacesValidator()],
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      phone: new FormControl('', {
        validators: [Validators.required, mobileNumberValidator()],
      }),
    });
  }

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    const getEmplSub = this._employeeService.seacrhAndFilterEmpl('', this.currentFilter, this.currentPage, this.itemsPerPage).subscribe({
      next: response => {
        console.log(response);
        if (response.data && response.data.employees) {
          this.employees = response.data.employees;
          this.filteredEmployees = [...this.employees];
          this.totalItems = response.data.totalEmployees;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        } else {
          this.employees = [];
          this.filteredEmployees = [];
          this.totalItems = 0;
          this.totalPages = 0;
        }
      },
      error: error => {
        console.log(error, 'Error loading employees');
        console.error('Error fetching employees:', error);
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Failed to fetch employees',
        };
        this._toastService.showToast(toastOption);
      },
    });
    this._subscription.add(getEmplSub);
  }

  handleSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    if (!searchTerm.trim()) {
      this.filteredEmployees = [...this.employees];
      this.totalItems = this.employees.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.currentPage = 1;
      return;
    }
    const searchSub = this._employeeService.seacrhAndFilterEmpl(searchTerm, this.currentFilter, this.currentPage, this.itemsPerPage).subscribe({
      next: response => {
        console.log(response, 'Search results');
        if (response.data && response.data.employees) {
          this.filteredEmployees = response.data.employees;
          this.totalItems = response.data.totalEmployees;
          this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        } else {
          this.filteredEmployees = [];
          this.totalItems = 0;
          this.totalPages = 0;
        }
      },
      error: error => {
        console.log(error, 'Error searching employees');
        console.error('Error fetching employees:', error);
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Failed to fetch employees',
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

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.searchComponent && this.searchComponent.searchTerm.trim()) {
      this.handleSearch(this.searchComponent.searchTerm);
    } else if (this.currentFilter !== 'all') {
      this.handleFilterChange(this.currentFilter);
    } else {
      this.fetchEmployees();
    }
  }

  addEmployee(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  saveEmployee(): void {
    if (this.employeeForm.valid) {
      const employeeData: any = {
        name: this.employeeForm.value.name,
        email: this.employeeForm.value.email,
        phone: this.employeeForm.value.phone,
      };
      const saveEmplSub = this._employeeService.saveEmployee(employeeData).subscribe({
        next: res => {
          console.log(res, 'responseeeeee');
          if (res.data && res.data.employees) {
            this.employees.unshift(res.data.employees);
            this.filteredEmployees = [...this.employees];

            if (this.employees.length > this.itemsPerPage) {
              this.employees.pop();
              this.filteredEmployees = [...this.employees];
            }
            this.totalItems++;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          } else {
            const tempEmployee = {
              ...employeeData,
              _id: `temp_${Date.now()}`,
            };

            this.employees.unshift(tempEmployee);
            this.filteredEmployees = [...this.employees];

            if (this.employees.length > this.itemsPerPage) {
              this.employees.pop();
              this.filteredEmployees = [...this.employees];
            }

            this.totalItems++;
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
          }
        },
        error: error => {
          const toastOption: IToastOption = {
            severity: 'danger-toast',
            summary: 'Error',
            detail: 'Failed to Add employees',
          };
          this._toastService.showToast(toastOption);
        },
      });
      this._subscription.add(saveEmplSub);
      this.showModal = false;
      this.resetForm();
    }
  }
  blockStatus(employeeId: string, currentStatus: boolean) {
    console.log(employeeId, currentStatus);

    this._employeeService.blockUnblockEmpl(employeeId, currentStatus).subscribe({
      next: response => {
        console.log(response, 'response');
        if (response.success) {
          const toastOption: IToastOption = {
            severity: 'success-toast',
            summary: 'Success',
            detail: `Event ${response.data.isBlocked ? 'unblocked' : 'blocked'} successfully!`,
          };
          this._toastService.showToast(toastOption);
          this.fetchEmployees();
        }
      },
      error: error => {
        console.log(error, 'error');
        const toastOption: IToastOption = {
          severity: 'danger-toast',
          summary: 'Error',
          detail: 'Failed to update event status.',
        };
        this._toastService.showToast(toastOption);
      },
    });
  }

  deleteEmployee(employeeId: string) {
    console.log(employeeId, 'employeeId');
    this._sweetAlert.confirmationAlert('Are you sure?', "You won't be able to revert this!").then(result => {
      if (result.isConfirmed) {
        this._employeeService.deleteEmployee(employeeId).subscribe({
          next: response => {
            console.log(response, 'resposnee');
            this._sweetAlert.successAlert('Deleted!', 'Your event has been deleted.');
            this.fetchEmployees();
          },
          error: error => {
            console.log(error, 'error');
            const toastOption: IToastOption = {
              severity: 'danger-toast',
              summary: 'Error',
              detail: error.error?.message || 'There was a problem deleting the event.',
            };
            this._toastService.showToast(toastOption);
          },
        });
      } else {
        this._sweetAlert.successAlert('Cancelled', 'Your event deletion has been cancelled.');
      }
    });
  }

  private resetForm(): void {
    this.employeeForm.reset();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    console.log('EntryFormComponent destroyed and unsubscribed.');
  }
}
