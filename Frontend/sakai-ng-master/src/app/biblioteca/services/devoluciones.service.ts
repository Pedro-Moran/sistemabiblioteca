import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
  private apiUrl:string;
  constructor(private http:HttpClient, private authService:AuthService) { 
    this.apiUrl = environment.apiUrl;
  }
  api_prestamos_material_bibliografico(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/prestamos/prestamos.json');
  }
  api_prestamos_tipos(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/prestamos/tipo.json');
  }
}

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {
  private apiUrl:string;
  constructor(private http:HttpClient, private authService:AuthService) { 
    this.apiUrl = environment.apiUrl;
  }
  api_devoluciones_biblioteca_virtual(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/devoluciones/devoluciones.json');
  }
}
