import { HttpInterceptorFn } from '@angular/common/http';

// Solo se envía el token a nuestro propio backend, nunca a servicios de terceros
const API_ORIGINS = [
  'https://ecommerce-proyecto-backend.onrender.com',
  'http://localhost:3000',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // En el render del servidor (SSR) no existe localStorage
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

  if (token && API_ORIGINS.some(origin => req.url.startsWith(origin))) {
    return next(req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    }));
  }

  // Sin token (usuario no logueado) o petición a otro dominio: sigue sin modificar
  return next(req);
};
