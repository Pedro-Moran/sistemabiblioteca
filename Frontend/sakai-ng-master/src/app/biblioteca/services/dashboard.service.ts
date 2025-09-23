import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = environment.apiUrl;
  }

  private requestOptions(): { headers: HttpHeaders; withCredentials: boolean } {
    const token = (this.authService.getToken() ?? '').trim();
    const headers = token
      ? new HttpHeaders().set('Authorization', token.startsWith('Bearer ') ? token : `Bearer ${token}`)
      : new HttpHeaders();

    return {
      headers,
      withCredentials: true
    };
  }

  private unwrapResponse<T>(response: T | Record<string, unknown>): T {
    if (!response || typeof response !== 'object') {
      return response as T;
    }

    const container = response as Record<string, unknown>;
    const candidates = ['data', 'resultado', 'result', 'payload'];
    for (const key of candidates) {
      if (container[key] !== undefined) {
        return container[key] as T;
      }
    }
    return response as T;
  }

  stats(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/api/dashboard/estadisticas`, this.requestOptions())
      .pipe(map((res) => this.unwrapResponse<any>(res)));
  }

  ingresos(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/api/dashboard/ingresos`, this.requestOptions())
      .pipe(map((res) => this.unwrapResponse<any>(res)));
  }

  recientes(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/api/dashboard/recientes`, this.requestOptions())
      .pipe(map((res) => this.unwrapResponse<any[]>(res)));
  }
}
