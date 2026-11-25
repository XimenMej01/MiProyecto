import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Estadisticas, Semilla, SemillaRequest } from '../models/semilla.model';

@Injectable({ providedIn: 'root' })
export class SemillaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/semillas`;

  listar(): Observable<Semilla[]> {
    return this.http.get<Semilla[]>(this.baseUrl);
  }

  buscarPorId(id: number): Observable<Semilla> {
    return this.http.get<Semilla>(`${this.baseUrl}/${id}`);
  }

  registrar(datos: SemillaRequest): Observable<Semilla> {
    return this.http.post<Semilla>(this.baseUrl, datos);
  }

  actualizar(id: number, datos: SemillaRequest): Observable<Semilla> {
    return this.http.put<Semilla>(`${this.baseUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  estadisticas(): Observable<Estadisticas> {
    return this.http.get<Estadisticas>(`${this.baseUrl}/estadisticas`);
  }
}
