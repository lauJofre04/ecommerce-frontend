import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  // Ajustá esta URL a la que use tu backend de NestJS
  private apiUrl = 'https://ecommerce-proyecto-backend.onrender.com/payments'; 

  constructor(private http: HttpClient) { }

  // Esta función es la que llama tu carrito
  createPreference(datosPago: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-preference`, datosPago);
  }
}