import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ProgramaAccion } from '../interfaces/programa-accion';

@Injectable({
  providedIn: 'root'
})
export class ProgramaAccionService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
  }

  list(): Observable<ProgramaAccion[]> {
    return this.http
      .get<{ data: any[] }>(`${this.apiUrl}/programaaccion/lista`, { headers: this.headers() })
      .pipe(
        map(res =>
          res.data.map(p =>
            new ProgramaAccion({
              id: p.idProgramaAccion,
              descripcion: p.descripcion,
              estado: p.estado
            })
          )
        )
      );
  }

  private toPayload(programa: ProgramaAccion) {
    return {
      idProgramaAccion: programa.id || undefined,
      descripcion: programa.descripcion,
      estado: programa.estado
    };
  }

  create(programa: ProgramaAccion): Observable<ProgramaAccion> {
    return this.http
      .post<{ data: any }>(`${this.apiUrl}/programaaccion`, this.toPayload(programa), { headers: this.headers() })
      .pipe(
        map(res =>
          new ProgramaAccion({
            id: res.data.idProgramaAccion,
            descripcion: res.data.descripcion,
            estado: res.data.estado
          })
        )
      );
  }

  update(id: number, programa: ProgramaAccion): Observable<ProgramaAccion> {
    return this.http
      .put<{ data: any }>(`${this.apiUrl}/programaaccion/${id}`, this.toPayload(programa), { headers: this.headers() })
      .pipe(
        map(res =>
          new ProgramaAccion({
            id: res.data.idProgramaAccion,
            descripcion: res.data.descripcion,
            estado: res.data.estado
          })
        )
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/programaaccion/${id}`, { headers: this.headers() });
  }
}
