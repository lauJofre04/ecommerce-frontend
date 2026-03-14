import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Le pedimos el rol al servicio
  const rolActual = authService.getRole(); 
  
  
  

  // Comparamos exactamente con 'ADMIN' (que es lo que dice tu token)
  if (rolActual === 'ADMIN') {
    
    return true;
  }

  // Si por algún motivo no coincide, te patea y te dice por qué
  
  router.navigate(['/']);
  return false;
};