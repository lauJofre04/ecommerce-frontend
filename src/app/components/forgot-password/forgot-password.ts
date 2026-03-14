import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth'; // Ajustá tu ruta

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html'
})
export class ForgotPassword {
  email = '';
  mensaje: string | null = null;
  error: string | null = null;
  cargando = false;

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.cargando = true;
    this.mensaje = null;
    this.error = null;

    this.authService.forgotPassword(this.email).subscribe({
      next: (res: any) => {
        this.mensaje = res.message || 'Correo enviado. Revisá tu bandeja de entrada.';
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Hubo un error al procesar tu solicitud.';
        this.cargando = false;
      }
    });
  }
}