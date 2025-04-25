import { Routes } from '@angular/router';
import { HomeComponent } from './modules/user/home/home.component';
import { LoginComponent } from './modules/admin/login/login.component';
import { MainComponent } from './shared/components/admin/main/main.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { ServiceComponent } from './modules/user/service/service.component';
import { EntryFormComponent } from './modules/user/entry-form/entry-form.component';
import { EntrySuccessComponent } from './modules/user/entry-success/entry-success.component';
import { AboutComponent } from './modules/user/about/about.component';
import { EntryPaymentDoneComponent } from './modules/user/entry-payment-done/entry-payment-done.component';
import { EmployeesComponent } from './modules/admin/employees/employees.component';
import { EmployeeLoginComponent } from './modules/employee/employee-login/employee-login.component';
import { ResetPasswordComponent } from './shared/components/common/reset-password/reset-password.component';
import { EmplMainComponent } from './shared/components/employee/empl-main/empl-main.component';
import { MyClientsComponent } from './modules/employee/my-clients/my-clients.component';
import { UserLoginComponent } from './modules/user/user-login/user-login.component';
import { ClientsComponent } from './modules/admin/clients/clients.component';
import { EDashboardComponent } from './modules/employee/e-dashboard/e-dashboard.component';
import { ChatWithClientComponent } from './modules/employee/chat-with-client/chat-with-client.component';
import { SubscriptionHomeComponent } from './modules/user/subscription-home/subscription-home.component';
import { SubscriptionDetailsComponent } from './modules/user/subscription-details/subscription-details.component';
import { ChatWithEmployeeComponent } from './modules/user/chat-with-employee/chat-with-employee.component';
import { EstimationComponent } from './modules/employee/estimation/estimation.component';
import { VideoCallComponent } from './shared/components/common/video-call/video-call.component';

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
    path: 'entry-payment-success',
    component: EntryPaymentDoneComponent,
  },
  {
    path: 'entry-success',
    component: EntrySuccessComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'user-login',
    component: UserLoginComponent,
  },
  {
    path: 'sub-home',
    component: SubscriptionHomeComponent,
  },
  {
    path: 'sub-details',
    component: SubscriptionDetailsComponent,
  },
  {
    path: 'chat-with-employee',
    component: ChatWithEmployeeComponent,
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
      {
        path: 'employees',
        component: EmployeesComponent,
      },
      {
        path: 'clients',
        component: ClientsComponent,
      },
    ],
  },

  //employee-Side
  {
    path: 'employee-login',
    component: EmployeeLoginComponent,
  },
  {
    path: 'employee',
    component: EmplMainComponent,
    children: [
      {
        path: 'dashboard',
        component: EDashboardComponent,
      },
      {
        path: 'clients',
        component: MyClientsComponent,
      },
    ],
  },
  {
    path: 'chat-with-client',
    component: ChatWithClientComponent,
  },
  {
    path: 'estimation',
    component: EstimationComponent,
  },
  {
    path: 'video-call',
    component: VideoCallComponent,
  },
];
