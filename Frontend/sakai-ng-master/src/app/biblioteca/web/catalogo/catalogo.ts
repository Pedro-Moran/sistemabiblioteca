import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from '../../../pages/landing/components/topbarwidget.component';
import { PortalTopbar } from '../portal-landing/components/portal-topbar';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { CatalogoLista } from './catalogo-lista';
import { ScrollTopModule } from 'primeng/scrolltop';
import { BannerSeccion } from '../banner-seccion';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-catalogo',
    standalone: true,
    imports: [RouterModule,AppFloatingConfigurator,ScrollTopModule,
         RippleModule, StyleClassModule, ButtonModule, DividerModule,PortalTopbar,BannerSeccion,CatalogoLista],
    template: `
    <app-floating-configurator />
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
            <portal-topbar class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
            <banner-seccion  [titulo]="'Catálogo en Línea'"/>
            <catalogo-lista/>
            <p-scrolltop target="window" [threshold]="50" icon="pi pi-arrow-up"
    styleClass="bg-rose-500 hover:bg-rose-700 text-white rounded-full shadow-md"/>
            </div>
        </div>
            `,
    styles:`
    p-scrolltop {
        bottom: 20px !important;
        right: 20px !important;
    }`
})
export class CatalogoBiblioteca {}
