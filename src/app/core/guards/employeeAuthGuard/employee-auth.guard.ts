import { CanActivateFn } from '@angular/router';

export const employeeAuthGuard: CanActivateFn = (route, state) => {
  return true;
};
