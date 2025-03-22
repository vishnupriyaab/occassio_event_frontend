import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmployeeManagementService } from '../../../core/services/admin/employeeManagement/employee-management.service';
import { Subscription } from 'rxjs';
import { Employee } from '../../../core/models/IEmployee';
import { mobileNumberValidator, noAllSpacesValidator } from '../../../shared/validator/formValidator';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [EmployeeManagementService],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnDestroy {
  private _subscription = new Subscription();
  private _employeeService = inject(EmployeeManagementService);
  showModal: boolean = false;
  employeeForm!: FormGroup;

  constructor(private _fb: FormBuilder) {
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
  addEmployee(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.resetForm();
  }

  saveEmployee(): void {
    if (this.employeeForm.valid) {
      const employeeData: Employee = {
        name: this.employeeForm.value.name,
        email: this.employeeForm.value.email,
        phone: this.employeeForm.value.phone,
      };
      const saveEmplSub = this._employeeService.saveEmployee(employeeData).subscribe({
        next: res => {
          console.log(res, 'responseeeeee');
        },
        error: error => {
          console.log(error, 'errorrrrrrrrrrrrrrrrrrrrrr');
        },
      });
      this._subscription.add(saveEmplSub);
      this.showModal = false;
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.employeeForm.reset();
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    console.log('EntryFormComponent destroyed and unsubscribed.');
  }
}
