import { Routes } from '@angular/router';
import { SedesComponent } from '../modulos/mantenimientos/sedes/sedes';
import { ProgramasComponent } from '../modulos/mantenimientos/programas/programas';
import { EspecialidadesComponent } from '../modulos/mantenimientos/especialidades/especialidades';
import { TipoRecursoComponent } from './tipo-recurso/tipo-recurso';
import { AutorComponent } from './autor/autor';
import { EditorialComponent } from './editorial/editorial';
import { MotivoAccionComponent } from '../modulos/mantenimientos/motivo-accion/motivo-accion';
import { ProgramaAccionComponent } from '../modulos/mantenimientos/programa-accion/programa-accion';

export default [
    { path: 'sedes', component: SedesComponent },
    { path: 'programas', component: ProgramasComponent },
    { path: 'especialidades', component: EspecialidadesComponent },
    { path: 'motivos-accion', component: MotivoAccionComponent, data: { roles: ['ROLE_MOTIVO_ACCION'] } },
    { path: 'programas-accion', component: ProgramaAccionComponent, data: { roles: ['ROLE_PROGRAMA_ACCION'] } },
    { path: 'tipo-recurso', component: TipoRecursoComponent },
    { path: 'autor', component: AutorComponent },
    { path: 'editorial', component: EditorialComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
