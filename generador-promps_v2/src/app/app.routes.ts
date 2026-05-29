import { Routes } from '@angular/router';
import { Login } from './modulos/auth/login/login';
import { authGuard } from './nucleo/guardias/auth-guard';
import { Dashboard } from './modulos/dashboard/dashboard';
import { Historial } from './modulos/historial/historial';
import { Configuracion } from './modulos/configuracion/configuracion';
import { NotFound } from './modulos/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', 
    component: Login },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'historial',
    component: Historial,
    canActivate: [authGuard],
  },
  {
    path: 'configuracion',
    component: Configuracion,
    canActivate: [authGuard],
  },
  { path: '**', component: NotFound },
];