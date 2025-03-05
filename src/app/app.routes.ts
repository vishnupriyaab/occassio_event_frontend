import { Routes } from '@angular/router';
import { HomeComponent } from './modules/user/home/home.component';
import { LoginComponent } from './modules/admin/login/login.component';

export const routes: Routes = [
  //user-side
  {
    path: '',
    component:HomeComponent,
  },

  //admin-side
  {
    path: 'admin-login',
    component: LoginComponent
  }
 
];
