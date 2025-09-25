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
import { IntranetVisitaDTO } from '../interfaces/reportes/intranet-visita';

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

  reporteEstudiantesAtendidos(filtros: {
    sede?: number | string;
    programa?: number | string;
    especialidad?: number | string;
    ciclo?: number | string;
    tipoMaterial?: number | string;
    fechaInicio?: string;
    fechaFin?: string;
  } = {}): Observable<UsuarioPrestamosDTO[]> {
      let params = new HttpParams();
      const agregar = (k: string, v?: number | string | null) => {
        if (v != null && v !== 0 && v !== '0') params = params.set(k, String(v));
      };
      agregar('sede', filtros.sede);
      agregar('programa', filtros.programa);
      agregar('especialidad', filtros.especialidad);
      agregar('ciclo', filtros.ciclo);
      agregar('tipoMaterial', filtros.tipoMaterial);
      if (filtros.fechaInicio) params = params.set('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin) params = params.set('fechaFin', filtros.fechaFin);

      return this.http
        .get<{status:string, data: UsuarioPrestamosDTO[]}>(
          `${this.apiUrl}/api/prestamos/reporte/estudiantes-atendidos`, { params }
        )
        .pipe(map(r => r.data ?? []));
  }
    /** Obtiene los usuarios atendidos de biblioteca virtual */
    reporteUsuariosAtendidosBiblioteca(): Observable<UsuarioPrestamosEquipoDTO[]> {
        return this.http.get<{ status: string; data: UsuarioPrestamosEquipoDTO[] }>(`${this.apiUrl}/api/prestamos/reporte/usuarios-atendidos-biblioteca`).pipe(map((r) => r.data ?? []));
    }

    reporteUsoTiempoBiblioteca(
        fechaInicio?: string,
        fechaFin?: string,
        sede?: number | string,
        tipoUsuario?: number | string,
        ciclo?: number | string,
        escuela?: number | string
    ): Observable<EquipoUsoTiempoDTO[]> {
        let params = new HttpParams();

        const addParam = (key: string, value?: number | string | null) => {
            if (value != null && value !== 0 && value !== '0') {
                params = params.set(key, String(value));
            }
        };

        addParam('sede', sede);
        addParam('tipoUsuario', tipoUsuario);
        addParam('ciclo', ciclo);
        addParam('escuela', escuela);
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
    reporteVisitantesBibliotecaVirtual(filtros: {
        fechaInicio?: string;
        fechaFin?: string;
        codigo?: string;
        sede?: number | string;
        tipoUsuario?: number | string;
        escuela?: number | string;
        programa?: number | string;
        ciclo?: number | string;
        baseDatos?: number | string;
    }): Observable<VisitanteBibliotecaVirtualDTO[]> {
        let params = new HttpParams();
        if (filtros?.fechaInicio) params = params.set('fechaInicio', filtros.fechaInicio);
        if (filtros?.fechaFin) params = params.set('fechaFin', filtros.fechaFin);
        if (filtros?.codigo) params = params.set('codigo', filtros.codigo);
        const addParam = (key: string, value?: number | string | null) => {
            if (value != null && value !== '' && value !== 0 && value !== '0') {
                params = params.set(key, String(value));
            }
        };
        addParam('sede', filtros?.sede);
        addParam('tipoUsuario', filtros?.tipoUsuario);
        addParam('escuela', filtros?.escuela);
        addParam('programa', filtros?.programa);
        addParam('ciclo', filtros?.ciclo);
        addParam('baseDatos', filtros?.baseDatos);

        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${this.authService.getToken()}`
        );

        console.log(
            '[Reporte Visitantes Biblioteca Virtual] Parámetros HTTP enviados:',
            params.toString() || '(sin filtros)'
        );

        return this.http
            .get<{ status?: string; data?: VisitanteBibliotecaVirtualDTO[] } | VisitanteBibliotecaVirtualDTO[] | any>(
                `${this.apiUrl}/api/prestamos/reporte/visitantes-biblioteca-virtual`,
                { params, headers }
            )
            .pipe(
                map((resp) => this.extraerVisitantesBibliotecaVirtual(resp)),
                map((filas) =>
                    filas
                        .filter((fila) => this.esVisitaVirtual(fila))
                        .map((fila) => this.normalizarVisitanteVirtual(fila))
                )
            );
    }

    private extraerVisitantesBibliotecaVirtual(
        resp: { status?: string; data?: VisitanteBibliotecaVirtualDTO[] } | VisitanteBibliotecaVirtualDTO[] | any
    ): VisitanteBibliotecaVirtualDTO[] {
        if (Array.isArray(resp)) {
            return resp;
        }
        if (resp?.data && Array.isArray(resp.data)) {
            return resp.data;
        }
        if (resp && typeof resp === 'object') {
            const candidato = Object.values(resp).find((valor) => Array.isArray(valor));
            if (Array.isArray(candidato)) {
                return candidato as VisitanteBibliotecaVirtualDTO[];
            }
        }
        return [];
    }

    private esVisitaVirtual(fila: VisitanteBibliotecaVirtualDTO | undefined): boolean {
        if (!fila) {
            return false;
        }
        const flag = (fila as any).flgUsuario ?? (fila as any).flgusuario ?? (fila as any).estado ?? null;
        if (flag == null) {
            return true;
        }
        const numero = Number(flag);
        return Number.isFinite(numero) ? numero === 3 : String(flag).trim() === '3';
    }

    private normalizarVisitanteVirtual(
        fila: VisitanteBibliotecaVirtualDTO
    ): VisitanteBibliotecaVirtualDTO {
        const totalVisitas = this.normalizarConteo((fila as any).totalVisitas ?? (fila as any).total_visitas);
        const totalSesiones = this.normalizarConteo(
            (fila as any).totalSesiones ?? (fila as any).total_sesiones ?? (fila as any).totalSesionesUsuario ?? totalVisitas
        );
        return {
            ...fila,
            totalVisitas,
            totalSesiones
        } as VisitanteBibliotecaVirtualDTO;
    }

    private normalizarConteo(valor: any): number {
        const numero = Number(valor);
        return Number.isFinite(numero) && numero >= 0 ? numero : 0;
    }
    reporteVisitasBibliotecaIntranet(
        sede?: number | string,
        tipoUsuario?: number | string,
        estado?: number | string,
        escuela?: number | string,
        programa?: number | string,
        ciclo?: number | string,
        fechaInicio?: string,
        fechaFin?: string
    ): Observable<IntranetVisitaDTO[]> {
        let params = new HttpParams();
        const addParam = (key: string, value?: number | string | null) => {
            if (value != null && value !== 0 && value !== '0') {
                params = params.set(key, String(value));
            }
        };
        addParam('sede', sede);
        addParam('tipoUsuario', tipoUsuario);
        addParam('estado', estado);
        addParam('escuela', escuela);
        addParam('programa', programa);
        addParam('ciclo', ciclo);
        if (fechaInicio) params = params.set('fechaInicio', fechaInicio);
        if (fechaFin) params = params.set('fechaFin', fechaFin);

        return this.http
            .get<{ status: string; data: IntranetVisitaDTO[] }>(
                `${this.apiUrl}/api/prestamos/reporte/intranet`,
                {
                    params,
                    headers: new HttpHeaders().set(
                        'Authorization',
                        `Bearer ${this.authService.getToken()}`
                    ),
                }
            )
            .pipe(map((resp) => resp.data ?? []));
    }
}
