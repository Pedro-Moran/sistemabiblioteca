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
      .get<{ data: Especialidad[] }>(`${this.apiUrl}/especialidad/lista`, { headers: this.headers() })
      .pipe(map(res => res.data));
  }

  create(especialidad: Especialidad): Observable<Especialidad> {
    return this.http
      .post<{ data: Especialidad }>(`${this.apiUrl}/especialidad`, especialidad, { headers: this.headers() })
      .pipe(map(res => res.data));
  }

  update(id: number, especialidad: Especialidad): Observable<Especialidad> {
    return this.http
      .put<{ data: Especialidad }>(`${this.apiUrl}/especialidad/${id}`, especialidad, { headers: this.headers() })
      .pipe(map(res => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/especialidad/${id}`, { headers: this.headers() });
  }
}
