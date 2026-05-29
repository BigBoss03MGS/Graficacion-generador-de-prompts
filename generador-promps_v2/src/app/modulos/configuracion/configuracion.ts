import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../nucleo/servicios/auth';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion {
   private authServicio = inject(Auth);
  private router = inject(Router);

  usuario = this.authServicio.usuarioActual;

  obtenerIniciales(): string {
    const nombre = this.usuario()?.nombre || '';
    return nombre.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  irDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  irHistorial(): void {
    this.router.navigate(['/historial']);
  }

  cerrarSesion(): void {
    this.authServicio.cerrarSesion();
  }

}
