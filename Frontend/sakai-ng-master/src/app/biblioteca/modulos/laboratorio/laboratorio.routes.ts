import { Routes } from '@angular/router';
import { OcurrenciasLaboratorio } from './ocurrencias';

export default [
    { path: 'ocurrencias', component: OcurrenciasLaboratorio },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
