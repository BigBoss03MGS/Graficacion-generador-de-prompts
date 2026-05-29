import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RespuestaPrompt } from '../../modelos/documento.modelo';

@Injectable({
  providedIn: 'root',
})
export class Prompt {
  private readonly urlBase = 'http://localhost:3000/api/prompts';

  constructor(private http: HttpClient) {}

  generarPrompt(documentoId: string): Observable<RespuestaPrompt> {
    return this.http.post<RespuestaPrompt>(`${this.urlBase}/generar`, {
      documentoId,
    });
  }
  
}
