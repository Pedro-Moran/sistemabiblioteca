import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
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
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    DialogModule,
    FormsModule,
    RouterModule,
    RippleModule,
    AppFloatingConfigurator
  ],
  styles: [`
    :host ::ng-deep .full-width-options .p-dropdown-item {
      width: 100%;
    }
  `],
  template: `
    <app-floating-configurator />
    <p-dialog header="Selecciona el tipo de usuario" [(visible)]="roleDialogVisible" [modal]="true" [closable]="false">
      <p-dropdown
        [options]="userRoles"
        optionLabel="label"
        optionValue="value"
        [(ngModel)]="credentials.role"
        appendTo="body"
        panelStyleClass="full-width-options"
      ></p-dropdown>
      <div class="flex justify-end mt-4">
        <p-button label="Continuar" (click)="confirmRoleSelection()"></p-button>
      </div>
    </p-dialog>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden p-4">
      <div class="flex flex-col items-center justify-center w-full">
        <div class="w-full max-w-xl" style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-8 sm:px-12" style="border-radius: 53px">
            <div class="text-center mb-8">
              <img src="assets/logo.png" alt="Logo" class="mb-8 w-30 shrink-0 mx-auto" />
              <span class="text-muted-color font-medium mb-4">Inicia sesión para continuar</span>
              <div class="flex justify-center w-full mt-4">
                <p-button label="Iniciar sesión con Microsoft365" styleClass="w-full sm:w-auto" (click)="loginWithMicrosoft()"></p-button>
              </div>
              <div class="flex items-center my-4">
                <div class="flex-grow border-t border-gray-300"></div>
                <span class="mx-4 text-gray-500">O</span>
                <div class="flex-grow border-t border-gray-300"></div>
              </div>
            </div>
            <div class="flex flex-col gap-4">
              <div>
                <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo electrónico</label>
                <input pInputText id="email" type="text" placeholder="Email address" class="w-full" [(ngModel)]="credentials.email" name="email" (ngModelChange)="onEmailChange()" />
              </div>

              <div>
                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                <p-password id="password" [(ngModel)]="credentials.password" placeholder="Contraseña" [toggleMask]="true" [fluid]="true" [feedback]="false"></p-password>
              </div>

              <div>
                <label for="role" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Tipo de usuario</label>
                <p-dropdown
                  id="role"
                  [options]="userRoles"
                  optionLabel="label"
                  optionValue="value"
                  [(ngModel)]="credentials.role"
                  placeholder="Seleccione un rol"
                  class="w-full"
                  [disabled]="roleDisabled"
                  appendTo="body"
                  panelStyleClass="full-width-options"
                ></p-dropdown>
              </div>

              <div class="flex items-center justify-between mt-2 mb-4 gap-4">
                <div class="flex items-center">
                  <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                  <label for="rememberme1">Recordarme</label>
                </div>
                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary" (click)="onForgotPassword()">¿Olvidaste tu contraseña?</span>
              </div>
              <p-button label="Iniciar sesión" styleClass="w-full" (click)="onLogin()"></p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Login implements OnInit {
  checked = false;
  userRoles: { label: string; value: string }[] = [];
  roleDisabled = true;
  credentials: LoginCredentials = { email: '', password: '', role: '' };
  roleDialogVisible = false;
  msToken: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  loginWithMicrosoft() {
    this.authService.getMicrosoftToken().subscribe({
      next: ({ email, token }) => {
        this.msToken = token;
        this.authService.getRolesByEmail(email).subscribe({
          next: roles => {
            this.userRoles = roles.length ? roles : [{ label: 'ESTUDIANTE', value: 'ESTUDIANTE' }];
            if (this.userRoles.length > 1) {
              this.credentials.role = this.userRoles[0].value;
              this.roleDialogVisible = true;
            } else {
              this.credentials.role = this.userRoles[0].value;
              this.finishMicrosoftLogin();
            }
          },
          error: () => {
            this.userRoles = [{ label: 'ESTUDIANTE', value: 'ESTUDIANTE' }];
            this.credentials.role = 'ESTUDIANTE';
            this.finishMicrosoftLogin();
          }
        });
      },
      error: (error) => {
        console.error('Error en la autenticación con Microsoft:', error);
        alert(this.authService.obtenerMensajeError(error));
      },
    });
  }

  confirmRoleSelection() {
    this.roleDialogVisible = false;
    this.finishMicrosoftLogin();
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
      this.loadUserRoles();
    }
  }

  onEmailChange(): void {
    this.loadUserRoles();
  }

  private loadUserRoles(): void {
    if (!this.credentials.email) {
      this.userRoles = [];
      this.credentials.role = '';
      this.roleDisabled = true;
      return;
    }
    this.authService.getRolesByEmail(this.credentials.email).subscribe({
      next: (roles) => {
        this.userRoles = roles;
        if (roles.length === 1) {
          this.credentials.role = roles[0].value;
          this.roleDisabled = true;
        } else {
          this.credentials.role = '';
          this.roleDisabled = false;
        }
      },
      error: () => {
        this.userRoles = [];
        this.credentials.role = '';
        this.roleDisabled = true;
      }
    });
  }

  onLogin(): void {
    if (this.credentials.email && this.credentials.password && this.credentials.role) {
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
    } else {
      alert('Por favor ingresa email, contraseña y tipo de usuario');
    }
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
