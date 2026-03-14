import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OrdenesService } from '../../services/ordenes';
// 👇 1. Importamos jwtDecode
import { jwtDecode } from "jwt-decode"; 

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './perfil.html'
})
export class Perfil implements OnInit {
  usuario: any = {
    id: null, 
    nombre: '', apellido: '', email: '', 
    direccion: '', ciudad: '', provincia: '', codigoPostal: ''
  };
  
  pestanaActiva: string = 'datos'; 
  ordenes: any[] = []; 

  constructor(private router: Router, private http: HttpClient, private ordenesService: OrdenesService) {}

  ngOnInit() {
    // 2. Buscamos el TOKEN en lugar del "usuario"
    const token = localStorage.getItem('token') || localStorage.getItem('usuario'); 

    if (token) {
      try {
        // Si lo guardaste como JSON (como vimos en tu captura), extraemos el string del token
        const tokenString = token.includes('access_token') ? JSON.parse(token).access_token : token;
        
        // 3. ¡Abrimos el token! 
        const decodedToken: any = jwtDecode(tokenString);

        // El ID suele estar en "sub" (subject) o "id"
        const userId = decodedToken.sub || decodedToken.id;

        if (userId) {
          // 4. Vamos a buscar los datos reales al Backend
          this.http.get(`https://ecommerce-proyecto-backend.onrender.com/users/${userId}`).subscribe({
            next: (datosRealesDelUsuario: any) => {
              this.usuario = datosRealesDelUsuario; // Llenamos el HTML con la posta
              this.cargarHistorial();
            },
            error: (err) => {
              console.error('Error al pedir datos al backend:', err);
              // Si falla, al menos le ponemos el email que venía en el token
              this.usuario.email = decodedToken.email || '';
            }
          });
        }
      } catch (error) {
        console.error('Error leyendo el token:', error);
      }
    } else {
      console.warn('⚠️ No hay token guardado. El usuario no está logueado.');
    }
  }

  // ... (guardarDatos, cerrarSesion y cargarHistorial quedan IGUAL que antes) ...
  guardarDatos() {
    if (!this.usuario.id) {
      alert('Error: No se encontró el ID del usuario.');
      return;
    }

    const datosParaActualizar = {
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      direccion: this.usuario.direccion,
      ciudad: this.usuario.ciudad,
      provincia: this.usuario.provincia,
      codigoPostal: this.usuario.codigoPostal
    };

    this.http.patch(`https://ecommerce-proyecto-backend.onrender.com/users/${this.usuario.id}`, datosParaActualizar)
      .subscribe({
        next: (res) => {
          alert('¡Datos actualizados con éxito! ✅');
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al guardar. Mirá la consola para más detalle.');
        }
      });
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  cargarHistorial() {
    this.ordenesService.getMisCompras().subscribe({
      next: (res) => {
        this.ordenes = res;
      },
      error: (err) => {
        console.error('Error al traer órdenes:', err);
      }
    });
  }
}