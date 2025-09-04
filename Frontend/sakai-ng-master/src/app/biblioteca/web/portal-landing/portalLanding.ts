+1
-3

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ScrollTopModule } from 'primeng/scrolltop';
import { FeaturesWidget } from '../../../pages/landing/components/featureswidget';
import { FooterWidget } from '../../../pages/landing/components/footerwidget';
import { HighlightsWidget } from '../../../pages/landing/components/highlightswidget';
import { Portal } from './components/portal';
import { PortalNosotros } from './components/portal-nosotros';
import { PortalHorarios } from './components/portal-horarios';
import { PricingWidget } from '../../../pages/landing/components/pricingwidget';
import { TopbarWidget } from '../../../pages/landing/components/topbarwidget.component';
import { PortalEjemplares } from './components/portal-ejemplares';
import { PortalNoticias } from './components/portal-noticias';
import { PortalTopbar } from './components/portal-topbar';
import { PortalContactanos } from './components/portal-contactanos';
import { PortalFooter } from './components/portal-footer';
import { PortalRecursosElectronicos } from './components/portal-recursos-electronicos';


@Component({
    selector: 'app-portal-landing',
    standalone: true,
        imports: [ScrollTopModule,RouterModule,PortalFooter,PortalContactanos,PortalTopbar,PortalEjemplares,PortalNoticias, RippleModule, StyleClassModule, ButtonModule, DividerModule, PortalNosotros,PortalHorarios,PortalRecursosElectronicos, Portal,ScrollTopModule],
    template: `
        <div class="bg-app min-h-screen">
            <div id="home" class="landing-wrapper">
                <portal-topbar />
                <portal />
                <portal-ejemplares />
                <portal-nosotros />
                <portal-horarios />
                <portal-recursos-electronicos />
                <portal-noticias />
                <portal-contactanos />
                <portal-footer />
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
export class PortalLanding {}
