import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products'; // Tu backend de Nest
  
  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  // Agrega esto dentro de la clase ProductService
  createProduct(formData: FormData): Observable<any> {
    const token= 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxhdUBlamVtcGxvLmNvbSIsInN1YiI6Mywicm9sIjoiQURNSU4iLCJpYXQiOjE3NzMxMDAyMzEsImV4cCI6MTc3MzE4NjYzMX0.wQebOA-3nqrB9waz0IW33ADzNgw1VO5i43eD4K2D4B8';
    const headers = {
      'Authorization': `Bearer ${token}`
    };
    return this.http.post(this.apiUrl, formData,{headers});
  }
  updateProduct(id: number, productData: FormData): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, productData); 
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // En product.service.ts
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/categories');
  }

  createCategory(nombre: string): Observable<any> {
    return this.http.post('http://localhost:3000/categories', { nombre });
  }
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/categories/${id}`);
  }
}