import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {
  private apiUrl:string;
  constructor(private http:HttpClient, private authService:AuthService) {
    this.apiUrl = environment.apiUrl;
  }

  private authHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  conf_event_get(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
  conf_event_post(request: any,modulo: any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/${modulo}`
      , request
      , { headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`) }
    );
  }
  conf_event_put(request: any,modulo: any):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${modulo}`
      , request
      , { headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`) }
    );
  }
  conf_event_delete(request: any,modulo: any):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${modulo}`,
        {
            body: request, // Aquí especificas el cuerpo de la solicitud
            headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`)
        }
    );
  }
  api_recursos_lista(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
  api_ejemplares_lista(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
  filtros(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
  lista_estados(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
  lista_tipoEjemplar(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
  lista_autor(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
  lista_editorial(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
  lista_tipoActivo(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
}
