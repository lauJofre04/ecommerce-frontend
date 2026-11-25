import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast';
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
  private toast = inject(ToastService);
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
        this.toast.exito('¡Cuenta creada con éxito! Ya podés iniciar sesión.');
        // Si sale bien, lo mandamos directo a la pantalla de Login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toast.error('Hubo un error al registrarte. Tal vez el email ya existe.');
        console.error(err);
      }
    });
  }
}