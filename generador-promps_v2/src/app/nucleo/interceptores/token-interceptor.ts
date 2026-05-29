import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../servicios/auth';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authServicio = inject(Auth);
  const token = authServicio.obtenerToken();

  if (token) {
    const reqConToken = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(reqConToken);
  }

  return next(req);
};
