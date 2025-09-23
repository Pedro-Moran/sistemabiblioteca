import { Routes } from '@angular/router';
import { PrestamoMaterialBibliografico } from './material-bibliografico/material-bibliografico';
import { PrestamoBibliotecaVirtual } from './biblioteca-virtual/biblioteca-virtual';
export default [
    { path: 'material-bibliografico', component: PrestamoMaterialBibliografico },
    { path: 'biblioteca-virtual', component: PrestamoBibliotecaVirtual },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
