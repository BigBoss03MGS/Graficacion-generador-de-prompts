import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../../nucleo/servicios/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  modoActivo = signal<'login' | 'registro'>('login');
  cargando = signal<boolean>(false);
  errorMensaje = signal<string>('');

  formulario = {
    nombre: '',
    email: '',
    contrasena: '',
  };

  constructor(
    private authServicio: Auth,
    private router: Router
  ) {}

  cambiarModo(modo: 'login' | 'registro') {
    this.modoActivo.set(modo);
    this.errorMensaje.set('');
    this.formulario = { nombre: '', email: '', contrasena: '' };
  }

  enviarFormulario() {
    this.errorMensaje.set('');
    this.cargando.set(true);

    if (this.modoActivo() === 'login') {
      this.authServicio.login({
        email: this.formulario.email,
        contrasena: this.formulario.contrasena,
      }).subscribe({
        next: () => {
          this.cargando.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.cargando.set(false);
          this.errorMensaje.set(
            err.error?.mensaje || 'Error al iniciar sesión'
          );
        },
      });
    } else {
      this.authServicio.registro({
        nombre: this.formulario.nombre,
        email: this.formulario.email,
        contrasena: this.formulario.contrasena,
      }).subscribe({
        next: () => {
          this.cargando.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.cargando.set(false);
          this.errorMensaje.set(
            err.error?.mensaje || 'Error al crear la cuenta'
          );
        },
      });
    }
  }
}
