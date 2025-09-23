import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';

import { AuthService } from '../../../../biblioteca/services/auth.service';
import { MicrosoftLoginViewModel } from '../../../../pages/auth/microsoft-login.viewmodel';

@Component({
    selector: 'portal-topbar',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, RippleModule, DialogModule],
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
    `],
    template: `<p-dialog
    [(visible)]="vm.roleDialogVisible"
    [modal]="true"
    [closable]="false"
    [appendTo]="'body'"
    [style]="{ width: '24rem' }"
    styleClass="role-dialog"
  >
    <ng-template pTemplate="header">
      <div class="w-full text-center">
        <span class="text-red-600 uppercase font-semibold">Seleccionar usuario</span>
      </div>
    </ng-template>
    <div class="flex flex-col gap-2 w-full">
      <button
        *ngFor="let role of vm.userRoles"
        (click)="vm.selectRole(role.value)"
        class="w-full border border-gray-300 py-3 text-center uppercase font-medium text-gray-700 hover:text-red-600 hover:border-red-600 transition-colors cursor-pointer"
      >
        {{ role.label }}
      </button>
    </div>
    <div class="mt-4 text-sm font-semibold text-center">
      <span class="text-gray-700">Usuario:</span>
      <span class="text-red-600">{{ vm.userEmail }}</span>
    </div>
  </p-dialog>
<header class="site-header full-bleed">
  <div class="nav-inner">
    <a class="brand" (click)="go('home')">
      <img class="brand-logo" src="assets/BOTON-LOGO.png" alt="UPSJB" />
    </a>

    <nav class="main-nav">
      <a (click)="go('home')">Inicio</a>
      <a (click)="go('portal-nosotros')">Nosotros</a>
      <a (click)="go('portal-ejemplares')">Recursos</a>
      <a (click)="go('portal-noticias')">Noticias</a>
      <a (click)="go('portal-contactanos')">Contáctanos</a>
      <a (click)="go('portal-horarios')">Horarios</a>
    </nav>

    <div class="actions">
      <ng-container *ngIf="!vm.showUserActions; else loggedActions">
        <button
          pButton
          pRipple
          type="button"
          class="login"
          label="Iniciar sesión con Microsoft365"
          icon="pi pi-microsoft"
          styleClass="ms-login-button"
          (click)="vm.startMicrosoftLogin()"
          [loading]="vm.loading"
        ></button>
      </ng-container>
      <ng-template #loggedActions>
        <button
          pButton
          pRipple
          type="button"
          class="login"
          [label]="vm.displayName"
          (click)="vm.openRoleDialog()"
        ></button>
        <button
          pButton
          pRipple
          type="button"
          class="btn-registrate"
          label="Cerrar sesión"
          (click)="vm.logout()"
        ></button>
      </ng-template>
    </div>
  </div>
</header>`
})
export class PortalTopbar {
    vm: MicrosoftLoginViewModel;

    constructor(private router: Router, private authService: AuthService) {
        this.vm = new MicrosoftLoginViewModel(this.authService, this.router);
    }

    go(fragment: string) {
        this.router.navigate(['/'], { fragment });
    }
}
