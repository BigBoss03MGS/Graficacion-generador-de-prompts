import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaHistorial, RespuestaPromptDetalle } from '../../modelos/historial.modelo';


@Injectable({
  providedIn: 'root',
})
export class HistorialServicio {
  private readonly urlBase = 'http://localhost:3000/api/historial';

  constructor(private http: HttpClient) {}

  obtenerHistorial(): Observable<RespuestaHistorial> {
    return this.http.get<RespuestaHistorial>(this.urlBase);
  }

  obtenerPromptPorId(id: string): Observable<RespuestaPromptDetalle> {
    return this.http.get<RespuestaPromptDetalle>(`${this.urlBase}/${id}`);
  }

  toggleFavorito(id: string): Observable<any> {
    return this.http.patch(`${this.urlBase}/${id}/favorito`, {});
  }

  eliminarPrompt(id: string): Observable<any> {
    return this.http.delete(`${this.urlBase}/${id}`);
  }
  
}
