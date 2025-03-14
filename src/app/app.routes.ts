import { Routes } from '@angular/router';
import { HomeComponent } from './modules/user/home/home.component';
import { LoginComponent } from './modules/admin/login/login.component';
import { MainComponent } from './shared/components/admin/main/main.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { ServiceComponent } from './modules/user/service/service.component';
import { EntryFormComponent } from './modules/user/entry-form/entry-form.component';

export const routes: Routes = [
  //user-side
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'services',
    component: ServiceComponent,
  },
  {
    path: 'entryForm',
    component: EntryFormComponent,
  },

  //admin-side
  {
    path: 'admin-login',
    component: LoginComponent,
  },
  {
    path: 'admin',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
    ],
  },
];
