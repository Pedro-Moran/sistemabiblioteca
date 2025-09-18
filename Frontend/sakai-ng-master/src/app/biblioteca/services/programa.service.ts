import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Programa } from '../interfaces/programa';

@Injectable({
  providedIn: 'root'
})
export class ProgramaService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
  }

  list(): Observable<Programa[]> {
    return this.http
      .get<{ data: any[] }>(`${this.apiUrl}/programa/lista`, { headers: this.headers() })
      .pipe(
        map(res =>
          res.data.map(p =>
            new Programa({
              id: p.idPrograma,
              programa: p.programa,
              descripcionPrograma: p.descripcionPrograma,
              activo: this.normalizeActivo(p.activo)
            })
          )
        )
      );
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

  private toPayload(programa: Programa) {
    return {
      idPrograma: programa.id || undefined,
      programa: programa.programa,
      descripcionPrograma: programa.descripcionPrograma,
      activo: programa.activo
    };
  }

  create(programa: Programa): Observable<Programa> {
    return this.http
      .post<{ data: any }>(`${this.apiUrl}/programa`, this.toPayload(programa), { headers: this.headers() })
      .pipe(
        map(res =>
          new Programa({
            id: res.data.idPrograma,
            programa: res.data.programa,
            descripcionPrograma: res.data.descripcionPrograma,
            activo: this.normalizeActivo(res.data.activo)
          })
        )
      );
  }

  update(id: number, programa: Programa): Observable<Programa> {
    return this.http
      .put<{ data: any }>(`${this.apiUrl}/programa/${id}`, this.toPayload(programa), { headers: this.headers() })
      .pipe(
        map(res =>
          new Programa({
            id: res.data.idPrograma,
            programa: res.data.programa,
            descripcionPrograma: res.data.descripcionPrograma,
            activo: this.normalizeActivo(res.data.activo)
          })
        )
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/programa/${id}`, { headers: this.headers() });
  }
}
