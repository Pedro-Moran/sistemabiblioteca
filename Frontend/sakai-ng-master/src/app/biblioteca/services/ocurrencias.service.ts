import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OcurrenciasService {
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

  api_ocurrencias_biblioteca(modulo: any):Observable<any>{
    return this.http.get<any[]>(
      `${this.apiUrl}/api/ocurrencias-biblio/materiales`,
      {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.getToken()}`
        )
      }
    );
  }
  api_ocurrencias_laboratorio(modulo: any):Observable<any>{
    return this.http.get<any[]>(
      `${this.apiUrl}/api/ocurrencias-biblio/equipos`,
      {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.getToken()}`
        )
      }
    );
  }
  api_autorizacion_regularizacion():Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/api/ocurrencias-biblio/costeadas`,
      {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.getToken()}`
        )
      }
    );
  }

  api_actualizar_regulariza(id: number, valor: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/ocurrencias-biblio/${id}/regulariza`,
      null,
      {
        params: { valor },
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.getToken()}`
        )
      }
    );
  }

  api_ocurrencias_prestamos_lista(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
  api_prestamos_lista(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
  api_situacion_lista(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }

  api_constancias(search: string):Observable<any>{
    return this.http.get<any[]>(
      `${this.apiUrl}/api/constancias/search`,
      {
        params: { q: search },
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.getToken()}`
        ),
      }
    );
  }

  api_constancias_preview(codigo: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/api/constancias/preview/${codigo}`,
      {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.getToken()}`
        ),
        responseType: 'blob'
      }
    );
  }

  api_constancias_pdf(payload: any): Observable<Blob> {
    return this.http.post(
      `${this.apiUrl}/api/constancias/pdf`,
      payload,
      {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.getToken()}`
        ),
        responseType: 'blob'
      }
    );
  }

  api_ocurrencias_usuario(codigo: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/api/ocurrencias-biblio/usuario/${codigo}`,
      {
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.getToken()}`
        )
      }
    );
  }

}
