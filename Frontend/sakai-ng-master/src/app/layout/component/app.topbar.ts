import { Component, ViewChild, OnInit  } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';

import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { Notificacion } from '../../biblioteca/interfaces/notificacion';
import { OcurrenciaDTO } from '../../biblioteca/interfaces/ocurrenciaDTO';
import { PrestamosService } from '../../biblioteca/services/prestamos.service';
import { OcurrenciasService } from '../../biblioteca/services/ocurrencias.service';
import { AuthService } from '../../biblioteca/services/auth.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, StyleClassModule, OverlayPanelModule, DialogModule, TableModule, ButtonModule, OverlayBadgeModule, MenuModule],
    styles: [
      `.highlight-row { animation: fadeHighlight 2s ease-in-out forwards; }
       @keyframes fadeHighlight { from { background-color: #ffe08a; } to { background-color: transparent; } }`
    ],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="assets/logo.png" alt="Logo" />
            </a>
        </div>

        <div class="layout-topbar-actions">

                <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                    <i class="pi pi-ellipsis-v"></i>
                </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">

                    <p-overlaybadge [value]="unreadCount" severity="danger">
                      <button
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                        (click)="toggleNotifications($event)"
                        [disabled]="loadingNotifications">
                        <i class="pi pi-inbox"></i>
                        <span>Mensajes</span>
                      </button>
                    </p-overlaybadge>

                    <button type="button" class="layout-topbar-action" (click)="profileMenu.toggle($event)">
                        <i class="pi pi-user"></i>
                        <span>{{ userEmail }}</span>
                    </button>
                    <p-menu #profileMenu [popup]="true" [model]="profileItems" appendTo="body"></p-menu>

                    <p-overlayPanel #op [dismissable]="true">
                      <ng-container>
                        <p-overlaybadge *ngIf="solicitudesNuevas" [value]="solicitudesNuevas" severity="danger">
                          <button
                            pButton
                            type="button"
                            class="w-full text-left p-button-text"
                            (click)="abrirSolicitudes(); op.hide()"
                          >
                            Solicitudes
                          </button>
                        </p-overlaybadge>
                        <button
                          *ngIf="!solicitudesNuevas"
                          pButton
                          type="button"
                          class="w-full text-left p-button-text"
                          (click)="abrirSolicitudes(); op.hide()"
                        >
                          Solicitudes
                        </button>
                      </ng-container>
                      <ng-container>
                        <p-overlaybadge *ngIf="ocurrenciasNuevas" [value]="ocurrenciasNuevas" severity="danger">
                      <button
                        pButton
                            type="button"
                            class="w-full text-left p-button-text"
                            (click)="abrirOcurrencias(); op.hide()"
                          >
                            Ocurrencias
                      </button>
                        </p-overlaybadge>
                        <button
                          *ngIf="!ocurrenciasNuevas"
                          pButton
                          type="button"
                          class="w-full text-left p-button-text"
                          (click)="abrirOcurrencias(); op.hide()"
                        >
                          Ocurrencias
                        </button>
                      </ng-container>
                    </p-overlayPanel>
                </div>
            </div>
        </div>
        <p-dialog header="Solicitudes" [(visible)]="displayDialog" [modal]="true" [style]="{width: '70vw'}" appendTo="body" [baseZIndex]="1100">
          <p-table [value]="solicitudes" *ngIf="solicitudes.length">
            <ng-template pTemplate="header">
              <tr>
                <th>Recurso</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-s let-i="rowIndex">
              <tr [ngClass]="{ 'highlight-row': highlightSolicitudes.includes(i) }">
                <td>{{ recursoNotificacion(s) }}</td>
                <td>{{ estadoNotificacion(s) }}</td>
                <td>{{ s.fechaCreacion | date:'short' }}</td>
              </tr>
            </ng-template>
          </p-table>
          <div *ngIf="!solicitudes.length" class="p-2 text-center text-gray-600">No hay solicitudes</div>
        </p-dialog>

        <p-dialog header="Ocurrencias" [(visible)]="displayOcurrencias" [modal]="true" [style]="{width: '70vw'}" appendTo="body" [baseZIndex]="1100">
          <p-table [value]="ocurrencias" *ngIf="ocurrencias.length">
            <ng-template pTemplate="header">
              <tr>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-o let-i="rowIndex">
              <tr [ngClass]="{ 'highlight-row': highlightOcurrencias.includes(i) }">
                <td>{{ o.descripcion }}</td>
                <td>{{ o.estadoCosto === 1 ? 'Costeada' : 'Pendiente' }}</td>
                <td>{{ o.fechaOcurrencia || (o.fechaCreacion | date:'short') }}</td>
              </tr>
            </ng-template>
          </p-table>
          <div *ngIf="!ocurrencias.length" class="p-2 text-center text-gray-600">No hay ocurrencias</div>
        </p-dialog>
    </div>`
})
export class AppTopbar implements OnInit {
    @ViewChild('op') overlayPanel!: OverlayPanel;
    @ViewChild('profileMenu') profileMenu!: Menu;
    items!: MenuItem[];
    notificaciones: Notificacion[] = [];
    loadingNotifications = false;
    displayDialog = false;
    solicitudes: Notificacion[] = [];
    displayOcurrencias = false;
    ocurrencias: OcurrenciaDTO[] = [];
    profileItems: MenuItem[] = [];
    highlightSolicitudes: number[] = [];
    highlightOcurrencias: number[] = [];
    userEmail = '';

    get solicitudesNuevas(): number {
      return this.notificaciones.filter(n => !n.leida && !n.mensaje.toLowerCase().includes('ocurrencia')).length;
    }

    get ocurrenciasNuevas(): number {
      return this.notificaciones.filter(n => !n.leida && n.mensaje.toLowerCase().includes('ocurrencia')).length;
    }


    unreadCount = 0;

    constructor(
      public layoutService: LayoutService,
      private prestamoService: PrestamosService,
      private ocurrenciasService: OcurrenciasService,
      private authService: AuthService
    ) {}

    ngOnInit() {
        const user = this.authService.getUser();
        const rawEmail =
          this.authService.currentUserValue?.email ||
          user?.email ||
          user?.sub ||
          (user?.preferred_username ?? user?.unique_name ?? user?.upn ?? '');
        this.userEmail = (rawEmail || '')
          .toString()
          .replace(/@upsjb\.edu\.pe$/i, '');
        this.loadNotifications();
        this.initProfileMenu();
    }

    loadNotifications() {
        this.loadingNotifications = true;
        this.prestamoService.getNotificaciones().subscribe({
          next: nots => {
            this.notificaciones = nots;
            this.unreadCount = nots.filter(n => !n.leida).length;
            this.loadingNotifications = false;
          },
          error: () => this.loadingNotifications = false
        });
      }

      toggleNotifications(event: Event) {
        // cada vez que abras, recarga
        this.loadNotifications();
        this.overlayPanel.toggle(event);
      }


  abrirSolicitudes() {
    const lista = this.notificaciones
      .filter(n => !n.mensaje.toLowerCase().includes('ocurrencia'))
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());

    this.solicitudes = lista;
    const count = this.solicitudesNuevas;
    this.displayDialog = true;
    if (count > 0) {
      this.highlightSolicitudes = Array.from({ length: count }, (_, i) => i);
      setTimeout(() => (this.highlightSolicitudes = []), 2000);
    } else {
      this.highlightSolicitudes = [];
    }
    const ids = lista.map(n => n.id);
    this.marcarLeidas(ids);
  }
  abrirOcurrencias() {
    const usuario = this.authService.getUser().sub;
    this.ocurrenciasService.api_ocurrencias_usuario(usuario).subscribe(lista => {
      this.ocurrencias = (lista as OcurrenciaDTO[])
        .sort((a, b) => {
          const dA = a.fechaOcurrencia ? new Date(a.fechaOcurrencia).getTime() : a.fechaCreacion ? new Date(a.fechaCreacion).getTime() : 0;
          const dB = b.fechaOcurrencia ? new Date(b.fechaOcurrencia).getTime() : b.fechaCreacion ? new Date(b.fechaCreacion).getTime() : 0;
          return dB - dA;
    });
      const count = this.ocurrenciasNuevas;
      this.displayOcurrencias = true;
      if (count > 0) {
        this.highlightOcurrencias = Array.from({ length: count }, (_, i) => i);
        setTimeout(() => (this.highlightOcurrencias = []), 2000);
      } else {
        this.highlightOcurrencias = [];
      }
      const ids = this.notificaciones
        .filter(n => n.mensaje.toLowerCase().includes('ocurrencia'))
        .map(n => n.id);
      this.marcarLeidas(ids);
    });
  }

  private marcarLeidas(ids: number[]) {
    ids.forEach(id => {
      this.prestamoService.marcarLeida(id).subscribe({ next: () => {}, error: () => {} });
      const not = this.notificaciones.find(n => n.id === id);
      if (not) { not.leida = true; }
    });
  }

  /** Devuelve el recurso mencionado en la notificación */
  recursoNotificacion(n: Notificacion): string {
    const match = n.mensaje.match(/(?:de|del)\s+(.+?)\s+fue/i);
    return match ? match[1] : n.mensaje;
  }

  /** Traduce el mensaje a un estado legible */
  estadoNotificacion(n: Notificacion): string {
    const text = n.mensaje.toLowerCase();
    if (/aprob/.test(text)) {
      return 'Aprobado';
    }
    if (/rechaz/.test(text)) {
      return 'Rechazado';
    }
    return 'Pendiente';
  }

  private initProfileMenu() {
    const user = this.authService.getUser();
    const email = this.userEmail || user?.email || user?.sub || '';
    const name = user?.givenname
      ? `${user.givenname} ${user.surname || ''}`
      : (user?.nombres || email || '');
    const roles = user?.roles
      ? (Array.isArray(user.roles) ? user.roles.join(', ') : user.roles)
      : (user?.role || '');
    const items: MenuItem[] = [{ label: name, disabled: true }];
    if (roles) {
      items.push({ label: `Tipo: ${roles}`, disabled: true });
    }
    items.push({ separator: true });
    items.push({
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: () => this.authService.logout()
    });
    this.profileItems = items;
  }
}
