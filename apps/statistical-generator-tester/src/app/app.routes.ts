import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'callback', redirectTo: '/home' },
  {
    path: 'core',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
    // canActivateChild: [AuthGuard],
  },
  { path: '**', redirectTo: '/home' },
];
