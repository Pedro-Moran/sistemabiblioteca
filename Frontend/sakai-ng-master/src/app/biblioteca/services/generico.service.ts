import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GenericoService {
  private apiUrl:string;
  constructor(private http:HttpClient, private authService:AuthService) {
    this.apiUrl = environment.apiUrl;
  }

  private authHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  conf_event_get(url: string):Observable<any>{
    return this.http.get<any[]>(
      `${this.apiUrl}/${url}`,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`) }
    );
  }
  conf_event_post(request: any,modulo: any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/${modulo}`
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
  conf_event_delete_1(id: number, modulo: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${modulo}/${id}`, {
      headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`)
    });
  }

  conf_event_put(request: any,modulo: any):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${modulo}`
      , request
      , { headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`) }
    );
  }


  roles_get(url: string):Observable<any>{
    return this.http.get<any[]>(
      `${this.apiUrl}/${url}`,
      { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`) }
    );
  }

    modulos_get(): Observable<any> {
      return this.http.get<any[]>(
        `${this.apiUrl}/conf/lista-modulos`,
        { headers: this.authHeaders() }
      );
    }
    sedes_get(modulo: any):Observable<any>{
    const token = this.authService.getToken();
    const options = token
      ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
      : {};
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`, options);
  }

  tipodocumento_get(modulo: string): Observable<any> {
    const token = this.authService.getToken();
    const options = token
      ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
      : {};
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`, options);
  }

  tipo_get(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }

  tiporecurso_get(modulo: any):Observable<any>{
    const token = this.authService.getToken();
    const options = token
      ? { headers: new HttpHeaders().set('Authorization', `Bearer ${token}`) }
      : {};
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`, options);
//     return this.http.get<any[]>('assets/demo/biblioteca/tipos-recurso.json');
  }

  categoriarecurso_get(modulo: any): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`,
      { headers: this.authHeaders() }
    );
  }
}
