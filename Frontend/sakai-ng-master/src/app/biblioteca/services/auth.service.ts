import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, forkJoin } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { environment } from '../../../environments/environment';
import { Authentication, LoginRequest, LoginResponse } from '../interfaces/Authentication';
import { Usuario } from '../interfaces/usuario';
import { Modulo } from '../interfaces/modulo';

import { catchError } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

interface ResponseDTO<T> {
  p_status: number;
  message: string;
  data: T;
}

interface GraphGroup {
  id?: string;
  displayName?: string;
  description?: string;
  mail?: string;
  mailNickname?: string;
  securityIdentifier?: string;
  groupTypes?: string[];
}

interface PerfilMicrosoftResponse {
  rolDescripcion?: string;
  nombre?: string;
  graphGroupId?: string;
  graphGroup?: GraphGroup | null;
}

interface MicrosoftServiciosResponse {
  perfilesDisponibles: PerfilMicrosoftResponse[];
  gruposDelegados: GraphGroup[];
  gruposSinConfiguracion: GraphGroup[];
}


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }),
  withCredentials: true
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private TOKEN_NAME:string = 'upsjb_reserva';
  private REFRESH_NAME:string = 'upsjb_refresh';
  private helper:JwtHelperService;/*
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;*/
  private currentUserSubject: BehaviorSubject<Usuario>;
  public currentUser: Observable<Usuario>;
  public currentUsuario: Usuario | undefined;

  private lastLoggedToken: string | null = null;

  private inactivityTimer: any;
  private activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
  private boundResetTimer = this.resetInactivityTimer.bind(this);

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, private msalService: MsalService) {

    this.helper = new JwtHelperService();
    this.currentUserSubject = new BehaviorSubject<Usuario>(
        JSON.parse(localStorage.getItem('currentUser') || '{}')
      );

    this.currentUser = this.currentUserSubject.asObservable();

    if (this.idAuthenticated()) {
      this.scheduleAutoLogout();
    }

  }
  public get currentUserValue(): Usuario {
      return this.currentUserSubject.value;
    }

  pruebaConexionBackend() {
    return this.http.get<any[]>(`${environment.apiUrl}/prueba`
    );
  }
  loginServer(authentication:Authentication) {
    return this.http
      .post<any>(`${environment.apiUrl}/api/login`, authentication, httpOptions)
      .pipe(
        map((user) => {
          if(user.success){
            this.setAuthentication(user.token);
            // Emitir el usuario actualizado
            this.currentUserSubject.next(this.getUser());
          }
          return user;
        })
      );
  }
  registerServer(authentication:Authentication) {
    return this.http
      .post<any>(`${environment.apiUrl}/register`, authentication, httpOptions)
      .pipe(
        map((user) => {
          /*if(user.status==1){
            this.setAuthentication(user.accessToken);
          }*/
          return user;
        })
      );
  }


//   logout() {
//     localStorage.removeItem('currentUser');
//     localStorage.removeItem(this.TOKEN_NAME);
//     this.router.navigate(['/']);
//     return of({ success: false });
//   }

  setAuthentication(token: string) {
    localStorage.setItem(this.TOKEN_NAME, token);
    const decoded = this.helper.decodeToken(token);

    const isExpired = this.helper.isTokenExpired(token);

    if (isExpired) {
      this.logout();
    } else {
      const roleDescriptions = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
      const idUsuario = this.extractUserId(decoded);
      const user: Usuario = {
        id: idUsuario,
        email: decoded.email ?? decoded.sub,
        roles: roleDescriptions
      };

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      forkJoin<{ status: string; data: Modulo[] }[]>(
        roleDescriptions.map((desc: string) =>
          this.http.get<{ status: string; data: Modulo[] }>(
            `${this.apiUrl}/roles/lista-rolmodulos-desc/${desc}`,
            { headers }
          )
        )
      ).subscribe({
        next: (responses: { status: string; data: Modulo[] }[]) => {
          const modules = Array.from(
            new Set(
              responses.flatMap((r: { data: Modulo[] }) => r.data.map((m: Modulo) => m.codigo))
            )
          );
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('role', JSON.stringify(roleDescriptions));
          localStorage.setItem('modules', JSON.stringify(modules));
          this.currentUserSubject.next(user);
          this.scheduleAutoLogout();
        },
        error: () => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('role', JSON.stringify(roleDescriptions));
          localStorage.setItem('modules', JSON.stringify([]));
          this.currentUserSubject.next(user);
          this.scheduleAutoLogout();
        }
      });
    }
  }

  private extractUserId(payload: any): number {
    const fields = ['idusuario', 'id', 'userId', 'userid', 'uid', 'nameid', 'sub'];
    for (const f of fields) {
      const raw = payload?.[f];
      const id = Number(raw);
      if (Number.isFinite(id)) return id;
    }
    return 0;
  }
  getToken(): string {
    return localStorage.getItem(this.TOKEN_NAME) || '';
  }

  setToken(token: string) {
      localStorage.setItem(this.TOKEN_NAME, token);
    }


  getUser(){
    const token = this.getToken();
    if (!token || token === 'null') {
      if (this.lastLoggedToken !== null) {
        console.warn('No existe un token JWT válido en almacenamiento.');
        this.lastLoggedToken = null;
      }
      return {} as any;
    }

    const decoded = this.helper.decodeToken(token);
    if (decoded && this.lastLoggedToken !== token) {
      console.log('decoded token:', decoded);
      this.lastLoggedToken = token;
    } else if (!decoded && this.lastLoggedToken !== null) {
      console.warn('No fue posible decodificar el token JWT almacenado.');
      this.lastLoggedToken = null;
    }

    return decoded || ({} as any);
  }

  /**
   * Obtiene el identificador numérico del usuario autenticado a partir del token o del almacenamiento local.
   */
  getUserId(): number {
    const decoded = this.getUser();
    const id = this.extractUserId(decoded);
    if (id !== 0) return id;
    const stored = Number(this.currentUserValue?.id);
    return Number.isFinite(stored) ? stored : 0;
  }

  getRoles(): string[] {
    const modules = localStorage.getItem('modules');
    return modules ? JSON.parse(modules) : [];
  }

  idAuthenticated():boolean{
    const token = this.getToken();
    if(_.isNil(token) || token=='null') {
      return false;
    }
    return !this.helper.isTokenExpired(token);
  }

    /**
     * Abre en una nueva pestaña el recurso almacenado en localStorage tras iniciar sesión.
     */
    openPendingResource(): void {
      const id = localStorage.getItem('redirectRecurso');
      if (!id) return;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
      this.http.get<ResponseDTO<string>>(
        `${this.apiUrl}/api/recursos-digitales/enlace/${id}`,
        { headers }
      ).subscribe({
        next: res => {
          if (res.p_status === 0) {
            window.open(res.data, '_blank');
          }
        },
        error: () => {}
      });
      localStorage.removeItem('redirectRecurso');
    }

