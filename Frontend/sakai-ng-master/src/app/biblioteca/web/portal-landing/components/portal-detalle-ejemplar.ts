import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TemplateModule } from '../../../template.module';
import { BibliotecaDTO, DetalleBibliotecaDTO } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { environment } from '../../../../../environments/environment';
@Component({
    selector: 'portal-detalle-ejemplar',
    standalone: true,
    imports: [ButtonModule, RippleModule, TemplateModule],
    template: `
        <p-dialog [(visible)]="displayDialog" [modal]="true" [closable]="false" [style]="{ width: '80vw' }">
            <ng-template pTemplate="header">
                <div class="flex justify-between items-center w-full">
                    <span class="text-lg font-semibold">DATOS DE MATERIAL BIBLIOGRÁFICO</span>
                    <button pButton icon="pi pi-times" class="p-button-rounded p-button-text" (click)="displayDialog = false"></button>
                </div>
            </ng-template>

            <div class="p-4 grid md:grid-cols-3 lg:grid-cols-12 gap-4">
                <!-- Imagen del libro -->
                <div class="col-span-12 md:col-span-3 lg:col-span-6 xl:col-span-5 flex justify-center mx-8">
                    <img [src]="getImageUrl(objeto) || 'assets/logo.png'" [alt]="objeto?.titulo || 'Portada'" class="w-full max-w-[300px] md:max-w-[350px] lg:max-w-[350px] h-auto object-cover rounded-lg shadow-lg" />
                </div>

                <!-- Detalles del libro -->
                <div class="col-span-12 md:col-span-9 lg:col-span-6 xl:col-span-7 space-y-3">
                    <div class="text-gray-700" *ngIf="objeto?.codigoLocalizacion"><b class="font-semibold">Código:</b><br />{{ objeto?.codigoLocalizacion }}</div>
                    <hr *ngIf="objeto?.codigoLocalizacion" />

                    <ng-container [ngSwitch]="objeto?.tipoMaterialId">
                        <!-- Libros -->
                        <ng-container *ngSwitchCase="1">
                            <div class="text-gray-700" *ngIf="objeto?.titulo"><span class="font-semibold">Título:</span><br />{{ objeto?.titulo }}</div>
                            <hr *ngIf="objeto?.titulo" />
                            <div class="text-gray-700" *ngIf="autor"><span class="font-semibold">Autor:</span><br />{{ autor }}</div>
                            <hr *ngIf="autor" />
                            <div class="text-gray-700" *ngIf="objeto?.coordinador"><span class="font-semibold">Coordinador:</span><br />{{ objeto?.coordinador }}</div>
                            <hr *ngIf="objeto?.coordinador" />
                            <div class="text-gray-700" *ngIf="objeto?.director"><span class="font-semibold">Director:</span><br />{{ objeto?.director }}</div>
                            <hr *ngIf="objeto?.director" />
                            <div class="text-gray-700" *ngIf="objeto?.editorialPublicacion"><span class="font-semibold">Editorial:</span><br />{{ objeto?.editorialPublicacion }}</div>
                            <hr *ngIf="objeto?.editorialPublicacion" />
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-gray-700" *ngIf="objeto?.pais?.descripcion || objeto?.paisId"><span class="font-semibold">País:</span><br />{{ objeto?.pais?.descripcion || objeto?.paisId }}</div>
                                <div class="text-gray-700" *ngIf="objeto?.ciudad?.descripcion || objeto?.ciudadCodigo"><span class="font-semibold">Ciudad:</span><br />{{ objeto?.ciudad?.descripcion || objeto?.ciudadCodigo }}</div>
                                <div class="text-gray-700" *ngIf="objeto?.numeroPaginas"><span class="font-semibold">N° de Páginas:</span><br />{{ objeto?.numeroPaginas }}</div>
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-gray-700" *ngIf="objeto?.edicion"><span class="font-semibold">Edición:</span>{{ objeto?.edicion }}</div>
                                <div class="text-gray-700" *ngIf="objeto?.reimpresion"><span class="font-semibold">Reimpresión:</span>{{ objeto?.reimpresion }}</div>
                                <div class="text-gray-700" *ngIf="objeto?.anioPublicacion"><span class="font-semibold">Año:</span>{{ objeto?.anioPublicacion }}</div>
                            </div>
                            <div class="text-gray-700" *ngIf="objeto?.serie"><span class="font-semibold">Serie:</span>{{ objeto?.serie }}</div>
                            <hr *ngIf="objeto?.serie" />
                            <div class="text-gray-700" *ngIf="objeto?.isbn"><span class="font-semibold">ISBN:</span> {{ objeto?.isbn }}</div>
                            <hr *ngIf="objeto?.isbn" />
                            <div class="text-gray-700" *ngIf="objeto?.idiomaId"><span class="font-semibold">Idioma:</span> {{ objeto?.idiomaId }}</div>
                            <hr *ngIf="objeto?.idiomaId" />
                            <div class="text-gray-700" *ngIf="objeto?.especialidad"><span class="font-semibold">Especialidad:</span> {{ objeto?.especialidad?.descripcion }}</div>
                            <hr *ngIf="objeto?.especialidad" />
                            <div class="text-gray-700" *ngIf="objeto?.descriptor"><span class="font-semibold">Descriptores:</span> {{ objeto?.descriptor }}</div>
                            <hr *ngIf="objeto?.descriptor" />
                            <div class="text-gray-700" *ngIf="objeto?.notaContenido"><span class="font-semibold">Nota de Contenido:</span> {{ objeto?.notaContenido }}</div>
                            <hr *ngIf="objeto?.notaContenido" />
                            <div class="text-gray-700" *ngIf="objeto?.notaGeneral"><span class="font-semibold">Nota General:</span> {{ objeto?.notaGeneral }}</div>
                            <hr *ngIf="objeto?.notaGeneral" />
                            <ng-container *ngIf="detalle">
                                <div class="text-gray-700" *ngIf="detalle.numeroIngreso"><span class="font-semibold">N° de Ingreso:</span> {{ detalle.numeroIngreso }}</div>
                                <div class="text-gray-700" *ngIf="detalle.sede?.descripcion"><span class="font-semibold">Sede:</span> {{ detalle.sede?.descripcion }}</div>
                                <div class="text-gray-700" *ngIf="detalle.tipoAdquisicion?.descripcion"><span class="font-semibold">Tipo de adquisición:</span> {{ detalle.tipoAdquisicion?.descripcion }}</div>
                                <div class="text-gray-700" *ngIf="detalle.fechaIngreso"><span class="font-semibold">Fecha de Ingreso:</span> {{ detalle.fechaIngreso }}</div>
                                <div class="text-gray-700" *ngIf="detalle.costo != null"><span class="font-semibold">Costo:</span> {{ detalle.costo }}</div>
                                <div class="text-gray-700" *ngIf="detalle.numeroFactura || detalle.nroFactura"><span class="font-semibold">N° de Factura:</span> {{ detalle.numeroFactura || detalle.nroFactura }}</div>
                                <div class="text-gray-700" *ngIf="detalle.estadoDescripcion"><span class="font-semibold">Estado:</span> {{ detalle.estadoDescripcion }}</div>
                            </ng-container>
                        </ng-container>

                        <!-- Revistas -->
                        <ng-container *ngSwitchCase="2">
                            <div class="text-gray-700" *ngIf="objeto?.titulo"><span class="font-semibold">Título de revista:</span><br />{{ objeto?.titulo }}</div>
                            <hr *ngIf="objeto?.titulo" />
                            <div class="text-gray-700" *ngIf="objeto?.director"><span class="font-semibold">Director:</span><br />{{ objeto?.director }}</div>
                            <hr *ngIf="objeto?.director" />
                            <div class="text-gray-700" *ngIf="autor"><span class="font-semibold">Autor:</span><br />{{ autor }}</div>
                            <hr *ngIf="autor" />
                            <div class="text-gray-700" *ngIf="objeto?.editorialPublicacion"><span class="font-semibold">Editorial:</span><br />{{ objeto?.editorialPublicacion }}</div>
                            <hr *ngIf="objeto?.editorialPublicacion" />
                            <div class="text-gray-700" *ngIf="periodicidad"><span class="font-semibold">Periodicidad:</span><br />{{ periodicidad?.descripcion }}</div>
                            <hr *ngIf="periodicidad" />
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-gray-700" *ngIf="objeto?.pais?.descripcion || objeto?.paisId"><span class="font-semibold">País:</span><br />{{ objeto?.pais?.descripcion || objeto?.paisId }}</div>
                                <div class="text-gray-700" *ngIf="objeto?.ciudad?.descripcion || objeto?.ciudadCodigo"><span class="font-semibold">Ciudad:</span><br />{{ objeto?.ciudad?.descripcion || objeto?.ciudadCodigo }}</div>
                                <div class="text-gray-700" *ngIf="objeto?.numeroPaginas"><span class="font-semibold">N° de Páginas:</span><br />{{ objeto?.numeroPaginas }}</div>
                            </div>
                            <div class="text-gray-700" *ngIf="objeto?.anioPublicacion"><span class="font-semibold">Año:</span> {{ objeto?.anioPublicacion }}</div>
                            <hr *ngIf="objeto?.anioPublicacion" />
                            <div class="text-gray-700" *ngIf="objeto?.issn"><span class="font-semibold">ISSN:</span> {{ objeto?.issn }}</div>
                            <hr *ngIf="objeto?.issn" />
                            <div class="text-gray-700" *ngIf="objeto?.especialidad"><span class="font-semibold">Especialidad:</span> {{ objeto?.especialidad?.descripcion }}</div>
                            <hr *ngIf="objeto?.especialidad" />
                            <div class="text-gray-700" *ngIf="objeto?.descriptor"><span class="font-semibold">Descriptores:</span> {{ objeto?.descriptor }}</div>
                            <hr *ngIf="objeto?.descriptor" />
                            <div class="text-gray-700" *ngIf="objeto?.notaGeneral"><span class="font-semibold">Nota general:</span> {{ objeto?.notaGeneral }}</div>
                            <hr *ngIf="objeto?.notaGeneral" />
                            <ng-container *ngIf="detalle">
                                <div class="text-gray-700" *ngIf="detalle.numeroIngreso"><span class="font-semibold">N° de Ingreso:</span> {{ detalle.numeroIngreso }}</div>
                                <div class="text-gray-700" *ngIf="detalle.sede?.descripcion"><span class="font-semibold">Sede:</span> {{ detalle.sede?.descripcion }}</div>
                                <div class="text-gray-700" *ngIf="objeto?.existencias || detalle.nroExistencia"><span class="font-semibold">Existencias:</span> {{ objeto?.existencias || detalle.nroExistencia }}</div>
                                <div class="text-gray-700" *ngIf="detalle.tipoAdquisicion?.descripcion"><span class="font-semibold">Tipo de adquisición:</span> {{ detalle.tipoAdquisicion?.descripcion }}</div>
                                <div class="text-gray-700" *ngIf="detalle.fechaIngreso"><span class="font-semibold">Fecha de Ingreso:</span> {{ detalle.fechaIngreso }}</div>
                                <div class="text-gray-700" *ngIf="detalle.costo != null"><span class="font-semibold">Costo:</span> {{ detalle.costo }}</div>
                                <div class="text-gray-700" *ngIf="detalle.numeroFactura || detalle.nroFactura"><span class="font-semibold">N° de Factura:</span> {{ detalle.numeroFactura || detalle.nroFactura }}</div>
                                <div class="text-gray-700" *ngIf="detalle.estadoDescripcion"><span class="font-semibold">Estado:</span> {{ detalle.estadoDescripcion }}</div>
                            </ng-container>
                        </ng-container>

                        <!-- Tesis -->
                        <ng-container *ngSwitchCase="3">
                            <div class="text-gray-700" *ngIf="objeto?.titulo"><span class="font-semibold">Título:</span><br />{{ objeto?.titulo }}</div>
                            <hr *ngIf="objeto?.titulo" />
                            <div class="text-gray-700" *ngIf="autor"><span class="font-semibold">Autor:</span><br />{{ autor }}</div>
                            <hr *ngIf="autor" />
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-gray-700" *ngIf="objeto?.pais?.descripcion || objeto?.paisId"><span class="font-semibold">País:</span><br />{{ objeto?.pais?.descripcion || objeto?.paisId }}</div>
                                <div class="text-gray-700" *ngIf="objeto?.ciudad?.descripcion || objeto?.ciudadCodigo"><span class="font-semibold">Ciudad:</span><br />{{ objeto?.ciudad?.descripcion || objeto?.ciudadCodigo }}</div>
                                <div class="text-gray-700" *ngIf="objeto?.numeroPaginas"><span class="font-semibold">N° de Hojas:</span><br />{{ objeto?.numeroPaginas }}</div>
                            </div>
                            <div class="text-gray-700" *ngIf="objeto?.anioPublicacion"><span class="font-semibold">Año:</span> {{ objeto?.anioPublicacion }}</div>
                            <hr *ngIf="objeto?.anioPublicacion" />
                            <div class="text-gray-700" *ngIf="objeto?.especialidad"><span class="font-semibold">Especialidad:</span> {{ objeto?.especialidad?.descripcion }}</div>
                            <hr *ngIf="objeto?.especialidad" />
                            <div class="text-gray-700" *ngIf="objeto?.descriptor"><span class="font-semibold">Descriptores:</span> {{ objeto?.descriptor }}</div>
                            <hr *ngIf="objeto?.descriptor" />
                            <div class="text-gray-700" *ngIf="objeto?.notaContenido"><span class="font-semibold">Nota de tesis:</span> {{ objeto?.notaContenido }}</div>
                            <hr *ngIf="objeto?.notaContenido" />
                            <div class="text-gray-700" *ngIf="objeto?.notaGeneral"><span class="font-semibold">Nota general:</span> {{ objeto?.notaGeneral }}</div>
                            <hr *ngIf="objeto?.notaGeneral" />
                            <ng-container *ngIf="detalle">
                                <div class="text-gray-700" *ngIf="detalle.numeroIngreso"><span class="font-semibold">N° de Ingreso:</span> {{ detalle.numeroIngreso }}</div>
                                <div class="text-gray-700" *ngIf="detalle.sede?.descripcion"><span class="font-semibold">Sede:</span> {{ detalle.sede?.descripcion }}</div>
                                <div class="text-gray-700" *ngIf="detalle.tipoAdquisicion?.descripcion"><span class="font-semibold">Tipo de adquisición:</span> {{ detalle.tipoAdquisicion?.descripcion }}</div>
                                <div class="text-gray-700" *ngIf="detalle.fechaIngreso"><span class="font-semibold">Fecha de Ingreso:</span> {{ detalle.fechaIngreso }}</div>
                                <div class="text-gray-700" *ngIf="detalle.estadoDescripcion"><span class="font-semibold">Estado:</span> {{ detalle.estadoDescripcion }}</div>
                            </ng-container>
                        </ng-container>

                        <!-- Artículos y otros -->
                        <ng-container *ngSwitchDefault>
                            <div class="text-gray-700" *ngIf="objeto?.titulo"><span class="font-semibold">Título de artículo:</span><br />{{ objeto?.titulo }}</div>
                            <hr *ngIf="objeto?.titulo" />
                            <div class="text-gray-700" *ngIf="autor"><span class="font-semibold">Autor:</span><br />{{ autor }}</div>
                            <hr *ngIf="autor" />
                            <div class="text-gray-700" *ngIf="tituloRevistaFuente"><span class="font-semibold">Título de Revista fuente:</span><br />{{ tituloRevistaFuente }}</div>
                            <hr *ngIf="tituloRevistaFuente" />
                            <div class="text-gray-700" *ngIf="objeto?.descripcionRevista"><span class="font-semibold">Descripción de la Revista fuente:</span><br />{{ objeto?.descripcionRevista }}</div>
                            <hr *ngIf="objeto?.descripcionRevista" />
                            <div class="text-gray-700" *ngIf="objeto?.numeroPaginas"><span class="font-semibold">Páginas del artículo:</span><br />{{ objeto?.numeroPaginas }}</div>
                            <hr *ngIf="objeto?.numeroPaginas" />
                            <div class="text-gray-700" *ngIf="objeto?.descriptor"><span class="font-semibold">Descriptores:</span> {{ objeto?.descriptor }}</div>
                            <hr *ngIf="objeto?.descriptor" />
                            <div class="text-gray-700" *ngIf="objeto?.notaGeneral"><span class="font-semibold">Nota general:</span> {{ objeto?.notaGeneral }}</div>
                            <hr *ngIf="objeto?.notaGeneral" />
                            <ng-container *ngIf="detalle">
                                <div class="text-gray-700" *ngIf="detalle.sede?.descripcion"><span class="font-semibold">Sede:</span> {{ detalle.sede?.descripcion }}</div>
                                <div class="text-gray-700" *ngIf="detalle.fechaIngreso"><span class="font-semibold">Fecha de Ingreso:</span> {{ detalle.fechaIngreso }}</div>
                                <div class="text-gray-700" *ngIf="detalle.estadoDescripcion"><span class="font-semibold">Estado:</span> {{ detalle.estadoDescripcion }}</div>
                            </ng-container>
                        </ng-container>
                    </ng-container>
                </div>
            </div>
        </p-dialog>
    `
})
export class PortalDetalleEjemplar implements OnChanges {
    @Input() displayDialog: boolean = false;
    @Input() objeto: BibliotecaDTO | null = null;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['displayDialog']) {
            console.log('Cambio detectado en displayDialog:', this.displayDialog);
        }
    }
    get detalle(): DetalleBibliotecaDTO | null {
        return this.objeto?.detalles && this.objeto.detalles.length > 0 ? this.objeto.detalles[0] : null;
    }

    /**
     * Para revistas, expone la periodicidad si está presente
     */
    get periodicidad(): any | null {
        return (this.objeto as any)?.periodicidad ?? null;
    }

    /** Devuelve el título de la revista fuente para artículos */
    get tituloRevistaFuente(): string | null {
        return (this.objeto as any)?.tituloRevistaFuente ?? this.objeto?.editorialPublicacion ?? null;
    }

    get autor(): string | null {
        return this.objeto?.autorPersonal || this.objeto?.autorSecundario || this.objeto?.autorInstitucional || null;
    }

    getImageUrl(obj: BibliotecaDTO | null | undefined): string | undefined {
        if (!obj) return undefined;
        if ((obj as any).material?.url) {
            const p = (obj as any).material.url as string;
            return p.startsWith('http') ? p : `${environment.filesUrl}${p}`;
        }
        if (obj.rutaImagen) {
            const base = obj.rutaImagen.startsWith('http') ? obj.rutaImagen : `${environment.filesUrl}${obj.rutaImagen.startsWith('/') ? '' : '/'}${obj.rutaImagen}`;
            if (obj.nombreImagen) {
                if (base.endsWith(obj.nombreImagen)) return base;
                const sep = base.endsWith('/') ? '' : '/';
                return base + sep + obj.nombreImagen;
            }
            return base;
        }
        return undefined;
    }
}
