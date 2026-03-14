import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ACORDATE: Cambiá esta URL por la exacta que usabas en ThunderClient
  private apiUrl = 'http://localhost:3000/auth/login'; 
  private usersUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        // CHISMOSO: Imprime en consola lo que mandó el backend
         

        // Probablemente tu backend use "access_token" en lugar de "token"
        const tokenReal = response.access_token || response.token; 
        
        if (tokenReal) {
          localStorage.setItem('token', tokenReal); 
        }
      })
    );
  }

  // Método para saber si el usuario está logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Método para obtener el rol actual
  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        
        // CHISMOSO: Para ver qué hay adentro del token
         

        // Buscamos "rol" (como está en Prisma) o "role" por las dudas
        return decoded.rol || decoded.role || null; 
        
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  register(userData: any) {
    // Mandamos el nombre, email y password al backend
    return this.http.post<any>(this.usersUrl, userData);
  }
}