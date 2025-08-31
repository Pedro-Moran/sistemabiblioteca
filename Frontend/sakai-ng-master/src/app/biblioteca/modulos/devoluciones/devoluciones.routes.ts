import { Routes } from '@angular/router';
import { DevolucionMaterialBibliografico } from './material-bibliografico/material-bibliografico';
import { DevolucionBibliotecaVirtual } from './biblioteca-virtual/biblioteca-virtual';
export default [
    { path: 'material-bibliografico', component: DevolucionMaterialBibliografico },
    { path: 'biblioteca-virtual', component: DevolucionBibliotecaVirtual },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
