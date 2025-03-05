import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  emailFormatValidator,
  noAllSpacesValidator,
} from '../../../validator/formValidator';
import { AdminAuthService } from '../../../../core/services/admin/authService/admin-auth.service';
import { response } from 'express';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent implements OnInit {
  @Input() formType: 'user' | 'employee' | 'admin' = 'user';
  loginForm!: FormGroup;

  constructor(private _fb: FormBuilder,
    private adminAuthService: AdminAuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: [
        '',
        [Validators.required, noAllSpacesValidator(), emailFormatValidator()],
      ],
      password: ['', [Validators.required]],
    });
  }

  formOnSubmit() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    console.log(email,password,"1212121212")
    this.adminAuthService.login(email,password).subscribe({
      next:(response)=>{
        console.log(response,"responseee");
      },
      error:(error)=>{
        console.log(error,"error")
      }
    })
  }

  hasError(controlName: string, errorName: string) {
    return this.loginForm.controls[controlName].hasError(errorName);
  }
}
