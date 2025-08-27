import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl: string;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = environment.apiUrl;
  }

  private authHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  stats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/dashboard/estadisticas`, {
      headers: this.authHeaders()
    });
  }

  ingresos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/dashboard/ingresos`, {
      headers: this.authHeaders()
    });
  }

  recientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/recursos/recientes`, {
      headers: this.authHeaders()
    });
  }
}
