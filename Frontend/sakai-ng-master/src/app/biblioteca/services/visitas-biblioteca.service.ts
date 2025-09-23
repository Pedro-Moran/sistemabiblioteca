import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VisitaBiblioteca } from '../interfaces/visita-biblioteca';

@Injectable({ providedIn: 'root' })
export class VisitasBibliotecaService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) {}

    registrarVisita(codigoUsuario: string, estado: number): Observable<VisitaBiblioteca> {
        return this.http.post<VisitaBiblioteca>(`${this.apiUrl}/api/visitas-biblio`, { codigoUsuario, estado });
    }
}
