import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../nucleo/servicios/auth';
import { Archivo } from '../../nucleo/servicios/archivo';
import { Prompt } from '../../nucleo/servicios/prompt';
import { Documento } from '../../modelos/documento.modelo';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private authServicio = inject(Auth);
  private archivoServicio = inject(Archivo);
  private promptServicio = inject(Prompt);
  private router = inject(Router);

  // Estados
  archivoSeleccionado = signal<File | null>(null);
  documentoSubido = signal<Documento | null>(null);
  subiendo = signal<boolean>(false);
  generando = signal<boolean>(false);
  progreso = signal<number>(0);
  errorMensaje = signal<string>('');
  promptGenerado = signal<any>(null);
  arrastrando = signal<boolean>(false);

  // Usuario actual
  usuario = this.authServicio.usuarioActual;

  // Obtiene las iniciales del nombre
  obtenerIniciales(): string {
    const nombre = this.usuario()?.nombre || '';
    return nombre
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Formatea el tamaño del archivo
  formatearTamano(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Maneja el drag over
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.arrastrando.set(true);
  }

  // Maneja el drag leave
  onDragLeave(): void {
    this.arrastrando.set(false);
  }

  // Maneja el drop
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.arrastrando.set(false);
    const archivo = event.dataTransfer?.files[0];
    if (archivo) this.procesarArchivo(archivo);
  }

  // Maneja la selección por click
  onSeleccionarArchivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (archivo) this.procesarArchivo(archivo);
  }

  // Procesa el archivo seleccionado
  procesarArchivo(archivo: File): void {
    this.errorMensaje.set('');
    this.archivoSeleccionado.set(archivo);
    this.documentoSubido.set(null);
    this.promptGenerado.set(null);
    this.subirArchivo(archivo);
  }

  // Sube el archivo al backend
  subirArchivo(archivo: File): void {
    this.subiendo.set(true);
    this.progreso.set(30);

    this.archivoServicio.subirArchivo(archivo).subscribe({
      next: (respuesta) => {
        this.progreso.set(100);
        this.subiendo.set(false);
        this.documentoSubido.set(respuesta.datos);
      },
      error: (err) => {
        this.subiendo.set(false);
        this.progreso.set(0);
        this.errorMensaje.set(
          err.error?.mensaje || 'Error al subir el archivo'
        );
      },
    });
  }

  // Genera el prompt
  generarPrompt(): void {
    const doc = this.documentoSubido();
    if (!doc) return;

    this.generando.set(true);
    this.progreso.set(50);

    this.promptServicio.generarPrompt(doc.documentoId).subscribe({
      next: (respuesta) => {
        this.generando.set(false);
        this.progreso.set(100);
        this.promptGenerado.set(respuesta.datos.prompt);
      },
      error: (err) => {
        this.generando.set(false);
        this.errorMensaje.set(
          err.error?.mensaje || 'Error al generar el prompt'
        );
      },
    });
  }

  // Copia el prompt al portapapeles
  copiarPrompt(): void {
    const prompt = this.promptGenerado();
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.promptFinal);
  }

  // Descarga el prompt como archivo
  descargarPrompt(): void {
    const prompt = this.promptGenerado();
    if (!prompt) return;
    const blob = new Blob([prompt.promptFinal], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${prompt.tipoProyecto}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Reinicia para subir otro archivo
  nuevoPrompt(): void {
    this.archivoSeleccionado.set(null);
    this.documentoSubido.set(null);
    this.promptGenerado.set(null);
    this.progreso.set(0);
    this.errorMensaje.set('');
  }

  cerrarSesion(): void {
    this.authServicio.cerrarSesion();
  }

  irHistorial(): void {
  this.router.navigate(['/historial']);
}

irConfiguracion(): void {
  this.router.navigate(['/configuracion']);
}

}
