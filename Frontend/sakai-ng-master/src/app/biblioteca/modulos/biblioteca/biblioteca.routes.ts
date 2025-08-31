import { Routes } from '@angular/router';
import { OcurrenciasBiblioteca } from './ocurrencias-biblioteca';
import { AutorizacionRegularizacion } from './autorizacion-regularizacion';

export default [
    { path: 'ocurrencias', component: OcurrenciasBiblioteca },
    { path: 'autorizacion-regularizacion', component: AutorizacionRegularizacion },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
