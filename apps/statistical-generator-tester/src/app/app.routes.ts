import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/generators', pathMatch: 'full' },
  { path: 'callback', redirectTo: '/generators' },
  {
    path: 'generators',
    loadChildren: () =>
      import('./generators/generators.module').then((m) => m.GeneratorsModule),
  },
  {
    path: 'own-numbers',
    loadChildren: () =>
      import('./own-numbers/own-numbers.module').then(
        (m) => m.OwnNumbersModule
      ),
  },
  { path: '**', redirectTo: '/generators' },
];
