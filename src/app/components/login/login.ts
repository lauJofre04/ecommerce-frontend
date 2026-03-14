import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './login.html'
})
export class Login {
  credenciales = {
    email: '',
    password: ''
  };
  
  // 👇 1. Agregamos esta variable para atajar el error
  mensajeError: string | null = null;
  verPassword = false;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // Limpiamos el error viejo si el usuario vuelve a intentar
    this.mensajeError = null;

    this.authService.login(this.credenciales).subscribe({
      next: (res: any) => {
        const token = res.access_token || res.token;
        if (token) {
          localStorage.setItem('token', token);
        }

        const datosUsuario = res.usuario || res.user || res;
        localStorage.setItem('usuario', JSON.stringify(datosUsuario));

        this.router.navigate(['/']);
      },
      error: (err) => {
        // 👇 2. Atrapamos el mensaje que manda NestJS en la respuesta de error
        if (err.error && err.error.message) {
          // Si es un array de errores (a veces pasa con las validaciones de Nest)
          if (Array.isArray(err.error.message)) {
            this.mensajeError = err.error.message[0];
          } else {
            // Este es el mensaje de "Por favor, verificá tu correo..."
            this.mensajeError = err.error.message;
          }
        } else {
          this.mensajeError = 'Credenciales incorrectas o error en el servidor.';
        }
        console.error('Error del backend:', err);
      }
    });
  }
}