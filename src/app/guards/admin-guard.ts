import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Le pedimos el rol al servicio
  const rolActual = authService.getRole(); 
  
  console.log('💂‍♂️ El Guard está revisando tu rol...');
  console.log('👉 Rol que encontró:', rolActual);

  // Comparamos exactamente con 'ADMIN' (que es lo que dice tu token)
  if (rolActual === 'ADMIN') {
    console.log('✅ ¡Pase VIP concedido! Entrando al panel...');
    return true;
  }

  // Si por algún motivo no coincide, te patea y te dice por qué
  console.log('🚫 Acceso denegado. Te mandamos al inicio.');
  router.navigate(['/']);
  return false;
};