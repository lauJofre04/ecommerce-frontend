import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. Dejamos la URL base apuntando solo a la "puerta" de Auth
  private baseUrl = 'https://ecommerce-proyecto-backend.onrender.com/auth'; 

  constructor(private http: HttpClient) {}

  login(credentials: any) {
    // 2. Le agregamos /login acá
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      tap(response => {
        const tokenReal = response.access_token || response.token; 
        if (tokenReal) {
          localStorage.setItem('token', tokenReal); 
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.rol || decoded.role || null; 
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  register(userData: any) {
    // 3. Le agregamos /register acá
    return this.http.post<any>(`${this.baseUrl}/register`, userData);
  }

  verificarEmail(token: string) {
    // 4. Ahora sí la ruta queda perfecta: https://ecommerce-proyecto-backend.onrender.com/auth/verificar-email
    return this.http.post(`${this.baseUrl}/verificar-email`, { token: token });
  }
  forgotPassword(email: string) {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, nuevaPassword: string) {
    return this.http.post(`${this.baseUrl}/reset-password`, { token, nuevaPassword });
  }
}