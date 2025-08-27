import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../biblioteca/services/auth.service';
import { LoginRequest, LoginResponse } from '../../biblioteca/interfaces/Authentication';

import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { InteractionType, AuthenticationResult } from '@azure/msal-browser';

export interface LoginCredentials {
  email: string;
  password: string;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center mb-8">
                            <img src="assets/logo.png" alt="Logo" class="mb-8 w-30 shrink-0 mx-auto" />
                            <span class="text-muted-color font-medium mb-4">Inicia sesión para continuar</span>
                            <p-button label="Iniciar sesión con Microsoft365" styleClass="w-full mt-4" (click)="loginWithMicrosoft()"></p-button>
                             <div class="flex items-center my-4">
                               <!-- Línea izquierda -->
                               <div class="flex-grow border-t border-gray-300"></div>

                               <!-- Texto "o" -->
                               <span class="mx-4 text-gray-500">O</span>

                               <!-- Línea derecha -->
                               <div class="flex-grow border-t border-gray-300"></div>
                             </div>
                        </div>

                        <div>


                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Correo electrónico</label>
                            <input pInputText id="email" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-4" [(ngModel)]="credentials.email" name="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
                            <p-password id="password1" [(ngModel)]="credentials.password" placeholder="Contraseña" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>


                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
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
    email: string = '';

    password: string = '';

    checked: boolean = false;
    credentials: LoginCredentials = { email: '', password: '' };

    constructor(private msalService: MsalService, private authService: AuthService, private router: Router) {}

     loginWithMicrosoft() {
        this.authService.loginMicrosoft();
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
            alert('Por favor ingresa email y contraseña');
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
