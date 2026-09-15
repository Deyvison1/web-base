import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'client',
    loadComponent: () =>
      import('./feature/client/client-grid/client-grid.component').then(
        (r) => r.ClientGridComponent,
      ),
  },
  {
    path: 'client/add',
    loadComponent: () =>
      import('./feature/client/client-form/client-form.component').then(
        (r) => r.ClientFormComponent,
      ),
  },
  {
    path: 'client/edit/:id',
    loadComponent: () =>
      import('./feature/client/client-form/client-form.component').then(
        (r) => r.ClientFormComponent,
      ),
  },
  {
    path: 'client/view/:id',
    loadComponent: () =>
      import('./feature/client/client-view/client-view.component').then(
        (r) => r.ClientViewComponent,
      ),
  },
];
