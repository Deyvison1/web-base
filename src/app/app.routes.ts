import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

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
  {
    path: 'product',
    loadComponent: () =>
      import('./feature/product/product-grid/product-grid.component').then(
        (r) => r.ProductGridComponent,
      ),
  },
  {
    path: 'product/add',
    loadComponent: () =>
      import('./feature/product/product-form/product-form.component').then(
        (r) => r.ProductFormComponent,
      ),
  },

  {
    path: 'product/edit/:id',
    loadComponent: () =>
      import('./feature/product/product-form/product-form.component').then(
        (r) => r.ProductFormComponent,
      ),
  },

  {
    path: 'category',
    loadComponent: () =>
      import('./feature/category/category-grid/category-grid.component').then(
        (r) => r.CategoryGridComponent,
      ),
  },
  {
    path: 'category/add',
    loadComponent: () =>
      import('./feature/category/category-form/category-form.component').then(
        (r) => r.CategoryFormComponent,
      ),
  },

  {
    path: 'category/edit/:id',
    loadComponent: () =>
      import('./feature/category/category-form/category-form.component').then(
        (r) => r.CategoryFormComponent,
      ),
  },

  {
    path: 'forbidden',
    loadComponent: () =>
      import('./shared/components/forbidden/forbidden.component').then((r) => r.ForbiddenComponent),
  },

  {
    path: 'user',
    loadChildren: () => loadRemoteModule('keycloak-user-mf', './Routes').then((m) => m.routes),
  },
];
