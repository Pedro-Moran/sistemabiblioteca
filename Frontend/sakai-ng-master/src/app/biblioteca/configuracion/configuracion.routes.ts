import { Routes } from '@angular/router';
import { SedeComponent } from './sede/sede';
import { TipoRecursoComponent } from './tipo-recurso/tipo-recurso';
import { AutorComponent } from './autor/autor';
import { EditorialComponent } from './editorial/editorial';

export default [
    { path: 'sedes', component: SedeComponent },
    { path: 'tipo-recurso', component: TipoRecursoComponent },
    { path: 'autor', component: AutorComponent },
    { path: 'editorial', component: EditorialComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
