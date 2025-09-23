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
import { BadgeModule } from 'primeng/badge';
import { MenuModule } from 'primeng/menu';
import { TabViewModule } from 'primeng/tabview';
import { Menu } from 'primeng/menu';
import { Notificacion } from '../../biblioteca/interfaces/notificacion';
import { DetallePrestamo } from '../../biblioteca/interfaces/detalle-prestamo';
import { PrestamosService } from '../../biblioteca/services/prestamos.service';
import { AuthService } from '../../biblioteca/services/auth.service';
import { OcurrenciasService } from '../../biblioteca/services/ocurrencias.service';
import { MaterialBibliograficoService } from '../../biblioteca/services/material-bibliografico.service';
import { OcurrenciaDTO } from '../../biblioteca/interfaces/ocurrenciaDTO';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, StyleClassModule, OverlayPanelModule, DialogModule, TableModule, ButtonModule, OverlayBadgeModule, BadgeModule, MenuModule, TabViewModule, ToastModule],
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
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>

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
                      <p-overlaybadge *ngIf="prestamosNuevos" [value]="prestamosNuevos" severity="danger">
                        <button
                          pButton
                          type="button"
                          class="w-full text-left p-button-text"
                          (click)="abrirMisPrestamos(); op.hide()"
                        >
                          Mis Préstamos
                        </button>
                      </p-overlaybadge>
                      <button
                        *ngIf="!prestamosNuevos"
                        pButton
                        type="button"
                        class="w-full text-left p-button-text"
                        (click)="abrirMisPrestamos(); op.hide()"
                      >
                        Mis Préstamos
                      </button>
                    </p-overlayPanel>
                </div>
            </div>
        </div>
        <p-dialog header="Mis Préstamos" [(visible)]="displayPrestamos" [modal]="true" [style]="{width: '70vw'}" appendTo="body" [baseZIndex]="1100">
          <p-tabView>
            <p-tabPanel>
              <ng-template pTemplate="header">
                Aprobados
                <p-badge *ngIf="nuevosAprobados" [value]="nuevosAprobados" severity="danger" class="ml-2"></p-badge>
              </ng-template>
              <p-table [value]="aprobados" *ngIf="aprobados.length">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Recurso</th>
                    <th>Fecha</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-a let-i="rowIndex">
                  <tr [ngClass]="{ 'highlight-row': highlightAprobados.includes(i) }">
                    <td>{{ recursoNotificacion(a) }}</td>
                    <td>{{ a.fechaCreacion | date:'short' }}</td>
                  </tr>
                </ng-template>
              </p-table>
              <div *ngIf="!aprobados.length" class="p-2 text-center text-gray-600">No hay aprobados</div>
            </p-tabPanel>
            <p-tabPanel>
              <ng-template pTemplate="header">
                Rechazados
                <p-badge *ngIf="nuevosRechazados" [value]="nuevosRechazados" severity="danger" class="ml-2"></p-badge>
              </ng-template>
              <p-table [value]="rechazados" *ngIf="rechazados.length">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Recurso</th>
                    <th>Fecha</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-r let-i="rowIndex">
                  <tr [ngClass]="{ 'highlight-row': highlightRechazados.includes(i) }">
                    <td>{{ recursoNotificacion(r) }}</td>
                    <td>{{ r.fechaCreacion | date:'short' }}</td>
                  </tr>
                </ng-template>
              </p-table>
              <div *ngIf="!rechazados.length" class="p-2 text-center text-gray-600">No hay rechazados</div>
            </p-tabPanel>
            <p-tabPanel>
              <ng-template pTemplate="header">
                Solicitudes
                <p-badge *ngIf="nuevasSolicitudes" [value]="nuevasSolicitudes" severity="danger" class="ml-2"></p-badge>
              </ng-template>
              <p-table [value]="solicitudes" *ngIf="solicitudes.length">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Recurso</th>
                    <th>Fecha</th>
                    <th></th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-s let-i="rowIndex">
                  <tr [ngClass]="{ 'highlight-row': highlightSolicitudes.includes(i) }">
                    <td>{{ recursoSolicitud(s) }}</td>
                    <td>{{ s.fechaPrestamo | date:'short' }}</td>
                    <td>
                      <button pButton icon="pi pi-times" class="p-button-text p-button-danger" (click)="cancelarSolicitud(s, i)" [loading]="cancelandoIndex === i" [disabled]="cancelandoIndex === i"></button>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
              <div *ngIf="!solicitudes.length" class="p-2 text-center text-gray-600">No hay solicitudes</div>
            </p-tabPanel>
            <p-tabPanel>
              <ng-template pTemplate="header">
                Ocurrencias
                <p-badge *ngIf="nuevasOcurrencias" [value]="nuevasOcurrencias" severity="danger" class="ml-2"></p-badge>
              </ng-template>
              <p-table [value]="ocurrencias" *ngIf="ocurrencias.length">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Recurso</th>
                    <th>Fecha</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-o let-i="rowIndex">
                  <tr [ngClass]="{ 'highlight-row': highlightOcurrencias.includes(i) }">
                    <td>{{ o.equipoNombre || o.ejemplar || o.descripcion }}</td>
                    <td>{{ o.fechaOcurrencia | date:'short' }}</td>
                  </tr>
                </ng-template>
              </p-table>
              <div *ngIf="!ocurrencias.length" class="p-2 text-center text-gray-600">No hay ocurrencias</div>
            </p-tabPanel>
          </p-tabView>
        </p-dialog>
        <p-toast></p-toast>
    </div>`,
    providers: [MessageService]
})
export class AppTopbar implements OnInit {
    @ViewChild('op') overlayPanel!: OverlayPanel;
    @ViewChild('profileMenu') profileMenu!: Menu;
    items!: MenuItem[];
    notificaciones: Notificacion[] = [];
    loadingNotifications = false;
    displayPrestamos = false;
    solicitudes: DetallePrestamo[] = [];
    aprobados: Notificacion[] = [];
    rechazados: Notificacion[] = [];
    ocurrencias: OcurrenciaDTO[] = [];
    profileItems: MenuItem[] = [];
    highlightSolicitudes: number[] = [];
    highlightAprobados: number[] = [];
    highlightRechazados: number[] = [];
    highlightOcurrencias: number[] = [];
    userEmail = '';

    get prestamosNuevos(): number {
      return this.notificaciones.filter(n => !n.leida).length;
    }

    unreadCount = 0;
    nuevosAprobados = 0;
    nuevosRechazados = 0;
    nuevasSolicitudes = 0;
    nuevasOcurrencias = 0;
    cancelandoIndex: number | null = null;

    constructor(
      public layoutService: LayoutService,
      private prestamoService: PrestamosService,
      private authService: AuthService,
      private ocurrenciasService: OcurrenciasService,
      private materialService: MaterialBibliograficoService,
      private messageService: MessageService
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


  abrirMisPrestamos() {
    const todas = this.notificaciones
      .sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
    this.aprobados = todas.filter(n => this.estadoNotificacion(n) === 'Aprobado');
    this.rechazados = todas.filter(n => this.estadoNotificacion(n) === 'Rechazado');

    const newAprob = this.aprobados.filter(n => !n.leida).length;
    this.nuevosAprobados = newAprob;
    this.highlightAprobados = newAprob > 0 ? Array.from({ length: newAprob }, (_, i) => i) : [];
    if (newAprob > 0) setTimeout(() => (this.highlightAprobados = []), 2000);

    const newRech = this.rechazados.filter(n => !n.leida).length;
    this.nuevosRechazados = newRech;
    this.highlightRechazados = newRech > 0 ? Array.from({ length: newRech }, (_, i) => i) : [];
    if (newRech > 0) setTimeout(() => (this.highlightRechazados = []), 2000);

    const ids = todas.map(n => n.id);
    this.marcarLeidas(ids);

    const codigo = String(this.authService.getUser()?.sub || '');
    this.ocurrenciasService.api_ocurrencias_usuario(codigo).subscribe({
      next: occs => {
        this.ocurrencias = occs;
        this.nuevasOcurrencias = occs.length;
        this.highlightOcurrencias = occs.length ? Array.from({ length: occs.length }, (_, i) => i) : [];
        if (occs.length) setTimeout(() => (this.highlightOcurrencias = []), 2000);
      },
      error: () => {}
    });

    this.prestamoService.getMisPrestamos().subscribe({
      next: resp => {
        const data: DetallePrestamo[] = resp.data || [];
        this.solicitudes = data.filter(p => (p.estado?.descripcion || '').toLowerCase() === 'reservado');
        this.nuevasSolicitudes = this.solicitudes.length;
        this.highlightSolicitudes = this.solicitudes.length ? Array.from({ length: this.solicitudes.length }, (_, i) => i) : [];
        if (this.highlightSolicitudes.length) setTimeout(() => (this.highlightSolicitudes = []), 2000);
      },
      error: () => {}
    });

    this.displayPrestamos = true;
  }

  private marcarLeidas(ids: number[]) {
    ids.forEach(id => {
      this.prestamoService.marcarLeida(id).subscribe({ next: () => {}, error: () => {} });
      const not = this.notificaciones.find(n => n.id === id);
      if (not) { not.leida = true; }
    });
  }

  cancelarSolicitud(n: DetallePrestamo, index: number) {
    this.cancelandoIndex = index;
    const req$ = n.material
      ? this.materialService.cancelarDetalle(n.id)
      : this.prestamoService.cancelarSolicitud(n.id);
    req$
      .pipe(finalize(() => (this.cancelandoIndex = null)))
      .subscribe({
        next: () => {
          this.solicitudes.splice(index, 1);
          this.nuevasSolicitudes = this.solicitudes.length;
          this.messageService.add({
            severity: 'success',
            summary: 'Solicitud cancelada',
            detail: 'La reserva ha sido cancelada'
          });
        },
        error: () => {}
      });
  }

  /** Devuelve el recurso mencionado en la notificación */
  recursoNotificacion(n: Notificacion): string {
    const match = n.mensaje.match(/(?:de|del)\s+(.+?)\s+fue/i);
    return match ? match[1] : n.mensaje;
  }

  /** Nombre legible del recurso solicitado */
  recursoSolicitud(s: DetallePrestamo): string {
    return s.equipo?.nombreEquipo || s.material?.titulo || s.titulo || '';
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
