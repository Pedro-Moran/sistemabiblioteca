import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { SplitterModule } from 'primeng/splitter';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '../../../../pages/service/product.service';
import { PhotoService } from '../../../../pages/service/photo.service';
import { DividerModule } from 'primeng/divider';
import { PortalService } from '../../../services/portal.service';
import { PortalNoticia } from '../../../interfaces/portalNoticias';
import { environment } from '../../../../../environments/environment';
@Component({
    selector: 'portal-noticias',
    standalone: true,
    imports: [CommonModule, TabsModule, SplitterModule, CarouselModule, ButtonModule, TagModule, DividerModule],
    template: `
        <div id="portal-noticias" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
            <div class="grid grid-cols-12 gap-4 justify-center">
                <div class="col-span-12 flex justify-between items-center mt-20 mb-6">
                    <div class="font-normal mb-2 text-4xl text-[var(--text)]">Noticias y eventos</div>

                    <button
                        (click)="noticias()"
                        class="px-4 py-2 text-base font-medium border-2 border-[var(--border)] text-[var(--text)]
        bg-[var(--surface)] rounded-full shadow-md transition-all duration-300
        hover:bg-[var(--card)] hover:shadow-lg"
                    >
                        Ver Todo →
                    </button>
                </div>
                <div class="col-span-12 md:col-span-12 lg:col-span-12 p-0 lg:pb-8 mt-6 lg:mt-0">
                    <section class="">
                        <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0 auto-rows-fr">
                            <div class="col-span-12 lg:col-span-4 p-0 md:p-4" *ngFor="let item of data; let i = index">
                                <div class="p-4 flex flex-col h-full border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                                    <a [href]="item.link || item.enlace" target="_blank">
                                        <img class="w-full h-56 object-cover" [src]="item.urlPortada || item.imagenUrl || item.imagen" [alt]="item.titular" />
                                    </a>

                                    <p-divider class="w-full bg-surface-200"></p-divider>
                                    <div class="p-6 flex flex-col h-full">
                                        <i class="pi pi-fw pi-calendar !text-2xl text-primary"></i> {{ item.fecha || item.fechacreacion | date: 'yyyy-MM-dd HH:mm:ss' }}
                                        <h3 class="text-xl font-semibold text-gray-900 break-words clamp-2">
                                            <a [href]="item.link || item.enlace" target="_blank" class="hover:text-primary focus:text-primary transition-colors break-words clamp-2">
                                                {{ item.titular }}
                                            </a>
                                        </h3>
                                        <p class="text-gray-500 mt-2 break-words clamp-3">{{ item.descripcion }}</p>
                                        <p class="text-gray-500 mt-2 break-words">Por:{{ item.autor }}</p>
                                        <a [href]="item.link || item.enlace" target="_blank" class="text-primary mt-4 inline-flex items-center mt-auto">Leer m&aacute;s <span class="ml-2">→</span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
        .clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        .clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        `
    ],
    providers: [MessageService, ConfirmationService, ProductService, PhotoService]
})
export class PortalNoticias implements OnInit {
    loading: boolean = true;
    modulo: string = 'catalogo';
    data: PortalNoticia[] = [];

    constructor(
        private router: Router,
        private portalService: PortalService
    ) {}

    async ngOnInit() {
        await this.listar();
    }

    noticias() {
        this.router.navigate(['/noticias']);
    }
    listar() {
        this.portalService.listar(undefined, undefined).subscribe(
            (r) => {
                this.data = r.data
                    .filter((n) => this.esDisponible(n))
                    .map(
                        (n) =>
                            new PortalNoticia({
                                ...n,
                                titulo: n.titular ?? n.titulo,
                                detalle: n.descripcion ?? n.detalle,
                                anunciante: n.autor ?? n.anunciante,
                                link: n.enlace ?? n.link,
                                fecha: n.fechacreacion ?? n.fecha,
                                urlPortada: this.buildImageUrl(n)
                            })
                    );
                this.loading = false;
            },
            (_) => (this.loading = false)
        );
    }
    private esDisponible(n: any): boolean {
        const id = Number(n.estadoId ?? n.estado ?? n.idestado ?? n.idEstado ?? n.estado_id);
        const desc = (n.estadoDescripcion ?? n.estado ?? '').toString().trim().toUpperCase();
        return id === 2 || desc === 'DISPONIBLE';
    }

    private buildImageUrl(n: PortalNoticia): string {
        const raw = n.urlPortada || (n as any).imagenUrl || n.imagen;
        if (!raw) {
            return 'assets/logo.png';
        }
        return raw.startsWith('http') ? raw : `${environment.filesUrl}/uploads/noticias/${raw}`;
    }
}
