import { Routes } from '@angular/router';
<<<<<<< HEAD
import { SedeComponent } from './sede/sede';
import { TipoRecursoComponent } from './tipo-recurso/tipo-recurso';
import { AutorComponent } from './autor/autor';
import { EditorialComponent } from './editorial/editorial';

export default [
    { path: 'sedes', component: SedeComponent },
    { path: 'tipo-recurso', component: TipoRecursoComponent },
    { path: 'autor', component: AutorComponent },
    { path: 'editorial', component: EditorialComponent },
=======
import { Email } from './email/email';
import { SedeComponent } from './sede/sede';
import { TipoDocumento } from './tipo-documento/tipo-documento';
import { ProgramaAcademico } from './programa-academico/programa-academico';
import { EscuelaProfesional } from './escuela-profesional/escuela-profesional';
import { TipoRecursoComponent } from './tipo-recurso/tipo-recurso';
import { AutorComponent } from './autor/autor';
import { EditorialComponent } from './editorial/editorial';
import { CategoriaRecurso } from './categoria-recurso/categoria-recurso';

export default [
    { path: 'email', component: Email },
    { path: 'sedes', component: SedeComponent },
    { path: 'escuela-profesional', component: EscuelaProfesional },
    { path: 'programa-academico', component: ProgramaAcademico },
    { path: 'tipo-documento', component: TipoDocumento },
    { path: 'tipo-recurso', component: TipoRecursoComponent },
    { path: 'autor', component: AutorComponent },
    { path: 'editorial', component: EditorialComponent },
    { path: 'categoria-recurso', component: CategoriaRecurso },
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
    { path: '**', redirectTo: '/notfound' }
] as Routes;
