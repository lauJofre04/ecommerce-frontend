import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class Login {
  credenciales = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.login(this.credenciales).subscribe({
      next: (res: any) => {
        // 1. Atajamos el token de seguridad y lo guardamos
        const token = res.access_token || res.token;
        if (token) {
          localStorage.setItem('token', token);
        }

        // 2. Atajamos los datos del usuario y los guardamos como texto (JSON)
        // (Atajamos 'res.usuario', 'res.user' o 'res' dependiendo de cómo lo mande tu backend)
        const datosUsuario = res.usuario || res.user || res;
        localStorage.setItem('usuario', JSON.stringify(datosUsuario));

        // 3. Ahora sí, con los datos en la mochila, viajamos al inicio
        this.router.navigate(['/']);
      },
      error: (err) => {
        alert('Credenciales incorrectas');
        console.error(err);
      }
    });
  }
}