import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Notificacion } from '../interfaces/notificacion';
import { DetallePrestamo } from '../interfaces/detalle-prestamo';
import { map, catchError } from 'rxjs/operators';
import { UsuarioPrestamosDTO } from '../interfaces/reportes/usuario-prestamos';
import { EquipoUsoTiempoDTO } from '../interfaces/reportes/equipo-uso-tiempo';
import { UsuarioPrestamosEquipoDTO } from '../interfaces/reportes/usuario-prestamos-equipo';
import { VisitanteBibliotecaVirtualDTO } from '../interfaces/reportes/visitante-biblioteca-virtual';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {
    private apiUrl: string;
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.apiUrl = environment.apiUrl;
    }
    api_prestamos_material_bibliografico(modulo: any): Observable<any> {
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

  api_prestamos_biblioteca_virtual(modulo: any):Observable<any>{
    /*return this.http.get<any[]>(`${this.apiUrl}/${modulo}`
    ,{ headers: new HttpHeaders().set('Authorization',`Bearer ${this.authService.getToken()}`)}
    );*/
    return this.http.get<any[]>('assets/demo/biblioteca/devoluciones/devoluciones.json');
  }

//   procesarPrestamo(dto: { id: number; aprobar: boolean; }) {
//       return this.http.post<any>(
//           `${this.apiUrl}/api/prestamos/procesar`,
//           dto,
//           { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`) }
//         );
//     }
    procesarPrestamo(id: number, aprobar: boolean): Observable<any> {
        return this.http.post(`${this.apiUrl}/api/prestamos/procesar`, { id, aprobar });
  }


  getPendientes(sedeId?: string) {
      const url = sedeId
        ? `${this.apiUrl}/api/prestamos/pendientes?sedeId=${sedeId}`
        : `${this.apiUrl}/api/prestamos/pendientes`;
      return this.http.get<{status:string,data:any[]}>(url);
    }

  listarNoLeidas(): Observable<Notificacion[]> {
      return this.http.get<Notificacion[]>(
        `${this.apiUrl}/api/prestamos/no-leidas`,
        {
          headers: new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.authService.getToken()}`
          )
        }
      );
    }


  marcarLeida(id: number): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/api/prestamos/${id}/leer`, {});
    }

  cancelarSolicitud(id: number): Observable<void> {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
      return this.http.post<void>(
        `${this.apiUrl}/api/prestamos/procesar`,
        { id, aprobar: false },
        { headers }
      );
    }

  getMisPrestamos() {
      return this.http.get<{status:string,data:any[]}>(
         `${this.apiUrl}/api/prestamos/mis-prestamos`,
         { headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`) }
      );
    }
  getNotificacionesNoLeidas(): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${this.apiUrl}/api/prestamos/no-leidas`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
        });
    }

    getNotificaciones(): Observable<Notificacion[]> {
        return this.http.get<Notificacion[]>(`${this.apiUrl}/api/prestamos/notificaciones`, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
        });
    }
  public listar(
    sede?: number | string,
    tipoUsuario?: number | string,
    tipoPrestamo?: string,
    escuela?: number | string,
    programa?: number | string,
    ciclo?: number | string,
    fechaInicio?: string,
    fechaFin?: string,
    tipo: 'materiales' | 'equipos' = 'equipos'
  ): Observable<DetallePrestamo[]> {
    let params = new HttpParams();

    const agregarParam = (clave: string, valor?: number | string | null) => {
      if (valor != null && valor !== 0 && valor !== '0') {
        params = params.set(clave, String(valor));
      }
    };

    agregarParam('sede', sede);
    agregarParam('tipoUsuario', tipoUsuario);
    agregarParam('estado', tipoPrestamo);
    agregarParam('escuela', escuela);
    agregarParam('programa', programa);
    agregarParam('ciclo', ciclo);
    if (fechaInicio)            params = params.set('fechaInicio', fechaInicio);
    if (fechaFin)               params = params.set('fechaFin', fechaFin);

    const endpoint = `${this.apiUrl}/api/prestamos/reporte`;
    return this.http
      .get<{ status: string; data: DetallePrestamo[] }>(endpoint, {
        params,
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.getToken()}`
        ),
      })
      .pipe(
        map((resp) => {
          const data = resp.data ?? [];
          return tipo === 'materiales'
            ? data.filter((d) => !d.equipo)
            : data.filter((d) => d.equipo);
        })
      );
  }

  public listarMaterialesPrestados(
    sede?: number | string,
    tipoUsuario?: number | string,
    tipoPrestamo?: string,
    especialidad?: number | string,
    programa?: number | string,
    ciclo?: number | string,
    fechaInicio?: string,
    fechaFin?: string
  ): Observable<DetallePrestamo[]> {
    let params = new HttpParams();

    const agregarParam = (clave: string, valor?: number | string | null) => {
      if (valor != null && valor !== 0 && valor !== '0') {
        params = params.set(clave, String(valor));
      }
    };

    agregarParam('sede', sede);
    agregarParam('tipoUsuario', tipoUsuario);
    agregarParam('estado', tipoPrestamo);
    agregarParam('especialidad', especialidad);
    agregarParam('programa', programa);
    agregarParam('ciclo', ciclo);
    if (fechaInicio) params = params.set('fechaPrestamoInicio', fechaInicio);
    if (fechaFin) params = params.set('fechaPrestamoFin', fechaFin);

    return this.http
      .get<{ status: string; data: any[] }>(`${this.apiUrl}/api/biblioteca/prestados`, {
        params,
        headers: new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.authService.getToken()}`
        ),
      })
      .pipe(
        map((resp) =>
          (resp.data ?? []).map((d: any) => ({
            id: d.idDetalleBiblioteca,
            material: {
              titulo: d.biblioteca?.titulo,
              numeroIngreso: d.numeroIngreso != null ? String(d.numeroIngreso) : undefined,
              especialidad: { descripcion: d.biblioteca?.especialidadDescripcion ?? '' },
            },
            titulo: d.biblioteca?.titulo,
            numeroIngreso: d.numeroIngreso != null ? String(d.numeroIngreso) : undefined,
            codigoUsuario: d.codigoUsuario,
            codigoSede: d.sede?.descripcion ?? d.codigoSede,
            tipoPrestamo: d.tipoPrestamo,
            fechaPrestamo: d.fechaPrestamo,
            usuarioPrestamo: d.usuarioPrestamo,
            usuarioRecepcion: d.usuarioRecepcion,
            fechaRecepcion: d.fechaDevolucion,
          }))
        ),
        catchError(() => of<DetallePrestamo[]>([]))
      );
  }

  listarEstados(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/api/equipos/estados`);
      }

  reporteEstudiantesAtendidos(): Observable<UsuarioPrestamosDTO[]> {
      return this.http
        .get<{status:string, data: UsuarioPrestamosDTO[]}>(
          `${this.apiUrl}/api/prestamos/reporte/estudiantes-atendidos`
        )
        .pipe(map(r => r.data ?? []));
  }
    /** Obtiene los usuarios atendidos de biblioteca virtual */
    reporteUsuariosAtendidosBiblioteca(): Observable<UsuarioPrestamosEquipoDTO[]> {
        return this.http.get<{ status: string; data: UsuarioPrestamosEquipoDTO[] }>(`${this.apiUrl}/api/prestamos/reporte/usuarios-atendidos-biblioteca`).pipe(map((r) => r.data ?? []));
    }

    reporteUsoTiempoBiblioteca(fechaInicio?: string, fechaFin?: string): Observable<EquipoUsoTiempoDTO[]> {
        let params = new HttpParams();
        if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
        if (fechaFin) params = params.set('fechaFin', fechaFin);

        return this.http
            .get<{ status: number; data: EquipoUsoTiempoDTO[] }>(`${this.apiUrl}/api/prestamos/reporte/uso-tiempo-biblioteca`, {
                headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`),
                params
            })
            .pipe(map((resp) => resp.data ?? []));
    }
    /** Obtiene los visitantes de biblioteca virtual */
    reporteVisitantesBibliotecaVirtual(fechaInicio?: string, fechaFin?: string): Observable<VisitanteBibliotecaVirtualDTO[]> {
        let params = new HttpParams();
        if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
        if (fechaFin) params = params.set('fechaFin', fechaFin);

        return this.http
            .get<{ status: string; data: VisitanteBibliotecaVirtualDTO[] }>(
                `${this.apiUrl}/api/prestamos/reporte/visitantes-biblioteca-virtual`,
                { params }
            )
            .pipe(map((resp) => resp.data ?? []));
    }
}
