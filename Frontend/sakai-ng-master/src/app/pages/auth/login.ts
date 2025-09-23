import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../biblioteca/services/auth.service';

export interface LoginCredentials {
  email: string;
  password: string;
  role: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    RouterModule,
    RippleModule,
    AppFloatingConfigurator
  ],
  template: `
    <app-floating-configurator />
    <p-dialog
      [(visible)]="roleDialogVisible"
      [modal]="true"
      [closable]="false"
      [style]="{ width: '40rem' }"
      styleClass="role-dialog"
      [appendTo]="'body'"
    >
      <ng-template pTemplate="header">
        <div class="w-full text-center">
          <span class="text-red-600 uppercase font-semibold">Seleccionar usuario</span>
        </div>
      </ng-template>
      <div class="flex flex-col gap-2 w-full">
        <button
          *ngFor="let role of userRoles"
          (click)="selectRole(role.value)"
          class="w-full border border-gray-300 py-3 text-center uppercase font-medium text-gray-700 hover:text-red-600 hover:border-red-600 transition-colors cursor-pointer"
        >
          {{ role.label }}
        </button>
      </div>
      <div class="mt-4 text-sm font-semibold text-center">
        <span class="text-gray-700">Usuario:</span>
        <span class="text-red-600">{{ credentials.email }}</span>
      </div>
    </p-dialog>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden p-4">
      <div class="flex flex-col items-center justify-center w-full">
        <div class="w-full max-w-xl" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-8 sm:px-12" style="border-radius: 53px">
            <div class="text-center mb-8">
              <img src="assets/logo.png" alt="Logo" class="mb-8 w-30 shrink-0 mx-auto" />
              <span class="block text-muted-color font-medium">Inicia sesión con tu cuenta institucional</span>
            </div>
            <div class="flex flex-col gap-6 items-center">
              <p-button
                label="Iniciar sesión con Microsoft365"
                icon="pi pi-microsoft"
                styleClass="w-full sm:w-auto ms-login-button"
                (click)="loginWithMicrosoft()"
                [loading]="loadingMicrosoft"
              ></p-button>
              <div class="text-sm text-center text-gray-500">
                Usa el botón superior para autenticarte con Microsoft 365. Tras elegir tu perfil,
                serás redirigido automáticamente al panel principal.
              </div>
              <span class="font-medium text-center text-primary cursor-pointer" (click)="onForgotPassword()">¿Olvidaste tu contraseña?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep .role-dialog {
      opacity: 0;
      transform: scale(0.85);
      transition: transform 0.3s ease, opacity 0.3s ease;
    }

    :host ::ng-deep .role-dialog.p-dialog-visible {
      opacity: 1;
      transform: scale(1);
    }
  `]
})
export class Login implements OnInit {
  checked = false;
  userRoles: { label: string; value: string }[] = [];
  credentials: LoginCredentials = { email: '', password: '', role: '' };
  roleDialogVisible = false;
  msToken: string = '';
  loadingMicrosoft = false;

  constructor(private authService: AuthService, private router: Router) {}

  loginWithMicrosoft() {
    if (this.loadingMicrosoft) {
      return;
    }
    this.loadingMicrosoft = true;
    this.authService.getMicrosoftToken().subscribe({
      next: ({ email, token }) => {
        this.credentials.email = email;
        this.msToken = token;
        this.authService.getRolesByEmail(email).subscribe({
          next: roles => {
            this.userRoles = roles.length ? roles : [{ label: 'ESTUDIANTE', value: 'ESTUDIANTE' }];
            if (this.userRoles.length > 1) {
              this.roleDialogVisible = true;
            } else {
              this.selectRole(this.userRoles[0].value);
            }
            this.loadingMicrosoft = false;
          },
          error: () => {
            this.userRoles = [{ label: 'ESTUDIANTE', value: 'ESTUDIANTE' }];
            this.selectRole('ESTUDIANTE');
            this.loadingMicrosoft = false;
          }
        });
      },
      error: (error) => {
        console.error('Error en la autenticación con Microsoft:', error);
        alert(this.authService.obtenerMensajeError(error));
        this.loadingMicrosoft = false;
      },
    });
  }


  selectRole(role: string) {
    this.credentials.role = role;
    this.roleDialogVisible = false;
    if (this.msToken) {
      this.finishMicrosoftLogin();
    } else {
      this.finishManualLogin();
    }
  }

  private finishMicrosoftLogin() {
    const role = this.credentials.role || 'ESTUDIANTE';
    this.authService.loginMicrosoft(this.msToken, role);
  }

  ngOnInit(): void {
    const remembered = localStorage.getItem('rememberedEmail');
    if (remembered) {
      this.credentials.email = remembered;
      this.checked = true;
    }
  }

  onLogin(): void {
    if (this.credentials.email && this.credentials.password) {
      this.authService.getRolesByEmail(this.credentials.email).subscribe({
        next: roles => {
          this.userRoles = roles.length ? roles : [{ label: 'ESTUDIANTE', value: 'ESTUDIANTE' }];
          if (this.userRoles.length > 1) {
            this.roleDialogVisible = true;
          } else {
            this.selectRole(this.userRoles[0].value);
          }
        },
        error: () => {
          alert('No se pudo obtener roles para el usuario');
        }
      });
    } else {
      alert('Por favor ingresa email y contraseña');
    }
  }

  private finishManualLogin(): void {
    this.authService.loginManual(this.credentials).subscribe({
      next: (response) => {
        this.authService.setAuthentication(response.token);
        this.authService.openPendingResource();
        if (this.checked) {
          localStorage.setItem('rememberedEmail', this.credentials.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        this.router.navigate(['/main']);
      },
      error: (err) => {
        alert('Credenciales incorrectas');
        console.error('Error en login manual:', err);
      }
    });
  }

  onForgotPassword(): void {
    if (!this.credentials.email) {
      alert('Ingresa tu email para recuperar la contraseña');
      return;
    }
    this.authService.forgotPassword(this.credentials.email).subscribe({
      next: (res) => {
        if (res.token) {
          this.router.navigate(['/auth/reset-password'], { queryParams: { token: res.token } });
        } else {
          alert(res.message || 'No se pudo generar el token');
        }
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al solicitar recuperación de contraseña';
        alert(msg);
      }
    });
  }
}
