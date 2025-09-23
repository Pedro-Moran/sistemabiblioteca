import { Routes } from '@angular/router';
import { Nosotros } from './nosotros';
import { Noticias } from './noticias';
import { HorariosComponent } from './horarios';
import { RecursosElectronicos } from './recursos-electronicos';
import { BibliotecaVirtualComponent } from './biblioteca-virtual';
import { CatalogoEnLineaComponent } from './catalogo-enlinea';

export default [
    { path: 'nosotros', component: Nosotros },
    { path: 'noticias', component: Noticias },
    { path: 'horarios', component: HorariosComponent },
    { path: 'recursos-electronicos', component: RecursosElectronicos },
    { path: 'catalogo-enlinea', component: CatalogoEnLineaComponent },
    { path: 'biblioteca-virtual', component: BibliotecaVirtualComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
