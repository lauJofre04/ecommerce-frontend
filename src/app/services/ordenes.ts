import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {
  private apiUrl = 'http://localhost:3000/ordenes'; // Ajustá según tu puerto

  constructor(private http: HttpClient) { }

  // Obtenemos todas las órdenes del usuario logueado
  getMisCompras(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Opcional: Crear una orden nueva desde el checkout
  crearOrden(datosOrden: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, datosOrden);
  }
  // En ordenes.service.ts agregamos:

  // Para el panel de Admin: Trae TODAS las compras de la tienda
  getAllOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todas`);
  }

  // Para el panel de Admin: Cambia el estado de una compra
  cambiarEstado(ordenId: number, nuevoEstado: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${ordenId}/estado`, { estado: nuevoEstado });
  }
}