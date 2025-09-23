import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { Sedes } from '../interfaces/sedes';

@Injectable({
  providedIn: 'root'
})
export class SedeService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${this.auth.getToken()}`);
  }

  list(): Observable<Sedes[]> {
    return this.http
      .get<{ data: Sedes[] }>(`${this.apiUrl}/sede/lista`, { headers: this.headers() })
      .pipe(map(res => res.data));
  }

  create(sede: Sedes): Observable<Sedes> {
    return this.http
      .post<{ data: Sedes }>(`${this.apiUrl}/sede`, sede, { headers: this.headers() })
      .pipe(map(res => res.data));
  }

  update(id: number, sede: Sedes): Observable<Sedes> {
    return this.http
      .put<{ data: Sedes }>(`${this.apiUrl}/sede/${id}`, sede, { headers: this.headers() })
      .pipe(map(res => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sede/${id}`, { headers: this.headers() });
  }
}
