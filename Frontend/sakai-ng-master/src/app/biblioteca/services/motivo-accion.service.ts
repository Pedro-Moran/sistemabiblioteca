import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { MotivoAccion } from '../interfaces/motivo-accion';

@Injectable({
  providedIn: 'root'
})
export class MotivoAccionService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
  }

  list(): Observable<MotivoAccion[]> {
    return this.http
      .get<{ data: any[] }>(`${this.apiUrl}/motivoaccion/lista`, { headers: this.headers() })
      .pipe(
        map(res =>
          res.data.map(m =>
            new MotivoAccion({
              id: m.idMotivoAccion,
              descripcion: m.descripcion,
              estado: m.estado
            })
          )
        )
      );
  }

  private toPayload(motivo: MotivoAccion) {
    return {
      idMotivoAccion: motivo.id || undefined,
      descripcion: motivo.descripcion,
      estado: motivo.estado
    };
  }

  create(motivo: MotivoAccion): Observable<MotivoAccion> {
    return this.http
      .post<{ data: any }>(`${this.apiUrl}/motivoaccion`, this.toPayload(motivo), { headers: this.headers() })
      .pipe(
        map(res =>
          new MotivoAccion({
            id: res.data.idMotivoAccion,
            descripcion: res.data.descripcion,
            estado: res.data.estado
          })
        )
      );
  }

  update(id: number, motivo: MotivoAccion): Observable<MotivoAccion> {
    return this.http
      .put<{ data: any }>(`${this.apiUrl}/motivoaccion/${id}`, this.toPayload(motivo), { headers: this.headers() })
      .pipe(
        map(res =>
          new MotivoAccion({
            id: res.data.idMotivoAccion,
            descripcion: res.data.descripcion,
            estado: res.data.estado
          })
        )
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/motivoaccion/${id}`, { headers: this.headers() });
  }
}
