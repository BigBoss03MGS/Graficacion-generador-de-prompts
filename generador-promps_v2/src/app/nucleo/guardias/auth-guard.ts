import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../servicios/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authServicio = inject(Auth);
  const router = inject(Router);

  if (authServicio.estaAutenticado()) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
  
};
