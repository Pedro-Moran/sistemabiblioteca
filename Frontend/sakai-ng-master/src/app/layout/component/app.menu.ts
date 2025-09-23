import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../biblioteca/services/auth.service';

export interface AppMenuItem extends MenuItem {
    role?: string[]; // Agregar roles opcionales
}

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator && hasAccess(item)" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})



export class AppMenu {
    model: MenuItem[] = [];

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/main'] }]
            },
            {
                label: 'Mantenimientos',
                icon: 'pi pi-fw pi-briefcase',
                role: ['ADMIN', 'EJECUTIVO'],
                items: [

                    {
                        label: 'Material bibliográfico',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/main/mantenimiento/material-bibliografico'],role: ['ROLE_MATERIAL_BIBLIOGRAFICO']
                    },
                    {
                        label: 'Sala de equipos de cómputo',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/main/mantenimiento/biblioteca-virtual'],role: ['ROLE_SALA_EQUIPOS_COMPUTO']
                    },
                    {
                        label: 'Aceptaciones MB',
                        icon: 'pi pi-fw pi-check',
                        routerLink: ['/main/mantenimiento/aceptaciones'],role: ['ROLE_ACEPTACIONES_MB']
                    },
                    {
                        label: 'Aceptaciones Equipos',
                        icon: 'pi pi-fw pi-check',
                        routerLink: ['/main/mantenimiento/aceptaciones-equipos'],role: ['ROLE_ACEPTACIONES_EQUIPOS']
                    },
                ]
            },
            {
                label: 'Prestamos',
                icon: 'pi pi-fw pi-briefcase',
                role: ['ADMIN', 'EJECUTIVO'],
                items: [

                    {
                        label: 'Material bibliográfico',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/main/prestamos/material-bibliografico'],role: ['ROLE_PRESTAMOS_MATERIAL_BIBLIOGRAFICO']
                    },
                    {
                        label: 'Sala de equipos de cómputo',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/main/prestamos/biblioteca-virtual'],role: ['ROLE_PRESTAMOS_BIBLIOTECA_VIRTUAL']
                    }
                ]
            },
            {
                label: 'Devoluciones',
                icon: 'pi pi-fw pi-briefcase',
                role: ['ADMIN', 'EJECUTIVO'],
                items: [

                    {
                        label: 'Material bibliográfico',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/main/devoluciones/material-bibliografico'],role: ['ROLE_DEVOLUCIONES_MATERIAL_BIBLIOGRAFICO']
                    },
                    {
                        label: 'Sala de equipos de cómputo',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/main/devoluciones/biblioteca-virtual'],role: ['ROLE_DEVOLUCIONES_BIBLIOTECA_VIRTUAL']
                    }
                ]
            },

            {
                label: 'Reportes',
                icon: 'pi pi-fw pi-briefcase',
                role: ['ADMIN', 'EJECUTIVO'],
                items: [

                    {
                        label: 'Préstamos de materiales bibliográficos',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/prestamo-mat-bibliografico'],role: ['ROLE_REPORTE_PRESTAMO_MATERIAL_BIBLIOGRAFICO']
                    },
                    {
                        label: 'Préstamos de equipos de cómputo',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/prestamo-equipo-computo'],role: ['ROLE_REPORTE_PRESTAMO_EQUIPO_COMPUTO']
                    },
                    {
                        label: 'Préstamos por escuela profesional',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/prestamo-escuela-profesional'],role: ['ROLE_REPORTE_PRESTAMO_ESCUELA_PROFESIONAL']
                    },
                    {
                        label: 'Ejemplar más prestado',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/ejemplar-mas-prestado'],role: ['ROLE_REPORTE_EJEMPLAR_MAS_PRESTADO']
                    },
                    {
                        label: 'Ejemplar no prestados',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/ejemplar-no-prestados'],role: ['ROLE_REPORTE_EJEMPLAR_NO_PRESTADOS']
                    },
                    {
                        label: 'Estudiantes atendidos material bibliográfico',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/estudiantes-atendidos'],role: ['ROLE_REPORTE_ESTUDIANTES_ATENDIDOS']
                    },
                    {
                        label: 'Uso de tiempo de Sala de equipos de cómputo',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/usotiempo-biblioteca'],role: ['ROLE_REPORTE_USOTIEMPO_BIBLIOTECA_VIRTUAL']
                    },
                    {
                        label: 'Usuarios atendidos Sala de equipos de cómputo',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/usuarios-atendidos-biblioteca'],role: ['ROLE_REPORTE_USUARIOS_ATENDIDOS_BIBLIOTECA_VIRTUAL']
                    },
                    {
                        label: 'Material bibliográfico detallado',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/material-bibliografico-detallado'],role: ['ROLE_REPORTE_MATERIAL_BIBLIOGRAFICO_DETALLADO']
                    },
                    {
                        label: 'Material bibliográfico resumen',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/material-bibliografico-resumen'],role: ['ROLE_REPORTE_MATERIAL_BIBLIOGRAFICO_RESUMEN']
                    },
                    {
                        label: 'Inventario material bibliografico',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/inventario-material-bibliografico'],role: ['ROLE_REPORTE_INVENTARIO_MATERIAL_BIBLIOGRAFICO']
                    },
                    {
                        label: 'Visitantes biblioteca virtual - Base de datos',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/visitantes-biblioteca-virtual'],role: ['ROLE_REPORTE_VISITANTES_BIBLIOTECA_VIRTUAL']
                    },
                    {
                        label: 'Visitas fisicas de usuarios',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/main/reportes/intranet'],role: ['ROLE_REPORTE_INTRANET']
                    }
                ]
            },
            {
                label: 'Inventario',
                icon: 'pi pi-fw pi-box',
                role: ['ADMIN', 'EJECUTIVO'],
                items: [
                    {
                        label: 'Verificación física',
                        icon: 'pi pi-fw pi-barcode',
                        routerLink: ['/main/inventario'],
                        role: ['ROLE_INVENTARIO_VERIFICACION']
                    }
                ]
            },
            {
                label: 'Biblioteca',
                icon: 'pi pi-fw pi-briefcase',
                role: ['ADMIN', 'EJECUTIVO'],
                items: [

                    {
                        label: 'Ocurrencias',
                        icon: 'pi pi-fw pi-thumbtack',
                        routerLink: ['/main/biblioteca/ocurrencias'],role: ['ROLE_BIBLIOTECA_OCURRENCIAS']
                    },

                    {
                        label: 'Autorizacion - Regularización',
                        icon: 'pi pi-fw pi-thumbtack',
                        routerLink: ['/main/biblioteca/autorizacion-regularizacion'],role: ['ROLE_BIBLIOTECA_AUTORIZACION_REGULARIZACION']
                    },
                    {
                        label: 'Visitas',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/main/biblioteca/visitas'],role: ['ROLE_BIBLIOTECA_VISITAS']
                    }
                ]
            },
            {
                label: 'Laboratorio de Computo',
                icon: 'pi pi-fw pi-briefcase',
                role: ['ADMIN', 'EJECUTIVO'],
                items: [

                    {
                        label: 'Ocurrencias',
                        icon: 'pi pi-fw pi-thumbtack',
                        routerLink: ['/main/laboratorio-computo/ocurrencias'],role: ['ROLE_LABORATORIO_COMPUTO_OCURRENCIAS']
                    }
                ]
            },
            {
                label: 'Constancias',
                icon: 'pi pi-fw pi-briefcase',
                role: ['ADMIN', 'EJECUTIVO'],
                items: [

                    {
                        label: 'Impresión',
                        icon: 'pi pi-fw pi-clipboard',
                        routerLink: ['/main/constancias/impresion'],role: ['ROLE_CONSTANCIAS_IMPRESION']
                    }
                ]
            },
            {
                label: 'Portal',
                icon: 'pi pi-fw pi-briefcase',
                role: ['ADMIN','USUARIO', 'EXTERNO', 'EJECUTIVO'],
                items: [
                    {
                        label: 'Catálogo en línea',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/main/portal/catalogo-enlinea'],role: ['ROLE_PORTAL_CATALOGO_ENLINEA']
                    },
                    {
                        label: 'Equipos de computo',
                        icon: 'pi pi-fw pi-desktop',
                        routerLink: ['/main/portal/biblioteca-virtual'],role: ['ROLE_PORTAL_BIBLIOTECA_VIRTUAL']
                    }
                ]
            },
            {
                label: 'Portal web',
                icon: 'pi pi-fw pi-briefcase',
                role: ['ADMIN', 'EJECUTIVO'],
                items: [
                    {
                        label: 'Nosotros',
                        icon: 'pi pi-fw pi-sitemap',
                        routerLink: ['/main/portal/nosotros'],role: ['ROLE_PORTAL_NOSOTROS']
                    },
                    {
                        label: 'Noticias',
                        icon: 'pi pi-fw pi-send',
                        routerLink: ['/main/portal/noticias'],role: ['ROLE_PORTAL_NOTICIAS']
                    },
                    {
                        label: 'Horarios',
                        icon: 'pi pi-fw pi-calendar-clock',
                        routerLink: ['/main/portal/horarios'],role: ['ROLE_PORTAL_HORARIOS']
                    },
                    {
                        label: 'Recursos electronicos',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/main/portal/recursos-electronicos'],role: ['ROLE_PORTAL_RECURSOS_ELECTRONICOS']
                    }
                ]
            },
            {
                label: 'Usuarios',
                icon: 'pi pi-fw pi-briefcase',
                role: ['ADMIN'],
                items: [
                    {
                        label: 'Lista',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/main/usuarios/usuario-lista'],role: ['ROLE_USUARIOS']
                    },
                    {
                        label: 'Roles',
                        icon: 'pi pi-fw pi-key',
                        routerLink: ['/main/usuarios/roles-lista'],role: ['ROLE_ROLES']
                    }
                ]
            },
            {
                label: 'Configuración',
                icon: 'pi pi-fw pi-briefcase',
                role: ['ADMIN', 'EJECUTIVO'],
                items: [
                    {
                        label: 'Sedes',
                        icon: 'pi pi-fw pi-tags',
                        routerLink: ['/main/configuracion/sedes'],role: ['ROLE_CONF_SEDES']
                    },
                    {
                        label: 'Programas',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/main/configuracion/programas'],role: ['ROLE_CONF_PROGRAMAS']
                    },
                    {
                        label: 'Especialidades',
                        icon: 'pi pi-fw pi-star',
                        routerLink: ['/main/configuracion/especialidades'],role: ['ROLE_CONF_ESPECIALIDADES']
                    },
                    {
                        label: 'Motivos de acción',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/main/configuracion/motivos-accion'],role: ['ROLE_MOTIVO_ACCION']
                    },
                    {
                        label: 'Programas de acción',
                        icon: 'pi pi-fw pi-flag',
                        routerLink: ['/main/configuracion/programas-accion'],role: ['ROLE_PROGRAMA_ACCION']
                    }
                ]
            },
            /*{
                label: 'UI Components',
                items: [
                    { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/main/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/main/uikit/input'] },
                    { label: 'Button', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/main/uikit/button'] },
                    { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/main/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/main/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/main/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/main/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/main/uikit/overlay'] },
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/main/uikit/media'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/main/uikit/menu'] },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/main/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/main/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/main/uikit/charts'] },
                    { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/main/uikit/timeline'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/main/uikit/misc'] }
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/main/pages'],
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            }
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/main/pages/crud']
                    },
                    {
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/main/pages/notfound']
                    },
                    {
                        label: 'Empty',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/main/pages/empty']
                    }
                ]
            },
            {
                label: 'Hierarchy',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-book',
                        routerLink: ['/main/documentation']
                    },
                    {
                        label: 'View Source',
                        icon: 'pi pi-fw pi-github',
                        url: 'https://github.com/primefaces/sakai-ng',
                        target: '_blank'
                    }
                ]
            }*/
        ];
    }

    hasAccess(item: AppMenuItem): boolean {
        const userRoles = this.authService.getRoles();

        // Si el ítem posee hijos, se muestra solo cuando alguno de ellos es accesible
        if (item.items && item.items.length > 0) {
            return item.items.some(child => this.hasAccess(child as AppMenuItem));
        }

        // Los elementos sin restricción de rol siempre están visibles
        if (!item.role || item.role.length === 0) {
            return true;
        }

        // Verificamos intersección entre los roles requeridos y los módulos autorizados
        return item.role.some(role => userRoles.includes(role));
    }

}
