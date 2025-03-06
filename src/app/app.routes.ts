import { Routes } from '@angular/router';
import { HomeComponent } from './modules/user/home/home.component';
import { LoginComponent } from './modules/admin/login/login.component';
import { MainComponent } from './shared/components/admin/main/main.component';
import { DashboardComponent } from './modules/admin/dashboard/dashboard.component';
import { PackageManagementComponent } from './modules/admin/package-management/package-management.component';
import { VenueManagementComponent } from './modules/admin/venue-management/venue-management.component';
import { SeatingManagementComponent } from './modules/admin/seating-management/seating-management.component';
import { FoodManagementComponent } from './modules/admin/food-management/food-management.component';
import { DecorationManagementComponent } from './modules/admin/decoration-management/decoration-management.component';
import { SoundManagementComponent } from './modules/admin/sound-management/sound-management.component';
import { PhotoManagementComponent } from './modules/admin/photo-management/photo-management.component';
import { MiscellaneousManagementComponent } from './modules/admin/miscellaneous-management/miscellaneous-management.component';

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
      },
      {
        path: 'package',
        component: PackageManagementComponent
      },
      {
        path: 'venue',
        component: VenueManagementComponent
      },
      {
        path: 'seating',
        component: SeatingManagementComponent
      },
      {
        path: 'food',
        component: FoodManagementComponent
      },
      {
        path: 'decoration',
        component: DecorationManagementComponent
      },
      {
        path: 'sound',
        component: SoundManagementComponent
      },
      {
        path: 'photo-video',
        component: PhotoManagementComponent
      },
      {
        path: 'miscellaneous',
        component: MiscellaneousManagementComponent
      },
    ]
  }
 
];
