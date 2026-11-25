import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orden } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private apiUrl = 'https://ecommerce-proyecto-backend.onrender.com/ordenes'; // Ajustá según tu puerto

  constructor(private http: HttpClient) { }

  // Obtenemos todas las órdenes del usuario logueado
  getMisCompras(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.apiUrl);
  }

  // Opcional: Crear una orden nueva desde el checkout
  crearOrden(datosOrden: object): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, datosOrden);
  }
  // En ordenes.service.ts agregamos:

  // Para el panel de Admin: Trae TODAS las compras de la tienda
  getAllOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/todas`);
  }

  // Para el panel de Admin: Cambia el estado de una compra
  cambiarEstado(ordenId: number, nuevoEstado: string): Observable<Orden> {
    return this.http.patch<Orden>(`${this.apiUrl}/${ordenId}/estado`, { estado: nuevoEstado });
  }
}