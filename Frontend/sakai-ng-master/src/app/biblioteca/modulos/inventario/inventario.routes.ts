import { Routes } from '@angular/router';
import { InventarioMaterial } from './inventario';

export default [
    { path: '', component: InventarioMaterial },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
