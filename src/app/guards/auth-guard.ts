import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Buscamos si el usuario tiene su "entrada" guardada
    const token = localStorage.getItem('token'); 
    // (Si en tu login solo guardás 'usuario' y no 'token', cambiá 'token' por 'usuario' en la línea de arriba)

    if (token) {
      return true; // ¡Pase libre! Entra al perfil.
    } else {
      this.router.navigate(['/login']); // ¡Tarjeta roja! Lo mandamos a iniciar sesión.
      return false;
    }
  }
}