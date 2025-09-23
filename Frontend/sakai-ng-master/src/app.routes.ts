import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { CatalogoBiblioteca } from './app/biblioteca/web/catalogo/catalogo';
import { Notfound } from './app/pages/notfound/notfound';
import { PortalLanding } from './app/biblioteca/web/portal-landing/portalLanding';
import { PortalTodoNoticias } from './app/biblioteca/web/noticias/portal-todo-noticias';
import { PortalRegistrate } from './app/biblioteca/web/registrate/registrate';
import { PortalReserva } from './app/biblioteca/web/catalogo/reserva';
import { Dashboard } from './app/biblioteca/modulos/dashboard/dashboard';
import { Login } from './app/pages/auth/login';
import { RoleGuard } from './app/guards/role.guard';

export const appRoutes: Routes = [
    {
        path: 'main',
        component: AppLayout,
        canActivate: [RoleGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'mantenimiento', loadChildren: () => import('./app/biblioteca/modulos/mantenimientos/mantenimientos.routes')},
            { path: 'prestamos', loadChildren: () => import('./app/biblioteca/modulos/prestamos/prestamos.routes')},
            { path: 'devoluciones', loadChildren: () => import('./app/biblioteca/modulos/devoluciones/devoluciones.routes')},
            { path: 'reportes', loadChildren: () => import('./app/biblioteca/modulos/reportes/reportes.routes')},
            { path: 'biblioteca', loadChildren: () => import('./app/biblioteca/modulos/biblioteca/biblioteca.routes')},
            { path: 'laboratorio', loadChildren: () => import('./app/biblioteca/modulos/laboratorio/laboratorio.routes')},
            { path: 'laboratorio-computo', loadChildren: () => import('./app/biblioteca/modulos/laboratorio-computo/laboratorio-computo.routes')},
            { path: 'constancias', loadChildren: () => import('./app/biblioteca/modulos/constancias/constancias.routes')},
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'configuracion', loadChildren: () => import('./app/biblioteca/configuracion/configuracion.routes')},
            { path: 'usuarios', loadChildren: () => import('./app/biblioteca/modulos/usuarios/usuarios.routes')},
            { path: 'recursos', loadChildren: () => import('./app/biblioteca/modulos/recursos/recursos.routes')},
            { path: 'inventario', loadChildren: () => import('./app/biblioteca/modulos/inventario/inventario.routes')},
            { path: 'portal', loadChildren: () => import('./app/biblioteca/modulos/portal/portal.routes')},
        ]
    },
    { path: '', component: PortalLanding },
    { path: 'landing', component: Landing },
    { path: 'catalogo', component: CatalogoBiblioteca },
    { path: 'noticias', component: PortalTodoNoticias },
    { path: 'reservar', component: PortalReserva },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: 'registrate', component: PortalRegistrate },
    { path: 'login', component: Login },
    { path: '**', redirectTo: '/notfound' }
];
