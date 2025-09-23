import { Router } from '@angular/router';

import { AuthService } from '../../biblioteca/services/auth.service';

export interface RoleOption {
  label: string;
  value: string;
}

interface MicrosoftPerfilResumen {
  rolDescripcion?: string;
  nombre?: string;
}

interface MicrosoftServiciosResumen {
  perfilesDisponibles?: MicrosoftPerfilResumen[];
}

export class MicrosoftLoginViewModel {
  roleDialogVisible = false;
  userRoles: RoleOption[] = [];
  msToken = '';
  userEmail = '';
  loading = false;
  showUserActions = false;
  private pendingRoleSelection = false;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.hydrateFromExistingSession();
  }

  get displayName(): string {
    const decoded = this.authService.getUser() ?? {};
    const composedName = decoded?.givenname || decoded?.surname
      ? `${decoded?.givenname ?? ''} ${decoded?.surname ?? ''}`.trim()
      : (decoded?.nombres ?? decoded?.name ?? '');
    if (composedName) {
      return composedName.toUpperCase();
    }

    const baseEmail = this.userEmail || decoded?.email || decoded?.sub || decoded?.preferred_username || '';
    if (!baseEmail) {
      return 'MI CUENTA';
    }
    const alias = baseEmail.split('@')[0];
    return (alias || baseEmail).toUpperCase();
  }

  startMicrosoftLogin(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.roleDialogVisible = false;
    this.pendingRoleSelection = false;
    this.userRoles = [];
    this.authService.getMicrosoftToken().subscribe({
      next: ({ email, token }) => {
        this.msToken = token;
        this.userEmail = email;
        this.authService.obtenerServiciosMicrosoft(token).subscribe({
          next: (response) => {
            if (!this.applyRolesFromMicrosoft(response)) {
              this.loadRolesFallback(email);
            }
          },
          error: (error) => {
            console.error('Error al consultar servicios de Microsoft para depuración:', error);
            this.loadRolesFallback(email);
          }
        });
      },
      error: error => {
        this.loading = false;
        console.error('Error en autenticación de Microsoft:', error);
        alert(this.authService.obtenerMensajeError(error));
      }
    });
  }

  openRoleDialog(): void {
    if (this.msToken) {
      if (!this.userRoles.length && this.userEmail) {
        this.loadRolesFallback(this.userEmail);
        return;
      }
      if (!this.pendingRoleSelection) {
        this.router.navigate(['/main']);
        return;
      }
      if (this.userRoles.length <= 1) {
        this.selectRole(this.userRoles[0]?.value ?? 'ESTUDIANTE');
        return;
      }
      this.roleDialogVisible = true;
      return;
    }

    if (this.authService.idAuthenticated()) {
      this.router.navigate(['/main']);
    }
  }

  selectRole(role: string): void {
    const selectedRole = role || 'ESTUDIANTE';
    console.log('✅ Rol seleccionado para autenticación:', selectedRole);
    this.pendingRoleSelection = false;
    this.roleDialogVisible = false;
    if (this.msToken) {
      const token = this.msToken;
      this.msToken = '';
      this.authService.loginMicrosoft(token, selectedRole);
      return;
    }

    this.router.navigate(['/main']);
  }

  logout(): void {
    this.resetTransientState();
    this.authService.logout();
  }

  private hydrateFromExistingSession(): void {
    if (!this.authService.idAuthenticated()) {
      return;
    }
    const decoded = this.authService.getUser() ?? {};
    this.userEmail = decoded?.email || decoded?.sub || decoded?.preferred_username || this.authService.getEmail() || '';
    const storedRoles = this.normalizeRoles(decoded?.role ?? decoded?.roles ?? JSON.parse(localStorage.getItem('role') ?? '[]'));
    this.userRoles = storedRoles.length ? storedRoles : this.defaultRoles();
    this.showUserActions = true;
    this.pendingRoleSelection = false;
  }

  private loadRolesFallback(email: string): void {
    this.authService.getRolesByEmail(email).subscribe({
      next: roles => {
        console.log('🟨 Roles obtenidos desde el backend para comparación:', roles.map(role => role.value));
        this.userRoles = roles.length ? roles : this.defaultRoles();
        this.showUserActions = true;
        this.pendingRoleSelection = this.userRoles.length > 1;
        this.loading = false;
        if (!this.pendingRoleSelection) {
          this.selectRole(this.userRoles[0].value);
        }
      },
      error: () => {
        console.warn('⚠️ No se pudieron recuperar roles desde el backend; se utilizarán roles por defecto.');
        this.userRoles = this.defaultRoles();
        this.showUserActions = true;
        this.pendingRoleSelection = false;
        this.loading = false;
        this.selectRole(this.userRoles[0].value);
      }
    });
  }

  private normalizeRoles(input: unknown): RoleOption[] {
    if (!input) {
      return [];
    }
    const roles = Array.isArray(input) ? input : [input];
    return roles
      .map(role => typeof role === 'string' ? role.trim().toUpperCase() : '')
      .filter(role => !!role)
      .map(role => ({ label: role, value: role }));
  }

  private applyRolesFromMicrosoft(response: MicrosoftServiciosResumen | null | undefined): boolean {
    const perfiles: MicrosoftPerfilResumen[] = Array.isArray(response?.perfilesDisponibles)
      ? (response?.perfilesDisponibles as MicrosoftPerfilResumen[])
      : [];
    const rawRoles = perfiles
      .map(perfil => perfil?.rolDescripcion ?? perfil?.nombre ?? '')
      .filter(valor => typeof valor === 'string' && valor.trim().length > 0);

    console.log('🟦 Roles brutos desde Microsoft Graph:', rawRoles);

    const normalizedRoles = this.normalizeRoles(rawRoles);
    const uniqueRoles = Array.from(new Map(normalizedRoles.map(role => [role.value, role])).values());

    console.log('🟢 Roles normalizados desde Microsoft Graph:', uniqueRoles.map(role => role.value));
    if (!uniqueRoles.length) {
      console.log('🟡 Microsoft Graph no proporcionó roles configurados; se usará el respaldo del backend.');
      return false;
    }

    this.userRoles = uniqueRoles;
    this.showUserActions = true;
    this.pendingRoleSelection = this.userRoles.length > 1;
    this.loading = false;

    console.log('🔄 Roles que se presentarán al usuario tras comparar con Microsoft:', this.userRoles.map(role => role.value));

    if (!this.pendingRoleSelection) {
      this.selectRole(this.userRoles[0].value);
    }

    return true;
  }

  private defaultRoles(): RoleOption[] {
    return [{ label: 'ESTUDIANTE', value: 'ESTUDIANTE' }];
  }

  private resetTransientState(): void {
    this.roleDialogVisible = false;
    this.userRoles = [];
    this.msToken = '';
    this.userEmail = '';
    this.loading = false;
    this.showUserActions = false;
    this.pendingRoleSelection = false;
  }
}
