import { Routes } from '@angular/router';
import { ReservasComponent } from './reservas';
import { OcurrenciasPrestamosComponent } from './ocurrencias-prestamos';
import { Reporte } from './reporte';
import { RecursosComponent } from './recursos';
import { PrestamosComponent } from './prestamos';
import { OcurrenciasReservasComponent } from './ocurrencias-reservas';
import { MaterialBibliografico } from '../mantenimientos/material-bibliografico/material-bibliografico';

export default [
    { path: 'reservas', component: ReservasComponent },
    { path: 'ocurrencias-reservas', component: OcurrenciasReservasComponent },
    { path: 'material-bibliografico', component: MaterialBibliografico },
    { path: 'gestion-recursos', component: RecursosComponent },
    { path: 'reporte', component: Reporte },
    { path: 'prestamos', component: PrestamosComponent },
    { path: 'ocurrencias-prestamos', component: OcurrenciasPrestamosComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
