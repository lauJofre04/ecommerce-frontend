import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // Ajustá tu ruta

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.html'
})
export class ResetPassword implements OnInit {
  nuevaPassword = '';
  token = '';
  mensaje: string | null = null;
  error: string | null = null;
  verPassword = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Agarramos el token de la URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  onSubmit() {
    if (!this.token) {
      this.error = 'No se encontró un token válido en la URL.';
      return;
    }

    this.authService.resetPassword(this.token, this.nuevaPassword).subscribe({
      next: () => {
        this.mensaje = '¡Contraseña actualizada con éxito! Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'El enlace es inválido o expiró.';
      }
    });
  }
}