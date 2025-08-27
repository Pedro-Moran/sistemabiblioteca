import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { SplitterModule } from 'primeng/splitter';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { PortalService } from '../../../services/portal.service';
import { InputValidation } from '../../../input-validation';
import { TemplateModule } from '../../../template.module';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { Carousel } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '../../../../pages/service/product.service';
import { PhotoService } from '../../../../pages/service/photo.service';
import { RatingModule } from 'primeng/rating';
import { PortalDetalleEjemplar } from './portal-detalle-ejemplar';
import { PortalDisponibleEjemplar } from './portal-disponible-ejemplar';
import { BibliotecaDTO } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'portal-ejemplares',
    standalone: true,
    imports: [CommonModule,TabsModule,SplitterModule,CarouselModule, ButtonModule,TagModule,RatingModule,TemplateModule,PortalDetalleEjemplar,PortalDisponibleEjemplar],
    template: ` <div id="portal-ejemplares" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
    <div class="grid grid-cols-12 gap-4 justify-center">

    <div class="col-span-12 flex justify-between items-center mt-20 mb-6">
    <div class="font-normal text-4xl text-[var(--text)]">Libros destacados</div>

            <button (click)="catalogo()"
    class="px-4 py-2 text-base font-medium border-2 border-[var(--border)] text-[var(--text)]
        bg-[var(--surface)] rounded-full shadow-md transition-all duration-300
        hover:bg-[var(--card)] hover:shadow-lg">
    Ver Todo →
</button>





        </div>
        <div class="col-span-12 md:col-span-12 lg:col-span-12 p-0 lg:pb-8 mt-6 lg:mt-0">
        <ng-container *ngIf="materiales.length; else noLibros">
        <p-carousel #carousel [value]="materiales" [numVisible]="5" [numScroll]="3" [circular]="true" [responsiveOptions]="responsiveOptions" autoplayInterval="5000" (onPage)="onCarouselPage()">
    <ng-template let-libro pTemplate="item">
        <div class="border border-[var(--border)] rounded m-2 p-4 bg-[var(--surface)] text-[var(--text)]">
            <div class="mb-4">
                <div class="relative mx-auto">

                <img [src]="getImageUrl(libro) || 'assets/logo.png'"
                [alt]="libro.titulo" class="carousel-image rounded-border" />
                    <p-tag [value]="libro.estadoId" class="absolute" styleClass="dark:!bg-surface-900" [ngStyle]="{ 'left.px': 5, 'top.px': 5 }" />
                </div>
            </div>
            <div class="mb-4 font-medium" class="hover:text-primary focus:text-primary transition-colors">{{ libro.titulo }}</div>
            <div class="mb-4 font-medium" class=" transition-colors"><span>Por: {{ libro.autorPersonal || libro.autorInstitucional || '—' }}</span></div>

            <p-rating  [readonly]="true" class=""></p-rating>
            <div class="flex justify-between items-center">
                <div class="mt-0 font-semibold text-xl"></div>
                <span>

                <p-button outlined icon="pi pi-search-plus" styleClass="ml-2" pTooltip="Más información"
                tooltipPosition="bottom" (click)="masInformacion(libro, $event)"/>
                <p-button icon="pi pi-map-marker" styleClass="ml-2" pTooltip="Disponibilidad" tooltipPosition="bottom" (click)="disponible(libro, $event)"/>
                    <!--<p-button icon="pi pi-calendar" styleClass="ml-2" pTooltip="Reservar"
                    tooltipPosition="bottom" (click)="reservar()"/>-->
                </span>
            </div>
        </div>
    </ng-template>
</p-carousel>
        </ng-container>
        <ng-template #noLibros>
            <p class="text-center text-[var(--muted)]">No hay registros</p>
        </ng-template>
        </div>

    </div>
</div>

<portal-detalle-ejemplar [objeto]="objeto" [displayDialog]="displayDialog"/>
<portal-disponible-ejemplar [objeto]="objeto" [displayDialog]="displayDisponibleDialog"/>
`,
styles:`.carousel-image {
    width: 150px; /* Ajusta el ancho según prefieras */
    height: 200px;
    object-fit: cover;
    margin: 0 auto;
  }`,
                    providers: [MessageService, ConfirmationService,ProductService,PhotoService]
})
export class PortalEjemplares implements OnInit{
    data: any[]= [];
    products!: Product[];
    responsiveOptions: any[] | undefined;
    images!: any[];
    displayDialog: boolean = false;
    displayDisponibleDialog: boolean = false;
    objeto:any;
    materiales: BibliotecaDTO[] = [];
    @ViewChild('carousel') carousel?: Carousel;
    galleriaResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    carouselResponsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    constructor(private portalService: PortalService,private fb: FormBuilder,
        private productService: ProductService,
        private materialBibliograficoService: MaterialBibliograficoService,
                private photoService: PhotoService,private cd: ChangeDetectorRef,
              private router: Router,private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }


