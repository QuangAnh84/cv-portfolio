import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

function toMessage(err: HttpErrorResponse): string {
  if (err.status === 0) return 'Network error. The server may be down or blocked (CORS).';
  if (typeof err.error === 'string' && err.error.trim()) return err.error;
  if (err.error?.message) return err.error.message;
  return err.message || 'Unexpected server error.';
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      if (!(err instanceof HttpErrorResponse)) return throwError(() => err);

      // Only handle backend API calls.
      if (!req.url.includes('/api/')) return throwError(() => err);

      // Let feature-specific pages handle expected errors (e.g., 401 on admin save).
      const shouldRedirect = err.status === 0 || err.status >= 500;
      if (shouldRedirect && router.url !== '/error') {
        void router.navigateByUrl('/error', {
          state: {
            status: err.status,
            message: toMessage(err),
            from: router.url,
            url: req.url,
          },
        });
      }

      return throwError(() => err);
    }),
  );
};

