import { Routes } from '@angular/router';
import { OcurrenciasBiblioteca } from './ocurrencias-biblioteca';
import { AutorizacionRegularizacion } from './autorizacion-regularizacion';
import { VisitasBiblioteca } from './visitas-biblioteca';

export default [
    { path: 'ocurrencias', component: OcurrenciasBiblioteca },
    { path: 'autorizacion-regularizacion', component: AutorizacionRegularizacion },
    { path: 'visitas', component: VisitasBiblioteca },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
