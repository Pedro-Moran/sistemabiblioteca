import { Routes } from '@angular/router';
import { MaterialBibliografico } from './material-bibliografico/material-bibliografico';
import { BibliotecaVirtual } from './biblioteca-virtual/biblioteca-vritual';
import { Aceptaciones } from './aceptaciones/aceptaciones';
import { AceptacionesEquipos } from './aceptaciones/aceptaciones-equipos';

export default [
    { path: 'material-bibliografico', component: MaterialBibliografico },
    { path: 'biblioteca-virtual', component: BibliotecaVirtual },
    { path: 'aceptaciones', component: Aceptaciones },
    { path: 'aceptaciones-equipos', component: AceptacionesEquipos },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
