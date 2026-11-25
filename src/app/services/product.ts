import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, Producto } from '../interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://ecommerce-proyecto-backend.onrender.com/products'; // Tu backend de Nest
  
  constructor(private http: HttpClient) { }

  getProducts(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
  getProductById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }
  // Agrega esto dentro de la clase ProductService
  createProduct(formData: FormData): Observable<any> {
    // El token del usuario logueado lo agrega authInterceptor
    return this.http.post(this.apiUrl, formData);
  }
  updateProduct(id: number, productData: FormData): Observable<any> {
  // El token del usuario logueado lo agrega authInterceptor
  return this.http.patch<any>(`${this.apiUrl}/${id}`, productData);
}
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // En product.service.ts
  getCategories(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>('https://ecommerce-proyecto-backend.onrender.com/categories');
  }

  createCategory(nombre: string): Observable<any> {
    return this.http.post('https://ecommerce-proyecto-backend.onrender.com/categories', { nombre });
  }
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`https://ecommerce-proyecto-backend.onrender.com/categories/${id}`);
  }
}