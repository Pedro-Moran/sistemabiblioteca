import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TemplateModule } from '../../../template.module';
import { BibliotecaDTO, DetalleBibliotecaDTO } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'portal-detalle-ejemplar',
    standalone: true,
    imports: [ButtonModule, RippleModule, TemplateModule, DatePipe],
    template: `
        <p-dialog [(visible)]="displayDialog" [modal]="true" [closable]="false" [style]="{ width: '80vw' }" position="center">
            <ng-template pTemplate="header">
                <div class="flex justify-between items-center w-full">
                    <span class="text-lg font-semibold">DATOS DE MATERIAL BIBLIOGRÁFICO</span>
                    <button pButton icon="pi pi-times" class="p-button-rounded p-button-text" (click)="displayDialog = false"></button>
                </div>
            </ng-template>

            <div class="p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
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
                            <div class="text-gray-700"><span class="font-semibold">Título:</span><br />{{ objeto?.titulo || '—' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Autor principal:</span><br />{{ objeto?.autorPersonal || '—' }}</div>
                            <hr />
                            <div class="text-gray-700" *ngIf="objeto?.autorSecundario"><span class="font-semibold">Autor secundario:</span><br />{{ objeto?.autorSecundario }}</div>
                            <hr *ngIf="objeto?.autorSecundario" />
                            <div class="text-gray-700" *ngIf="objeto?.autorInstitucional"><span class="font-semibold">Autor institucional:</span><br />{{ objeto?.autorInstitucional }}</div>
                            <hr *ngIf="objeto?.autorInstitucional" />
                            <div class="text-gray-700" *ngIf="objeto?.coordinador"><span class="font-semibold">Coordinador:</span><br />{{ objeto?.coordinador }}</div>
                            <hr *ngIf="objeto?.coordinador" />
                            <div class="text-gray-700" *ngIf="objeto?.director"><span class="font-semibold">Director:</span><br />{{ objeto?.director }}</div>
                            <hr *ngIf="objeto?.director" />
                            <div class="text-gray-700" *ngIf="objeto?.editorialPublicacion"><span class="font-semibold">Editorial:</span><br />{{ objeto?.editorialPublicacion }}</div>
                            <hr *ngIf="objeto?.editorialPublicacion" />
                            <table class="w-full text-gray-700">
                                <tbody>
                                    <tr>
                                        <td class="font-semibold pr-2">País:</td>
                                        <td class="pr-4">{{ paisDescripcion || '—' }}</td>
                                        <td class="font-semibold pr-2">Ciudad:</td>
                                        <td class="pr-4">{{ ciudadDescripcion || '—' }}</td>
                                        <td class="font-semibold pr-2">N° de Páginas:</td>
                                        <td>{{ objeto?.numeroPaginas || '—' }}</td>
                                    </tr>
                                    <tr>
                                        <td class="font-semibold pr-2">Edición:</td>
                                        <td class="pr-4">{{ objeto?.edicion || '—' }}</td>
                                        <td class="font-semibold pr-2">Reimpresión:</td>
                                        <td class="pr-4">{{ objeto?.reimpresion || '—' }}</td>
                                        <td class="font-semibold pr-2">Año:</td>
                                        <td>{{ objeto?.anioPublicacion || '—' }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="text-gray-700"><span class="font-semibold block">Serie:</span>{{ objeto?.serie || '—' }}</div>
                            <hr />
                            <div class="text-gray-700" *ngIf="objeto?.isbn"><span class="font-semibold block">ISBN:</span>{{ objeto?.isbn }}</div>
                            <hr *ngIf="objeto?.isbn" />
                            <div class="text-gray-700" *ngIf="idiomaDescripcion"><span class="font-semibold block">Idioma:</span>{{ idiomaDescripcion }}</div>
                            <hr *ngIf="idiomaDescripcion" />
                            <div class="text-gray-700" *ngIf="objeto?.especialidad"><span class="font-semibold block">Especialidad:</span>{{ objeto?.especialidad?.descripcion }}</div>
                            <hr *ngIf="objeto?.especialidad" />
                            <div class="text-gray-700"><span class="font-semibold block">Descriptores:</span>{{ objeto?.descriptor || '—' }}</div>
                            <hr />
                            <div class="text-gray-700" *ngIf="objeto?.notaContenido"><span class="font-semibold block">Nota de Contenido:</span>{{ objeto?.notaContenido }}</div>
                            <hr *ngIf="objeto?.notaContenido" />
                            <div class="text-gray-700" *ngIf="objeto?.notaGeneral"><span class="font-semibold block">Nota General:</span>{{ objeto?.notaGeneral }}</div>
                            <hr *ngIf="objeto?.notaGeneral" />
                            <ng-container *ngIf="detalle">
                                <div class="text-gray-700"><span class="font-semibold block">N° de Ingreso:</span>{{ detalle.numeroIngreso || '—' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Sede:</span>{{ detalle.sede?.descripcion || '—' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Tipo de adquisición:</span>{{ detalle.tipoAdquisicion?.descripcion || '—' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Fecha de Ingreso:</span>{{ detalle.fechaIngreso | date: 'dd-MM-yyyy' }}</div>
                                <div class="text-gray-700" *ngIf="detalle.costo != null"><span class="font-semibold block">Costo:</span>{{ detalle.costo }}</div>
                                <div class="text-gray-700" *ngIf="detalle.numeroFactura || detalle.nroFactura"><span class="font-semibold block">N° de Factura:</span>{{ detalle.numeroFactura || detalle.nroFactura }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Estado:</span>{{ detalle.estadoDescripcion || '—' }}</div>
                            </ng-container>
                        </ng-container>

                        <!-- Revistas -->
                        <ng-container *ngSwitchCase="2">
                            <div class="text-gray-700"><span class="font-semibold">Título de revista:</span><br />{{ objeto?.titulo || '—' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Director:</span><br />{{ objeto?.director || '—' }}</div>
                            <hr />
                            <div class="text-gray-700" *ngIf="objeto?.autorInstitucional"><span class="font-semibold">Autor institucional:</span><br />{{ objeto?.autorInstitucional }}</div>
                            <hr *ngIf="objeto?.autorInstitucional" />
                            <div class="text-gray-700"><span class="font-semibold">Editorial:</span><br />{{ objeto?.editorialPublicacion || '—' }}</div>
                            <hr />
                            <div class="text-gray-700" *ngIf="periodicidad"><span class="font-semibold">Periodicidad:</span><br />{{ periodicidad?.descripcion }}</div>
                            <hr *ngIf="periodicidad" />
                            <table class="w-full text-gray-700 mb-4">
                                <tbody>
                                    <tr>
                                        <td class="font-semibold pr-2">País:</td>
                                        <td class="pr-4">{{ paisDescripcion || '—' }}</td>
                                        <td class="font-semibold pr-2">Ciudad:</td>
                                        <td class="pr-4">{{ ciudadDescripcion || '—' }}</td>
                                        <td class="font-semibold pr-2">N° de Páginas:</td>
                                        <td>{{ objeto?.numeroPaginas || '—' }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="text-gray-700"><span class="font-semibold block">Año:</span>{{ objeto?.anioPublicacion || '—' }}</div>
                            <hr />
                            <div class="text-gray-700" *ngIf="objeto?.issn"><span class="font-semibold block">ISSN:</span>{{ objeto?.issn }}</div>
                            <hr *ngIf="objeto?.issn" />
                            <div class="text-gray-700" *ngIf="objeto?.especialidad"><span class="font-semibold block">Especialidad:</span>{{ objeto?.especialidad?.descripcion }}</div>
                            <hr *ngIf="objeto?.especialidad" />
                            <div class="text-gray-700"><span class="font-semibold block">Descriptores:</span>{{ objeto?.descriptor || '—' }}</div>
                            <hr />
                            <div class="text-gray-700" *ngIf="objeto?.notaGeneral"><span class="font-semibold block">Nota general:</span>{{ objeto?.notaGeneral }}</div>
                            <hr *ngIf="objeto?.notaGeneral" />
                            <ng-container *ngIf="detalle">
                                <div class="text-gray-700"><span class="font-semibold block">N° de Ingreso:</span>{{ detalle.numeroIngreso || '—' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Sede:</span>{{ detalle.sede?.descripcion || '—' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Existencias:</span>{{ objeto?.existencias || detalle.nroExistencia || '—' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Tipo de adquisición:</span>{{ detalle.tipoAdquisicion?.descripcion || '—' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Fecha de Ingreso:</span>{{ detalle.fechaIngreso | date: 'dd-MM-yyyy' }}</div>
                                <div class="text-gray-700" *ngIf="detalle.costo != null"><span class="font-semibold block">Costo:</span>{{ detalle.costo }}</div>
                                <div class="text-gray-700" *ngIf="detalle.numeroFactura || detalle.nroFactura"><span class="font-semibold block">N° de Factura:</span>{{ detalle.numeroFactura || detalle.nroFactura }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Estado:</span>{{ detalle.estadoDescripcion || '—' }}</div>
                            </ng-container>
                        </ng-container>

                        <!-- Tesis -->
                        <ng-container *ngSwitchCase="3">
                            <div class="text-gray-700"><span class="font-semibold">Título:</span><br />{{ objeto?.titulo || '—' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Autor:</span><br />{{ objeto?.autorPersonal || '—' }}</div>
                            <hr />
                            <table class="w-full text-gray-700 mb-4">
                                <tbody>
                                    <tr>
                                        <td class="font-semibold pr-2">País:</td>
                                        <td class="pr-4">{{ paisDescripcion || '—' }}</td>
                                        <td class="font-semibold pr-2">Ciudad:</td>
                                        <td class="pr-4">{{ ciudadDescripcion || '—' }}</td>
                                        <td class="font-semibold pr-2">N° de Hojas:</td>
                                        <td>{{ objeto?.numeroPaginas || '—' }}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="text-gray-700"><span class="font-semibold block">Año:</span>{{ objeto?.anioPublicacion || '—' }}</div>
                            <hr />
                            <div class="text-gray-700" *ngIf="objeto?.especialidad"><span class="font-semibold block">Especialidad:</span>{{ objeto?.especialidad?.descripcion }}</div>
                            <hr *ngIf="objeto?.especialidad" />
                            <div class="text-gray-700"><span class="font-semibold block">Descriptores:</span>{{ objeto?.descriptor || '—' }}</div>
                            <hr />
                            <div class="text-gray-700" *ngIf="objeto?.notaContenido"><span class="font-semibold block">Nota de tesis:</span>{{ objeto?.notaContenido }}</div>
                            <hr *ngIf="objeto?.notaContenido" />
                            <div class="text-gray-700" *ngIf="objeto?.notaGeneral"><span class="font-semibold block">Nota general:</span>{{ objeto?.notaGeneral }}</div>
                            <hr *ngIf="objeto?.notaGeneral" />
                            <ng-container *ngIf="detalle">
                                <div class="text-gray-700"><span class="font-semibold block">N° de Ingreso:</span>{{ detalle.numeroIngreso || '—' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Sede:</span>{{ detalle.sede?.descripcion || '—' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Tipo de adquisición:</span>{{ detalle.tipoAdquisicion?.descripcion || '—' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Fecha de Ingreso:</span>{{ detalle.fechaIngreso | date: 'dd-MM-yyyy' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Estado:</span>{{ detalle.estadoDescripcion || '—' }}</div>
                            </ng-container>
                        </ng-container>

                        <!-- Artículos y otros -->
                        <ng-container *ngSwitchDefault>
                            <div class="text-gray-700"><span class="font-semibold">Título de artículo:</span><br />{{ objeto?.titulo || '—' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Autor:</span><br />{{ objeto?.autorPersonal || '—' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Título de Revista fuente:</span><br />{{ tituloRevistaFuente || '—' }}</div>
                            <hr />
                            <div class="text-gray-700" *ngIf="objeto?.descripcionRevista"><span class="font-semibold">Descripción de la Revista fuente:</span><br />{{ objeto?.descripcionRevista }}</div>
                            <hr *ngIf="objeto?.descripcionRevista" />
                            <div class="text-gray-700"><span class="font-semibold">Páginas del artículo:</span><br />{{ objeto?.numeroPaginas || '—' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold block">Descriptores:</span>{{ objeto?.descriptor || '—' }}</div>
                            <hr />
                            <div class="text-gray-700" *ngIf="objeto?.notaGeneral"><span class="font-semibold block">Nota general:</span>{{ objeto?.notaGeneral }}</div>
                            <hr *ngIf="objeto?.notaGeneral" />
                            <ng-container *ngIf="detalle">
                                <div class="text-gray-700"><span class="font-semibold block">Sede:</span>{{ detalle.sede?.descripcion || '—' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Fecha de Ingreso:</span>{{ detalle.fechaIngreso | date: 'dd-MM-yyyy' }}</div>
                                <div class="text-gray-700"><span class="font-semibold block">Estado:</span>{{ detalle.estadoDescripcion || '—' }}</div>
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

    paisDescripcion: string | null = null;
    ciudadDescripcion: string | null = null;
    idiomaDescripcion: string | null = null;

    constructor(private materialService: MaterialBibliograficoService) {}

    async ngOnChanges(changes: SimpleChanges) {
        if (changes['objeto'] && this.objeto) {
            this.paisDescripcion = this.obtenerDescripcion(this.objeto.pais, ['descripcion', 'nombrePais', 'nombre']);
            this.ciudadDescripcion = this.obtenerDescripcion(this.objeto.ciudad, ['descripcion', 'nombreCiudad']);
            this.idiomaDescripcion = this.obtenerDescripcion((this.objeto as any)?.idioma, ['descripcion', 'nombre']);

            if (!this.paisDescripcion && this.objeto.paisId) {
                try {
                    const result: any = await this.materialService.lista_pais('material-bibliografico/pais').toPromise();
                    if (result.status === 0) {
                        const found = result.data.find((p: any) => p.paisId == this.objeto!.paisId || p.id == this.objeto!.paisId);
                        this.paisDescripcion = this.obtenerDescripcion(found, ['descripcion', 'nombrePais', 'nombre']) || String(this.objeto!.paisId);
                    }
                } catch {}
            }

            if (!this.ciudadDescripcion && this.objeto.ciudadCodigo && this.objeto.paisId) {
                try {
                    const result: any = await this.materialService.lista_ciudad(`material-bibliografico/ciudad-by-pais/${this.objeto.paisId}`).toPromise();
                    if (result.status === 0) {
                        const found = result.data.find((c: any) => c.ciudadCodigo == this.objeto!.ciudadCodigo);
                        this.ciudadDescripcion = this.obtenerDescripcion(found, ['descripcion', 'nombreCiudad']) || String(this.objeto!.ciudadCodigo);
                    }
                } catch {}
            }

            if (!this.idiomaDescripcion && this.objeto.idiomaId) {
                try {
                    const result: any = await this.materialService.lista_idioma('material-bibliografico/idioma').toPromise();
                    if (result.status === 0) {
                        const found = result.data.find((i: any) => i.id == this.objeto!.idiomaId || i.idiomaId == this.objeto!.idiomaId);
                        this.idiomaDescripcion = this.obtenerDescripcion(found, ['descripcion', 'nombre']) || String(this.objeto!.idiomaId);
                    }
                } catch {}
            }
        }
    }

    private obtenerDescripcion(item: any, campos: string[]): string | null {
        if (!item) return null;
        for (const campo of campos) {
            const valor = item[campo];
            if (valor) return valor;
        }
        return null;
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
