import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Equipo } from '../../biblioteca/interfaces/biblioteca-virtual/equipo';

@Injectable({
    providedIn: 'root'
})
export class BibliotecaVirtualService {
    private apisUrl = environment.apiUrl + '/api/equipos';
    private apiUrl: string;
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.apiUrl = environment.apiUrl;
    }
    api_equipos(modulo: any): Observable<any> {
        /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
        return this.http.get<any[]>('assets/demo/biblioteca/biblioteca-virtual/equipos.json');
    }
    api_estados(modulo: any): Observable<any> {
        /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
        return this.http.get<any[]>('assets/demo/biblioteca/biblioteca-virtual/estados.json');
    }

    crearEquipo(equipo: Equipo): Observable<any> {
        return this.http.post<any>(`${this.apisUrl}/create`, equipo);
    }

    actualizarEquipo(id: number, equipo: Equipo): Observable<any> {
        return this.http.put<any>(`${this.apisUrl}/update/${id}`, equipo);
    }

    eliminarEquipo(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apisUrl}/delete/${id}`);
    }

    eliminarEquipos(ids: number[]): Observable<any> {
        return this.http.post<any>(`${this.apisUrl}/delete-bulk`, ids);
    }

    listarEquipos(discapacidad?: boolean): Observable<any> {
        return this.http.get<any>(`${this.apisUrl}/list`).pipe(
            map((res: any) => {
                let equipos = res?.data ?? res;
                if (discapacidad !== undefined) {
                    equipos = (equipos || []).filter((eq: any) => eq.discapacidad === discapacidad);
                }
                return res && res.status !== undefined
                    ? { ...res, data: equipos }
                    : { status: '0', data: equipos };
            })
        );
    }

    verificarIpDuplicada(ip: string, id?: number): Observable<{ exists: boolean }> {
        let params = new HttpParams().set('ip', ip);
        if (id) {
            params = params.set('id', id);
        }
        return this.http.get<{ exists: boolean }>(`${this.apisUrl}/exists`, { params });
    }

    listarEquiposEnProceso(): Observable<any> {
        return this.http.get<any>(`${this.apisUrl}/listEnProceso`);
    }

    filtrarPorSede(sedeId: number, discapacidad?: boolean): Observable<any> {
        let params = new HttpParams().set('sedeId', sedeId);
        if (discapacidad !== undefined) {
            params = params.set('discapacidad', discapacidad);
        }
        return this.http.get<any>(`${this.apisUrl}/filter`, { params });
    }
    filtrarPorSedeEnProcesp(sedeId: number): Observable<any> {
        return this.http.get<any>(`${this.apisUrl}/filter/onlyEnProceso?sedeId=${sedeId}`);
    }

    cambiarEstado(id: number, estado: string): Observable<any> {
        return this.http.put<any>(`${this.apisUrl}/changeState/${id}?estado=${estado}`, {});
    }

    obtenerEquipo(id: number): Observable<any> {
        return this.http.get<any>(`${this.apisUrl}/${id}`);
    }

    listarEstados(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/api/equipos/estados`);
    }

    listarEquiposPrestamo(search?: string): Observable<any[]> {
        let params = new HttpParams();
        if (search && search.trim().length) {
            params = params.set('search', search.trim());
        }
        return this.http
            .get<{ status: string; data: any[] }>(
                `${this.apiUrl}/api/prestamos/equipos`,
                {
                    params,
                    headers: new HttpHeaders().set(
                        'Authorization',
                        `Bearer ${this.authService.getToken()}`
                    )
                }
            )
            .pipe(map(resp => resp.data));
    }

    listarDetallePrestamoEquipo(equipoId: number, sedeId?: number): Observable<any[]> {
        let params = new HttpParams();
        if (sedeId != null) {
            params = params.set('sedeId', sedeId);
        }
        return this.http
            .get<{ status: string; data: any[] }>(
                `${this.apiUrl}/api/prestamos/equipos/${equipoId}/detalles`,
                {
                    params,
                    headers: new HttpHeaders().set(
                        'Authorization',
                        `Bearer ${this.authService.getToken()}`
                    )
                }
            )
            .pipe(map(resp => resp.data));
    }

    obtenerProximoFin(equipoId: number): Observable<any> {
        return this.http
            .get<{ status: string; data: any }>(
            `${this.apiUrl}/api/prestamos/equipos/${equipoId}/proximo-fin`,
                {
                    headers: new HttpHeaders().set(
                        'Authorization',
                        `Bearer ${this.authService.getToken()}`
                    )
                }
            )
            .pipe(map(resp => resp.data));
    }

    solicitar(req: any): Observable<any> {
        // antes: this.http.post('/auth/api/prestamos/solicitar', req)
        return this.http.post(`${this.apiUrl}/api/prestamos/solicitar`, req, { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`) });
    }

    listarPendientes(sedeId?: number, discapacidad?: boolean) {
        let params = new HttpParams();
        if (sedeId && sedeId > 0) {
            params = params.set('sedeId', sedeId);
        }
        if (discapacidad !== undefined) {
            params = params.set('discapacidad', discapacidad);
        }
        return this.http.get<{ status: string; data: any[] }>(`${environment.apiUrl}/api/prestamos/pendientes`, { params });
    }

    listarDevoluciones(sedeId?: number) {
        let url = `${this.apiUrl}/api/prestamos/devoluciones`;
        if (sedeId && sedeId !== 0) {
            url += `?sedeId=${sedeId}`;
        }
        return this.http.get<{ status: string; data: any[] }>(url);
    }

    devolver(id: number) {
        return this.http.post<{ status: string; data: any }>(`${this.apiUrl}/api/prestamos/devolver`, { id });
    }

    cancelar(id: number) {
        // Reusa el mismo endpoint de “procesar” pero con aprobar=false
        return this.http.post<{ status: string; data: any }>(`${this.apiUrl}/procesar`, { id, aprobar: false });
    }
}
