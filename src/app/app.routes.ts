import { Routes } from '@angular/router';
import { HomeComponent } from './modules/user/home/home.component';
import { LoginComponent } from './modules/admin/login/login.component';
import { MainComponent } from './shared/components/admin/main/main.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';

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
  },
  {
    path: 'admin',
    component: MainComponent,
    children:[
      {
        path: 'dashboard',
        component: DashboardComponent
      }
    ]
  }
 
];
