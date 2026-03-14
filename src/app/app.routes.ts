import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { AdminPanelComponent } from './components/admin-panel/admin-panel';
import { Cart } from './components/cart/cart';
import { Login } from './components/login/login';
import { adminGuard} from './guards/admin-guard';
import { RegisterComponent } from './components/register/register';
import { Perfil } from './components/perfil/perfil';
import { AuthGuard } from './guards/auth-guard';
import { ProductoDetalle } from './components/producto-detalle/producto-detalle';
import { Checkout } from './components/checkout/checkout';
import { VerificarEmail } from './components/verificar-email/verificar-email';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { ResetPassword } from './components/reset-password/reset-password';

export const routes: Routes = [
  { path: '', component: ProductList },
  { path: 'carrito', component: Cart },
  { path: 'login', component: Login },
  
  { 
    path: 'admin', 
    component: AdminPanelComponent, 
    canActivate: [adminGuard] // <-- ¡Acá ponemos el patovica!
  }, // Por si escriben cualquier cosa
  { path: 'registro', component: RegisterComponent },
  { path: 'perfil', component: Perfil, canActivate: [AuthGuard] }, // <-- ¡Acá ponemos el patovica!
  { path: 'producto/:id', component: ProductoDetalle },
  { path: 'checkout', component: Checkout, canActivate: [AuthGuard] },
  { path: 'verificar-email', component: VerificarEmail },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'reset-password', component: ResetPassword },
  { path: '**', redirectTo: '' }
];
