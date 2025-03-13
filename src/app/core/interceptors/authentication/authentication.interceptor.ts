import { HttpInterceptorFn } from '@angular/common/http';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedReq = req.clone({ withCredentials: true });
  return next(modifiedReq);
};
