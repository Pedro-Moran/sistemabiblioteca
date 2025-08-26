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

  sedes_get(modulo: any):Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );
//     return this.http.get<any[]>('assets/demo/biblioteca/sedes.json');
  }

  tipodocumento_get(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/tipos-documento.json');
  }

  tipo_get(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/tipo.json');
  }

  tiporecurso_get(modulo: any):Observable<any>{
    return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );
//     return this.http.get<any[]>('assets/demo/biblioteca/tipos-recurso.json');
  }

  categoriarecurso_get(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/categoria-recurso.json');
  }
}
