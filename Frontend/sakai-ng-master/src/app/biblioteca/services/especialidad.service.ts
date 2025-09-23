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
      .pipe(map(res => res.data.map(e => this.mapEspecialidad(e))));
  }

  private toPayload(especialidad: Especialidad) {
    const codigo = especialidad.codigo?.trim();
    const descripcion = especialidad.descripcion?.trim();
    return {
      idEspecialidad: especialidad.id || undefined,
      programa: especialidad.programaId != null ? { idPrograma: especialidad.programaId } : null,
      codigoEspecialidad: codigo || undefined,
      descripcion: descripcion || undefined,
      activo: especialidad.activo
    };
  }

  create(especialidad: Especialidad): Observable<Especialidad> {
    return this.http
      .post<{ data: any }>(`${this.apiUrl}/especialidad`, this.toPayload(especialidad), { headers: this.headers() })
      .pipe(map(res => this.mapEspecialidad(res.data)));
  }

  update(id: number, especialidad: Especialidad): Observable<Especialidad> {
    return this.http
      .put<{ data: any }>(`${this.apiUrl}/especialidad/${id}`, this.toPayload(especialidad), { headers: this.headers() })
      .pipe(map(res => this.mapEspecialidad(res.data)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/especialidad/${id}`, { headers: this.headers() });
  }

  private mapEspecialidad(data: any): Especialidad {
    return new Especialidad({
      id: data?.idEspecialidad ?? 0,
      codigo: data?.codigoEspecialidad ?? '',
      descripcion: data?.descripcion ?? '',
      activo: this.normalizeActivo(data?.activo),
      programaId: data?.programa?.idPrograma ?? null,
      programaCodigo: data?.programa?.programa ?? '',
      programaDescripcion: data?.programa?.descripcionPrograma ?? ''
    });
  }

  private normalizeActivo(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      return normalized === '1' || normalized === 'true' || normalized === 't';
    }

    return false;
  }
}
