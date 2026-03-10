import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { AdminPanelComponent } from './components/admin-panel/admin-panel';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'admin', component: AdminPanelComponent },
  { path: '**', redirectTo: '' } // Por si escriben cualquier cosa
];
