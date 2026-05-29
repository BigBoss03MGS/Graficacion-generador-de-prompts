import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaDocumento } from '../../modelos/documento.modelo';

@Injectable({
  providedIn: 'root',
})
export class Archivo {
  private readonly urlBase = 'http://localhost:3000/api/archivos';

  constructor(private http: HttpClient) {}

  subirArchivo(archivo: File): Observable<RespuestaDocumento> {
    const formData = new FormData();
    formData.append('archivo', archivo);
    return this.http.post<RespuestaDocumento>(`${this.urlBase}/subir`, formData);
  }
  
}
