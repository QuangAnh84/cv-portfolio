import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cv' },
  {
    path: 'cv',
    loadComponent: () => import('./pages/cv-page/cv-page.component').then((m) => m.CvPageComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin-page/admin-page.component').then((m) => m.AdminPageComponent),
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./pages/error-page/error-page.component').then((m) => m.ErrorPageComponent),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page.component').then((m) => m.NotFoundPageComponent),
  },
  { path: '**', redirectTo: 'not-found' },
];
