import { Routes } from '@angular/router';
import { InpresionConstancia } from './impresion';

export default [
    { path: 'impresion', component: InpresionConstancia },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
