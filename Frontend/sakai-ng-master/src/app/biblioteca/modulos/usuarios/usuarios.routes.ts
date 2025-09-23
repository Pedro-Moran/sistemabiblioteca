import { Routes } from '@angular/router';
import { RolesLista } from './roles-lista';
import { UsuarioLista } from './usuario-lista';

export default [
    { path: 'usuario-lista', component: UsuarioLista },
    { path: 'roles-lista', component: RolesLista },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
