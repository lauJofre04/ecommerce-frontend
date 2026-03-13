import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // RouterModule para el link de "Volver al login"
  templateUrl: './register.html'
})
export class RegisterComponent {
  nuevoUsuario = {
    nombre: '',
    apellido:'',
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.authService.register(this.nuevoUsuario).subscribe({
      next: (res) => {
        alert('¡Cuenta creada con éxito! Ya podés iniciar sesión.');
        // Si sale bien, lo mandamos directo a la pantalla de Login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Hubo un error al registrarte. Tal vez el email ya existe.');
        console.error(err);
      }
    });
  }
}