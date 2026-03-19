import { HttpInterceptorFn } from '@angular/common/http';

function base64Encode(input: string): string {
  // btoa is fine for ASCII usernames/passwords (recommended here).
  return btoa(input);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const creds = localStorage.getItem('adminBasicAuth');
  if (!creds) return next(req);

  if (!req.url.includes('/api/admin/')) return next(req);

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Basic ${base64Encode(creds)}`,
    },
    withCredentials: true,
  });
  return next(cloned);
};

