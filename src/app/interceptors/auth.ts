// app/interceptors/auth.ts

import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Clone the request and add withCredentials to send cookies
  const clonedRequest = req.clone({
    withCredentials: true
  });

  return next(clonedRequest);
};