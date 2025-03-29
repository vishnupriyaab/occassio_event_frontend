import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from '../../../shared/components/common/login-form/login-form.component';

@Component({
  selector: 'app-employee-login',
  imports: [RouterModule, LoginFormComponent],
  templateUrl: './employee-login.component.html',
  styleUrl: './employee-login.component.css',
})
export class EmployeeLoginComponent {}
