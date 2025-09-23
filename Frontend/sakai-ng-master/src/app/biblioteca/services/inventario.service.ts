import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { EstadoInventario, InventarioItem } from '../interfaces/inventario-item';

@Injectable({
    providedIn: 'root'
})
export class InventarioService {
    private readonly apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private authService: AuthService) {}

    buscarPorCodigo(codigoBarra: string): Observable<InventarioItem[]> {
        const params = new HttpParams().set('codigoBarra', codigoBarra);
        return this.http
            .get<any>(`${this.apiUrl}/api/inventario/material`, {
                headers: this.authHeaders(),
                params
            })
            .pipe(map(respuesta => this.mapearLista(respuesta)));
    }

    actualizarEstado(item: InventarioItem, estado: EstadoInventario): Observable<InventarioItem | undefined> {
        const payload: Record<string, unknown> = {
            estadoInventario: estado
        };
        if (item.id) {
            payload['detalleId'] = item.id;
            payload['idDetalleBiblioteca'] = item.id;
            payload['detalleBibliotecaId'] = item.id;
        }
        if (item.codigoBarra) {
            payload['codigoBarra'] = item.codigoBarra;
        }
        if (item.codigoLocalizacion) {
            payload['codigoLocalizacion'] = item.codigoLocalizacion;
        }
        return this.http
            .put<any>(`${this.apiUrl}/api/inventario/material/verificacion`, payload, {
                headers: this.authHeaders()
            })
            .pipe(map(respuesta => this.mapearRegistro(respuesta?.data ?? respuesta)));
    }

    private authHeaders(): HttpHeaders {
        return new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
    }

    private mapearLista(respuesta: any): InventarioItem[] {
        const posibles = [
            respuesta,
            respuesta?.data,
            respuesta?.result,
            respuesta?.content,
            respuesta?.items,
            respuesta?.records,
            respuesta?.lista,
            respuesta?.results,
            respuesta?.data?.data,
            respuesta?.data?.content,
            respuesta?.data?.items,
            respuesta?.data?.lista,
            respuesta?.data?.records
        ];
        for (const candidato of posibles) {
            if (Array.isArray(candidato)) {
                return candidato.map(reg => this.mapearRegistro(reg)).filter(reg => !!reg);
            }
        }
        return [];
    }

    private mapearRegistro(registro: any): InventarioItem {
        const detalle = registro?.detalle ?? registro?.detalleBiblioteca ?? registro;
        const biblioteca =
            registro?.biblioteca ??
            detalle?.biblioteca ??
            registro?.detalle?.biblioteca ??
            registro?.material ??
            registro;
        const id = Number(
            detalle?.idDetalleBiblioteca ??
                detalle?.id ??
                registro?.idDetalleBiblioteca ??
                registro?.detalleId ??
                registro?.id ??
                0
        );
        const seguro = Number.isFinite(id) ? id : 0;
        return {
            id: seguro,
            codigoBarra: detalle?.codigoBarra ?? registro?.codigoBarra ?? registro?.codigo ?? null,
            codigoLocalizacion:
                registro?.codigoLocalizacion ?? biblioteca?.codigoLocalizacion ?? registro?.codigoInventario ?? null,
            titulo: biblioteca?.titulo ?? registro?.titulo ?? registro?.descripcion ?? null,
            autor:
                biblioteca?.autorPersonal ??
                registro?.autorPersonal ??
                registro?.autor ??
                registro?.autorSecundario ??
                null,
            estadoInventario:
                registro?.estadoInventario ??
                detalle?.estadoInventario ??
                registro?.estadoDescripcion ??
                detalle?.estadoDescripcion ??
                registro?.verificacion ??
                null,
            fechaVerificacion:
                registro?.fechaVerificacion ??
                detalle?.fechaVerificacion ??
                registro?.fechaActualizacion ??
                detalle?.fechaActualizacion ??
                registro?.fechaModificacion ??
                detalle?.fechaModificacion ??
                null,
            usuarioVerificacion:
                registro?.usuarioVerificacion ??
                detalle?.usuarioVerificacion ??
                registro?.usuarioActualizacion ??
                detalle?.usuarioActualizacion ??
                registro?.usuarioModificacion ??
                detalle?.usuarioModificacion ??
                null
        };
    }
}
