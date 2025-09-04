import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl:string;
  constructor(private http:HttpClient, private authService:AuthService) { 
    this.apiUrl = environment.apiUrl;
  }
  
  conf_event(modulo:String):Observable<any>{
   /* return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/email.json');
  }
  conf_event_accion(request: any,modulo: any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/${modulo}`
      , request
      , { headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`) }
    );
  }
  conf_event_activo(request: any,modulo: any):Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/${modulo}`
      , request
      , { headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`) }
    );
  }
}
