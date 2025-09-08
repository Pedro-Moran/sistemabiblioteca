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
      .get<{ data: any[] }>(`${this.apiUrl}/programa/lista-activo`, { headers: this.headers() })
      .pipe(
        map(res =>
          res.data.map(p =>
            new Programa({
              id: p.idPrograma,
              descripcion: p.descripcion,
              activo: p.activo
            })
          )
        )
      );
  }

  private toPayload(programa: Programa) {
    return {
      idPrograma: programa.id || undefined,
      descripcion: programa.descripcion,
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
            descripcion: res.data.descripcion,
            activo: res.data.activo
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
            descripcion: res.data.descripcion,
            activo: res.data.activo
          })
        )
      );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/programa/${id}`, { headers: this.headers() });
  }
}
