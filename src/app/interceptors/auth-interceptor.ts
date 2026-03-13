import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // Buscamos la llave

  // Si hay token, se lo pegamos a la petición
  if (token) {
    const peticionClonada = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Formato estándar de JWT
      }
    });
    return next(peticionClonada);
  }

  // Si no hay token (ej: un usuario no logueado viendo productos), sigue normal
  return next(req);
};