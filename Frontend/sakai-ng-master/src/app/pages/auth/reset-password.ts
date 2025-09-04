import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../biblioteca/services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [ButtonModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, CommonModule],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="w-full bg-surface-0 dark:bg-surface-900 p-8 sm:p-12" style="max-width:400px;border-radius:53px;">
                <h2 class="text-center text-2xl font-medium mb-6">Restablecer contraseña</h2>
                <div *ngIf="!valid">
                    <p class="text-center text-red-500">{{message || 'Token inválido o expirado'}}</p>
                </div>
                <div *ngIf="valid">
                    <label class="block mb-2">Nueva contraseña</label>
                    <p-password [(ngModel)]="password" placeholder="Nueva contraseña" [toggleMask]="true" [feedback]="false" styleClass="mb-4" [fluid]="true"></p-password>
                    <label class="block mb-2">Confirmar contraseña</label>
                    <p-password [(ngModel)]="confirm" placeholder="Confirmar contraseña" [toggleMask]="true" [feedback]="false" styleClass="mb-4" [fluid]="true"></p-password>
                    <p-button label="Actualizar contraseña" styleClass="w-full" (click)="onSubmit()"></p-button>
                </div>
            </div>
        </div>
    `
})
export class ResetPassword implements OnInit {
    token: string = '';
    password: string = '';
    confirm: string = '';
    valid: boolean = false;
    message: string | null = null;

    constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.route.queryParamMap.subscribe(params => {
            this.token = params.get('token') || '';
            if (this.token) {
                this.authService.validateResetToken(this.token).subscribe({
                    next: () => this.valid = true,
                    error: err => this.message = err.error?.message || 'Token inválido o expirado'
                });
            } else {
                this.message = 'Token inválido o expirado';
            }
        });
    }

    onSubmit(): void {
        if (this.password !== this.confirm) {
            alert('Las contraseñas no coinciden');
            return;
        }
        this.authService.resetPassword(this.token, this.password).subscribe({
            next: res => {
                alert(res.message || 'Contraseña actualizada');
                this.router.navigate(['/auth/login']);
            },
            error: err => {
                const msg = err.error?.message || 'Error al actualizar contraseña';
                alert(msg);
            }
        });
    }

}
