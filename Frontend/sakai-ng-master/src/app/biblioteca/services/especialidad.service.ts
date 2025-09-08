import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Especialidad } from '../interfaces/especialidad';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
  }

  list(): Observable<Especialidad[]> {
    return this.http
      .get<{ data: any[] }>(`${this.apiUrl}/especialidad/lista-activo`, { headers: this.headers() })
      .pipe(
        map(res =>
          res.data.map(e =>
            new Especialidad({
              id: e.idEspecialidad,
              descripcion: e.descripcion,
              activo: e.activo
            })
          )
        )
      );
  }

  private toPayload(especialidad: Especialidad) {
    return {
      idEspecialidad: especialidad.id || undefined,
      descripcion: especialidad.descripcion,
      activo: especialidad.activo
    };
  }

  create(especialidad: Especialidad): Observable<Especialidad> {
    return this.http
      .post<{ data: any }>(`${this.apiUrl}/especialidad`, this.toPayload(especialidad), { headers: this.headers() })
      .pipe(
        map(res =>
          new Especialidad({
            id: res.data.idEspecialidad,
            descripcion: res.data.descripcion,
            activo: res.data.activo
          })
        )
      );
  }

  update(id: number, especialidad: Especialidad): Observable<Especialidad> {
    return this.http
      .put<{ data: any }>(`${this.apiUrl}/especialidad/${id}`, this.toPayload(especialidad), { headers: this.headers() })
      .pipe(
        map(res =>
          new Especialidad({
            id: res.data.idEspecialidad,
            descripcion: res.data.descripcion,
            activo: res.data.activo
          })
        )
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/especialidad/${id}`, { headers: this.headers() });
  }
}
