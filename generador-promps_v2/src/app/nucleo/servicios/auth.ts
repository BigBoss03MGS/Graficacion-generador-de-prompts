import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {RespuestaAuth, PeticionLogin, PeticionRegistro, Usuario} from '../../modelos/usuario.modelo';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly urlBase = 'http://localhost:3000/api/auth';

  usuarioActual = signal<Usuario | null>(null);
  estaAutenticado = signal<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.verificarSesionGuardada();
  }

  login(datos: PeticionLogin): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(`${this.urlBase}/login`, datos).pipe(
      tap((respuesta) => {
        if (respuesta.exito) {
          this.guardarSesion(respuesta.datos.token, respuesta.datos.usuario);
        }
      })
    );
  }

  registro(datos: PeticionRegistro): Observable<RespuestaAuth> {
    return this.http.post<RespuestaAuth>(`${this.urlBase}/registro`, datos).pipe(
      tap((respuesta) => {
        if (respuesta.exito) {
          this.guardarSesion(respuesta.datos.token, respuesta.datos.usuario);
        }
      })
    );
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioActual.set(null);
    this.estaAutenticado.set(false);
    this.router.navigate(['/auth']);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  private guardarSesion(token: string, usuario: Usuario): void {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    this.usuarioActual.set(usuario);
    this.estaAutenticado.set(true);
  }

  private verificarSesionGuardada(): void {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (token && usuarioGuardado) {
      this.usuarioActual.set(JSON.parse(usuarioGuardado));
      this.estaAutenticado.set(true);
    }
  }
}
