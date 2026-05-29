import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../nucleo/servicios/auth';
import { HistorialServicio } from '../../nucleo/servicios/historial-servicio';
import { PromptHistorial } from '../../modelos/historial.modelo';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  private authServicio = inject(Auth);
  private historialServicio = inject(HistorialServicio);
  private router = inject(Router);

  usuario = this.authServicio.usuarioActual;
  prompts = signal<PromptHistorial[]>([]);
  cargando = signal<boolean>(true);
  errorMensaje = signal<string>('');
  filtroActivo = signal<'todos' | 'favoritos'>('todos');
  promptSeleccionado = signal<PromptHistorial | null>(null);

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando.set(true);
    this.historialServicio.obtenerHistorial().subscribe({
      next: (respuesta) => {
        this.prompts.set(respuesta.datos.prompts);
        this.cargando.set(false);
      },
      error: () => {
        this.errorMensaje.set('Error al cargar el historial');
        this.cargando.set(false);
      },
    });
  }

  get promptsFiltrados(): PromptHistorial[] {
    if (this.filtroActivo() === 'favoritos') {
      return this.prompts().filter((p) => p.favorito);
    }
    return this.prompts();
  }

  // Método para contar favoritos sin usar arrow function en el template
  totalFavoritos(): number {
    return this.prompts().filter((p) => p.favorito).length;
  }

  cambiarFiltro(filtro: 'todos' | 'favoritos'): void {
    this.filtroActivo.set(filtro);
  }

  verPrompt(prompt: PromptHistorial): void {
    this.historialServicio.obtenerPromptPorId(prompt._id).subscribe({
      next: (respuesta) => {
        this.promptSeleccionado.set(respuesta.datos.prompt);
      },
      error: () => {
        this.errorMensaje.set('Error al cargar el prompt');
      },
    });
  }

  cerrarDetalle(): void {
    this.promptSeleccionado.set(null);
  }

  toggleFavorito(event: Event, id: string): void {
    event.stopPropagation();
    this.historialServicio.toggleFavorito(id).subscribe({
      next: () => {
        this.prompts.update((prompts) =>
          prompts.map((p) =>
            p._id === id ? { ...p, favorito: !p.favorito } : p
          )
        );
      },
    });
  }

  eliminarPrompt(event: Event, id: string): void {
    event.stopPropagation();
    this.historialServicio.eliminarPrompt(id).subscribe({
      next: () => {
        this.prompts.update((prompts) => prompts.filter((p) => p._id !== id));
        if (this.promptSeleccionado()?._id === id) {
          this.promptSeleccionado.set(null);
        }
      },
      error: () => {
        this.errorMensaje.set('Error al eliminar el prompt');
      },
    });
  }

  copiarPrompt(): void {
    const prompt = this.promptSeleccionado();
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.promptFinal);
  }

  descargarPrompt(): void {
    const prompt = this.promptSeleccionado();
    if (!prompt) return;
    const blob = new Blob([prompt.promptFinal], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${prompt.tipoProyecto}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  obtenerIniciales(): string {
    const nombre = this.usuario()?.nombre || '';
    return nombre.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  irDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  cerrarSesion(): void {
    this.authServicio.cerrarSesion();
  }
}