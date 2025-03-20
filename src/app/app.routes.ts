import { Routes } from '@angular/router';
import { HomeComponent } from './modules/user/home/home.component';
import { LoginComponent } from './modules/admin/login/login.component';
import { MainComponent } from './shared/components/admin/main/main.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { ServiceComponent } from './modules/user/service/service.component';
import { EntryFormComponent } from './modules/user/entry-form/entry-form.component';
import { EntrySuccessComponent } from './modules/user/entry-success/entry-success.component';
import { AboutComponent } from './modules/user/about/about.component';

export const routes: Routes = [
  //user-side
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'services',
    component: ServiceComponent,
  },
  {
    path: 'entryForm',
    component: EntryFormComponent,
  },
  {
    path: 'entry-success',
    component: EntrySuccessComponent,
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
