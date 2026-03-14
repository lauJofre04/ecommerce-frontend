import { Component, NgModule, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // Ajustá la ruta
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verificar-email',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="verificar-container" style="text-align: center; margin-top: 50px;">
      <h2>{{ mensaje }}</h2>
      <p *ngIf="cargando">Por favor, espera un momento...</p>
      <button *ngIf="!cargando" (click)="irAlLogin()" class="btn btn-primary">Ir al Login</button>
    </div>
  `
})
export class VerificarEmail implements OnInit {
  mensaje = 'Verificando tu cuenta...';
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Agarramos el token de la URL: ?token=asdf123...
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.verificarEmail(token).subscribe({
        next: (res) => {
          this.mensaje = '¡Cuenta verificada con éxito! 🎉';
          this.cargando = false;
        },
        error: (err) => {
          this.mensaje = 'El enlace es inválido o ya expiró. ❌';
          this.cargando = false;
        }
      });
    } else {
      this.mensaje = 'Token no encontrado.';
      this.cargando = false;
    }
  }

  irAlLogin() {
    this.router.navigate(['/login']);
  }
}