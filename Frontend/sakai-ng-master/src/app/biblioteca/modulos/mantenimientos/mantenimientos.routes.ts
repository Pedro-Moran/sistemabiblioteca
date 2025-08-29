import { Routes } from '@angular/router';
import { MaterialBibliografico } from './material-bibliografico/material-bibliografico';
import { BibliotecaVirtual } from './biblioteca-virtual/biblioteca-vritual';
import { Aceptaciones } from './aceptaciones/aceptaciones';
import { AceptacionesEquipos } from './aceptaciones/aceptaciones-equipos';
import { RoleGuard } from '../../../guards/role.guard';

export default [
    {
        path: 'material-bibliografico',
        component: MaterialBibliografico,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_MATERIAL_BIBLIOGRAFICO'] }
    },
    {
        path: 'biblioteca-virtual',
        component: BibliotecaVirtual,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_SALA_EQUIPOS_COMPUTO'] }
    },
    {
        path: 'aceptaciones',
        component: Aceptaciones,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ACEPTACIONES_MB'] }
    },
    {
        path: 'aceptaciones-equipos',
        component: AceptacionesEquipos,
        canActivate: [RoleGuard],
        data: { roles: ['ROLE_ACEPTACIONES_EQUIPOS'] }
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
