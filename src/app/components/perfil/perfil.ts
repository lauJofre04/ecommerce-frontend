import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // <-- 1. Importamos HttpClient
import { OrdenesService } from '../../services/ordenes';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './perfil.html'
})
export class Perfil implements OnInit {
  usuario: any = {
    id: null, // <-- Aseguramos tener el ID
    nombre: '', apellido: '', email: '', 
    direccion: '', ciudad: '', provincia: '', codigoPostal: ''
  };
  
  pestanaActiva: string = 'datos'; 
  ordenes: any[] = []; // Para guardar el historial de compras

  // 2. Inyectamos el HttpClient en el constructor
  constructor(private router: Router, private http: HttpClient,private ordenesService: OrdenesService) {}

  ngOnInit() {
  const userStr = localStorage.getItem('usuario'); 
    if (userStr) {
      const parsedData = JSON.parse(userStr);
      
      // Debug: Esto te va a mostrar en consola exactamente qué tiene el objeto
      console.log('Datos del usuario cargados:', parsedData);

      // Si los datos vienen dentro de .user, los extraemos, sino usamos el objeto raíz
      const info = parsedData.user ? parsedData.user : parsedData;

      // LE ASIGNAMOS EL ID MANUALMENTE PARA ESTAR SEGUROS
      // (Fijate en la consola si tu ID se llama 'id', 'id_usuario' o '_id')
      this.usuario = {
        ...info,
        id: info.id || parsedData.id // Intentamos sacarlo de cualquier lado
      };
      this.cargarHistorial();
    }
  }

  // 3. Modificamos la función para que haga la petición real
  guardarDatos() {
    if (!this.usuario.id) {
      alert('Error: No se encontró el ID del usuario. Por favor, volvé a iniciar sesión.');
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

    this.http.patch(`http://localhost:3000/users/${this.usuario.id}`, datosParaActualizar)
      .subscribe({
        next: (res) => {
          alert('¡Datos actualizados con éxito! ✅');
          localStorage.setItem('usuario', JSON.stringify(this.usuario));
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
        console.log('Historial cargado:', res);
      },
      error: (err) => {
        console.error('Error al traer órdenes:', err);
      }
    });
  }
}