import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  // If URL already starts with http, leave it (for external APIs)
  if(req.url.startsWith('http')) {
    return next(req);
  }

  const apiReq = req.clone({
    url: `${environment.apiBaseUrl}${req.url}`
  });

  return next(apiReq);
};