// Login con Office 365: se espera recibir el token de Microsoft (obtenido con MSAL, por ejemplo)
// loginMicrosoft(msToken: string): Observable<LoginResponse> {
//     return this.http.post<LoginResponse>(`${this.apiUrl}/login-microsoft`, { token: msToken });
// }

getMicrosoftToken(): Observable<{ email: string; token: string }> {
    const scopes = ['user.read'];
    const active = this.msalService.instance.getActiveAccount();

    if (active) {
      return this.msalService.acquireTokenSilent({ account: active, scopes }).pipe(
        map(res => ({ email: active.username || '', token: res.accessToken })),
        catchError(() =>
          this.msalService.acquireTokenPopup({ scopes }).pipe(
            map(r => ({ email: r.account?.username || '', token: r.accessToken }))
          )
        )
      );
    }

    return this.msalService.loginPopup({ prompt: 'select_account', scopes }).pipe(
      map((result: AuthenticationResult) => {
        this.msalService.instance.setActiveAccount(result.account);
        return { email: result.account?.username || '', token: result.accessToken };
      })
    );
  }

  obtenerServiciosMicrosoft(msToken: string): Observable<MicrosoftServiciosResponse> {
    return this.http
      .post<MicrosoftServiciosResponse>(`${this.apiUrl}/microsoft/servicios`, { token: msToken })
      .pipe(
        tap((response) => {
          console.log('📦 Respuesta de Microsoft Graph:', response);
          const delegados = Array.isArray(response?.gruposDelegados) ? response.gruposDelegados : [];
          if (delegados.length) {
            console.log('🟦 Grupos Microsoft recibidos:', delegados.map((g) => `${g.displayName ?? '(sin nombre)'} (${g.id ?? 'sin id'})`));
          } else {
            console.log('🟦 Microsoft Graph no devolvió grupos delegados para el token proporcionado.');
          }
          const perfiles = Array.isArray(response?.perfilesDisponibles) ? response.perfilesDisponibles : [];
          if (perfiles.length) {
            console.log('🟩 Perfiles configurados en BD:', perfiles.map((p) => `${p.rolDescripcion ?? p.nombre ?? '(sin descripción)'}`));
          } else {
            console.log('🟩 No existen perfiles configurados vinculados a los grupos de Microsoft.');
          }
          const sinConfig = Array.isArray(response?.gruposSinConfiguracion) ? response.gruposSinConfiguracion : [];
          if (sinConfig.length) {
            console.log('🟧 Grupos de Microsoft sin configuración local:', sinConfig.map((g) => `${g.displayName ?? '(sin nombre)'} (${g.id ?? 'sin id'})`));
          }
        })
      );
  }

  loginMicrosoft(msToken: string, role: string): void {
    this.http.post<LoginResponse>(`${this.apiUrl}/login-microsoft`, { token: msToken, role })
      .subscribe({
        next: (backendResponse) => {
          if (backendResponse.token) {
            this.setAuthentication(backendResponse.token);
            this.currentUserSubject.next(this.getUser());
            this.openPendingResource();
            this.router.navigate(['/main']);
          }
        },
        error: (error) => {
          console.error('Error en autenticación con backend:', error);
          if (error.status === 404 && error.error?.email) {
            localStorage.setItem('msUserData', JSON.stringify(error.error));
            this.router.navigate(['/registrate'], { state: { notRegistered: true } });
          } else {
            alert(this.obtenerMensajeError(error));
          }
        }
      });
  }

  // Método para personalizar el mensaje de error
  public obtenerMensajeError(error: any): string {
    const errorMessage =
      error?.error?.message || error?.error || error?.message || error.toString();
    if (typeof errorMessage === 'string' && errorMessage.includes('AADSTS50020')) {
      return 'Usuario no registrado en el tenant. Por favor, utiliza una cuenta válida o contacta a tu administrador.';
    }
    return `Error de autenticación: ${errorMessage}`;
  }

  // Login manual: envía las credenciales y espera una respuesta con mensaje y token.
  loginManual(credentials: LoginRequest): Observable<LoginResponse> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials, { headers, withCredentials: true })
        .pipe(
          tap(response => {
            if (response.token) {
              localStorage.setItem(this.TOKEN_NAME, response.token);
              localStorage.setItem(this.REFRESH_NAME, response.refreshToken);
              console.log('Token almacenado en localStorage:', response.token);
              this.scheduleAutoLogout();
            }
          })
        );
    }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email })
      .pipe(
        catchError(err => {
          console.error('Error en forgotPassword:', err);
          throw err;
        })
      );
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.get<any>(`${environment.filesUrl}/reset-password`, { params: { token } })
      .pipe(
        catchError(err => {
          console.error('Error en validateResetToken:', err);
          throw err;
        })
      );
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.filesUrl}/reset-password`, { token, password })
      .pipe(
        catchError(err => {
          console.error('Error en resetPassword:', err);
          throw err;
        })
      );
  }

  getRolesByEmail(email: string): Observable<{ label: string; value: string }[]> {
    const normalized = email?.trim().toUpperCase();
    if (!normalized) {
      return of([]);
    }
    const encoded = encodeURIComponent(normalized);
    return this.http
      .get<{ status: string; data: any[] }>(`${this.apiUrl}/permisosRolPorUsuarioEmail/${encoded}`)
      .pipe(
        map(res => res.data.map(r => ({ label: r.descripcion, value: r.descripcion }))),
        catchError(() => of([]))
      );
  }

  /** Obtiene la lista pública de roles disponibles */
  getPublicRoles(): Observable<{ idRol: number; descripcion: string }[]> {
    return this.http
      .get<{ status: string; data: any[] }>(`${this.apiUrl}/roles/lista-roles`)
      .pipe(
        map(res => res.data || []),
        catchError(() => of([]))
      );
  }

  getProgramas(): Observable<{ idPrograma: number; programa: string; descripcionPrograma: string }[]> {
    return this.http
      .get<any>(`${this.apiUrl}/api/catalogos/programas`)
      .pipe(
        map(res => Array.isArray(res) ? res : (res?.data ?? [])),
        catchError(() => of([]))
      );
  }

  getEspecialidades(): Observable<{ idEspecialidad: number; descripcion: string }[]> {
    return this.http
      .get<any>(`${this.apiUrl}/api/catalogos/especialidades`)
      .pipe(
        map(res => Array.isArray(res) ? res : (res?.data ?? [])),
        catchError(() => of([]))
      );
  }

// Registro manual: envía los datos del usuario
register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
}

// Llama a esta función después de un login exitoso para programar el cierre de sesión automático.
scheduleAutoLogout(): void {
  this.activityEvents.forEach(event =>
    document.addEventListener(event, this.boundResetTimer)
  );
  this.resetInactivityTimer();
}

private resetInactivityTimer(): void {
  if (this.inactivityTimer) {
    clearTimeout(this.inactivityTimer);
  }
    this.inactivityTimer = setTimeout(() => {
      console.log('🔒 Sesión cerrada por inactividad.');
      this.logout();
    }, 3600000); // 1 hora
}


  logout(): void {
    this.activityEvents.forEach(event =>
      document.removeEventListener(event, this.boundResetTimer)
    );
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.TOKEN_NAME);
    localStorage.removeItem(this.REFRESH_NAME);
    this.currentUserSubject.next({} as Usuario);
    this.msalService.instance.setActiveAccount(null);
    void this.msalService.instance.clearCache();
    this.router.navigate(['/'], { replaceUrl: true });
  }

  refreshAccessToken(): Observable<string> {
    const refresh = localStorage.getItem(this.REFRESH_NAME);
    if(!refresh){
      return of('');
    }
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, {refreshToken: refresh})
      .pipe(
        tap(res => {
          localStorage.setItem(this.TOKEN_NAME, res.token);
          localStorage.setItem(this.REFRESH_NAME, res.refreshToken);
        }),
        map(res => res.token)
      );
  }

  getEmail(): string {
      const token = localStorage.getItem(this.TOKEN_NAME) ?? '';
      if (!token || this.helper.isTokenExpired(token)) return '';
      const decoded = this.helper.decodeToken(token);
      // tu email está en `sub`
      return decoded.sub || '';
    }

}