              ngOnInit() {
                this.materialBibliograficoService
                      .listarDisponibles()
                      .subscribe(list => {
                        this.materiales = Array.isArray(list) ? list : [];
                        // forzar que el carousel refresque
                        this.cd.detectChanges();
                      });
                this.responsiveOptions = [
                    {
                        breakpoint: '1400px',
                        numVisible: 2,
                        numScroll: 1
                    },
                    {
                        breakpoint: '1199px',
                        numVisible: 3,
                        numScroll: 1
                    },
                    {
                        breakpoint: '767px',
                        numVisible: 2,
                        numScroll: 1
                    },
                    {
                        breakpoint: '575px',
                        numVisible: 1,
                        numScroll: 1
                    }
                ]
                this.photoService.getImages().then((images) => {
                    this.images = images;
                });
            }

    /** Devuelve la URL de la imagen almacenada si existe */
    getImageUrl(obj: BibliotecaDTO): string | undefined {
        if ((obj as any).material?.url) {
            const p = (obj as any).material.url as string;
            return p.startsWith('http') ? p : `${environment.filesUrl}${p}`;
        }
        if (obj.rutaImagen) {
            const base = obj.rutaImagen.startsWith('http')
                ? obj.rutaImagen
                : `${environment.filesUrl}${obj.rutaImagen.startsWith('/') ? '' : '/'}${obj.rutaImagen}`;

            if (obj.nombreImagen) {
                if (base.endsWith(obj.nombreImagen)) {
                    return base;
                }
                const sep = base.endsWith('/') ? '' : '/';
                return base + sep + obj.nombreImagen;
            }
            return base;
        }
        return undefined;
    }

    /** Devuelve la descripción del estado de la cabecera */
    estado(b: BibliotecaDTO): string {
        if (b.estadoDescripcion) {
            return b.estadoDescripcion;
        }
        switch (b.estadoId) {
            case 2:
                return 'DISPONIBLE';
            case 3:
                return 'RESERVADO';
            case 1:
                return 'CREADO';
            case 4:
                return 'MANTENIMIENTO';
            case 5:
                return 'DESCARTE';
            default:
                return '';
        }
    }

    getSeverity(status: string) {
        switch (status) {
            case 'DISPONIBLE':
                return 'success';
            case 'MANTENIMIENTO':
                return 'warn';
            case 'PRESTADO':
                return 'danger';
            default:
                return 'success';
        }
    }
    catalogo() {
        this.router.navigate(['/catalogo']);
      }
      reservar() {
        this.router.navigate(['/reservar']);
      }
      masInformacion(libro: BibliotecaDTO, event?: Event){
        if (event) {
            (event.target as HTMLElement).blur();
        }
        this.objeto = libro;
        this.displayDialog = false;
        this.cd.detectChanges();
        setTimeout(() => {
            this.displayDialog = true;
            this.cd.detectChanges(); // Vuelve a detectar cambios para mostrar el diálogo
        }, 50);
      }
      disponible(libro: BibliotecaDTO, event?: Event){
        if (event) {
            (event.target as HTMLElement).blur();
        }
        this.objeto = libro;
        this.displayDisponibleDialog = false;
        this.cd.detectChanges();
        setTimeout(() => {
            this.displayDisponibleDialog = true;
            this.cd.detectChanges(); // Vuelve a detectar cambios para mostrar el diálogo
        }, 50);
      }

        onCarouselPage(): void {
          const active = document.activeElement as HTMLElement | null;
          const carouselEl = this.carousel?.el?.nativeElement as HTMLElement | undefined;
          if (active && carouselEl && carouselEl.contains(active)) {
            active.blur();
          }
        }
}
