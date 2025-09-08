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
      .get<{ data: Programa[] }>(`${this.apiUrl}/programa/lista`, { headers: this.headers() })
      .pipe(map(res => res.data));
  }

  create(programa: Programa): Observable<Programa> {
    return this.http
      .post<{ data: Programa }>(`${this.apiUrl}/programa`, programa, { headers: this.headers() })
      .pipe(map(res => res.data));
  }

  update(id: number, programa: Programa): Observable<Programa> {
    return this.http
      .put<{ data: Programa }>(`${this.apiUrl}/programa/${id}`, programa, { headers: this.headers() })
      .pipe(map(res => res.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/programa/${id}`, { headers: this.headers() });
  }
}
