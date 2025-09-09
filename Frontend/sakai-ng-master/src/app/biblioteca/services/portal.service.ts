import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { PortalNoticia } from '../interfaces/portalNoticias';
import { PortalHorario } from '../interfaces/portalHorario';
import { RecursoDigitalDTO } from '../interfaces/RecursoDigitalDTO';
import { TipoRecurso } from '../interfaces/tipo-recurso';

interface ResponseDTO<T> {
    p_status: number;
    message: string;
    data: T;
}
interface ListDTO<T> {
    status: string;
    data: T;
}
export interface NosotrosDTO {
    imageUrl: string;
    eyebrow: string;
    title: string;
    body: string;
}
@Injectable({
    providedIn: 'root'
})
export class PortalService {
    private apiUrl: string;
    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.apiUrl = environment.apiUrl;
    }

    private authHeaders() {
        const token = this.authService.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    conf_event_get(modulo: any): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/${modulo}`, { headers: this.authHeaders() });
    }
    conf_event_post(request: any, modulo: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${modulo}`, request, { headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`) });
    }
    conf_event_put(request: any, modulo: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${modulo}`, request, { headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`) });
    }
    conf_event_delete(request: any, modulo: any): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${modulo}`, {
            body: request, // Aquí especificas el cuerpo de la solicitud
            headers: new HttpHeaders().append('Authorization', `Bearer ${this.authService.getToken()}`)
        });
    }
    api_libros_electronicos_lista(modulo: any): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/${modulo}`, { headers: this.authHeaders() });
    }

    tipo_get(modulo: any): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/${modulo}`, { headers: this.authHeaders() });
    }
    api_horarios_lista(modulo: any): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/${modulo}`, { headers: this.authHeaders() });
    }
    api_catalogo_enlinea(modulo: any): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/${modulo}`, { headers: this.authHeaders() });
    }
    api_recursos_electronicos(modulo: any): Observable<any> {
        return this.http.get<any[]>(`${this.apiUrl}/${modulo}`, { headers: this.authHeaders() });
    }
    api_noticias(busqueda?: string): Observable<ListDTO<PortalNoticia[]>> {
        const params = busqueda ? `?q=${encodeURIComponent(busqueda)}` : '';
        return this.http.get<ListDTO<PortalNoticia[]>>(`${this.apiUrl}/api/noticias/listar${params}`, { headers: this.authHeaders() });
    }

    // Listar, con parámetros opcionales ?start=yyyy-MM-dd&end=yyyy-MM-dd
    listar(start?: string, end?: string): Observable<{ status: string; data: PortalNoticia[] }> {
        const q = [];
        if (start) q.push(`start=${encodeURIComponent(start)}`);
        if (end) q.push(`end=${encodeURIComponent(end)}`);
        const params = q.length ? `?${q.join('&')}` : '';
        return this.http.get<ListDTO<PortalNoticia[]>>(`${this.apiUrl}/api/noticias/listar${params}`, { headers: this.authHeaders() });
    }

    saveNoticia(formData: FormData): Observable<ResponseDTO<void>> {
        return this.http.post<ResponseDTO<void>>(`${this.apiUrl}/api/noticias/registrar`, formData, { headers: this.authHeaders() });
    }

    // Eliminar
    delete(id: number): Observable<{ p_status: number }> {
        return this.http.delete<{ p_status: number }>(`${this.apiUrl}/api/noticias/eliminar/${id}`, { headers: this.authHeaders() });
    }

    // portal.service.ts
    toggleEstado(noticiaId: number, estadoId: number, idUsuario: number): Observable<ResponseDTO<void>> {
        const body = {
            idnoticia: noticiaId, // que coincida CON EXACTITUD con tu DTO de Java
            estadoId: estadoId,
            idUsuario: idUsuario
        };
        return this.http.put<ResponseDTO<void>>(
            `${this.apiUrl}/api/noticias/activo`, // fíjate que aquí usar "/api/noticias/activo" (sin el "/auth" de más)
            body,
            { headers: this.authHeaders() } // <<=== tus headers con Bearer
        );
    }

    listarHorarios(sedeId?: number): Observable<{ p_status: number; message: string; data: PortalHorario[] }> {
        const params = sedeId && sedeId > 0 ? `?sedeId=${sedeId}` : '';
        return this.http.get<{ p_status: number; message: string; data: PortalHorario[] }>(`${this.apiUrl}/api/horarios/listar${params}`, { headers: this.authHeaders() });
    }

    saveHorario(dto: PortalHorario): Observable<ResponseDTO<void>> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);

        return this.http.post<ResponseDTO<void>>(
            // incluye el /auth que tienes mapeado en tu controller
            `${this.apiUrl}/api/horarios/registrar`,
            dto,
            { headers }
        );
    }

    // 3) ELIMINAR
    deleteHorario(id: number): Observable<ResponseDTO<void>> {
        return this.http.delete<ResponseDTO<void>>(
            `${this.apiUrl}/api/horarios/eliminar/${id}`,
            { headers: this.authHeaders() } // <--- aquí metes las headers dentro de un objeto
        );
    }

    // 4) CAMBIAR ESTADO
    toggleHorario(id: number, nuevoEstado: number, usuario: number): Observable<ResponseDTO<void>> {
        const body = {
            id: id, // que coincida CON EXACTITUD con tu DTO de Java
            nuevoEstado: nuevoEstado,
            usuario: usuario
        };
        return this.http.put<ResponseDTO<void>>(
            `${this.apiUrl}/api/horarios/activo`, // fíjate que aquí usar "/api/noticias/activo" (sin el "/auth" de más)
            body,
            { headers: this.authHeaders() } // <<=== tus headers con Bearer
        );
    }

    listarRecursosDigitales(): Observable<ResponseDTO<RecursoDigitalDTO[]>> {
        return this.http.get<ResponseDTO<RecursoDigitalDTO[]>>(`${this.apiUrl}/api/recursos-digitales/listar`);
    }

    listarTipoRecursos(): Observable<ResponseDTO<TipoRecurso[]>> {
        return this.http.get<ResponseDTO<TipoRecurso[]>>(`${this.apiUrl}/api/tipos-recursos-digitales/listar`);
    }

    listarRecursosDigitalesPorTipo(id: number): Observable<ResponseDTO<RecursoDigitalDTO[]>> {
        return this.http.get<ResponseDTO<RecursoDigitalDTO[]>>(`${this.apiUrl}/api/recursos-digitales/listar/tipo/${id}`);
    }

    obtenerEnlaceRecurso(id: number): Observable<ResponseDTO<string>> {
        return this.http.get<ResponseDTO<string>>(`${this.apiUrl}/api/recursos-digitales/enlace/${id}`, { headers: this.authHeaders() });
    }
    saveRecursoDigital(formData: FormData): Observable<ResponseDTO<void>> {
        return this.http.post<ResponseDTO<void>>(`${this.apiUrl}/api/recursos-digitales/registrar`, formData, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`)
            // NO pongas aquí Content-Type: el navegador lo generará automáticamente
        });
    }

    toggleRecursoDigitalStatus(id: number, nuevoEstado: number, usuario: string): Observable<ResponseDTO<void>> {
        return this.http.put<ResponseDTO<void>>(`${this.apiUrl}/auth/api/recursos-digitales/activo`, { id, nuevoEstado, usuario }, { headers: this.authHeaders() });
    }

    deleteRecursoDigital(id: number): Observable<ResponseDTO<void>> {
        return this.http.delete<ResponseDTO<void>>(`${this.apiUrl}/api/recursos-digitales/eliminar/${id}`, { headers: this.authHeaders() });
    }

    deleteBulkRecursos(ids: number[]): Observable<ResponseDTO<void>> {
        return this.http.post<ResponseDTO<void>>(`${this.apiUrl}/api/recursos-digitales/delete-bulk`, ids, { headers: this.authHeaders() });
    }

    getNosotros(): Observable<NosotrosDTO> {
        return this.http.get<NosotrosDTO>(`${this.apiUrl}/api/nosotros`, { headers: this.authHeaders() });
    }

    saveNosotros(dto: NosotrosDTO): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/api/nosotros`, dto, { headers: this.authHeaders() });
    }
}
