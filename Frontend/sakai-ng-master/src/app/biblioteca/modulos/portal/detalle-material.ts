import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
import { environment } from '../../../../environments/environment';
@Component({
    selector: 'app-modal-detalle-material',
    standalone: true,
    template: `
        <p-dialog [(visible)]="display" [style]="{ width: '80vw' }" header="Ficha bibliográfica" [modal]="true" [closable]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <div class="p-4 grid md:grid-cols-3 lg:grid-cols-12 gap-4">
                    <!-- Imagen -->
                    <div class="col-span-12 md:col-span-4 lg:col-span-6 xl:col-span-5 flex justify-center mx-8">
                        <img [src]="getImageUrl(objeto)" [alt]="objeto?.titulo" class="w-full max-w-[300px] md:max-w-[350px] lg:max-w-[300px] h-auto object-cover rounded-lg shadow-lg" />
                    </div>

                    <!-- Detalles -->
                    <div class="col-span-12 md:col-span-9 lg:col-span-6 xl:col-span-7 space-y-3" [ngSwitch]="objeto?.coleccion?.descripcion?.toUpperCase()">
                        <!-- LIBRO -->
                        <ng-container *ngSwitchCase="'LIBRO'">
                            <div class="text-gray-700"><b class="font-semibold">Código:</b><br />{{ objeto?.codigoLocalizacion || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Título:</span><br />{{ objeto?.titulo || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Autor:</span><br />{{ objeto?.autorPersonal || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Editorial:</span><br />{{ objeto?.editorialPublicacion || '-' }}</div>
                            <hr />
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-gray-700"><span class="font-semibold">Páginas:</span><br />{{ objeto?.numeroPaginas || '-' }}</div>
                                <div class="text-gray-700"><span class="font-semibold">País:</span><br />{{ objeto?.pais?.nombrePais || '-' }}</div>
                                <div class="text-gray-700"><span class="font-semibold">Año Publicación:</span><br />{{ objeto?.anioPublicacion || '-' }}</div>
                            </div>
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-gray-700"><span class="font-semibold">ISBN:</span> {{ objeto?.isbn || '-' }}</div>
                                <div class="text-gray-700"><span class="font-semibold">Edición:</span> {{ objeto?.edicion || '-' }}</div>
                                <div class="text-gray-700"><span class="font-semibold">Reimpresión:</span> {{ objeto?.reimpresion || '-' }}</div>
                            </div>
                            <div class="text-gray-700"><br /><span class="font-semibold">Temas:</span> {{ objeto?.descriptor || '-' }}</div>
                            <div class="text-gray-700"><br /><span class="font-semibold">Nota de Contenido:</span> {{ objeto?.notaContenido || '-' }}</div>
                            <div class="text-gray-700"><br /><span class="font-semibold">Nota General:</span> {{ objeto?.notaGeneral || '-' }}</div>
                        </ng-container>

                        <!-- REVISTA -->
                        <ng-container *ngSwitchCase="'REVISTA'">
                            <div class="text-gray-700"><b class="font-semibold">Código:</b><br />{{ objeto?.codigoLocalizacion || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Título:</span><br />{{ objeto?.titulo || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Director:</span><br />{{ objeto?.director || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Institución:</span><br />{{ objeto?.autorInstitucional || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Editorial:</span><br />{{ objeto?.editorialPublicacion || '-' }}</div>
                            <hr />
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-gray-700"><span class="font-semibold">País:</span><br />{{ objeto?.pais?.nombrePais || '-' }}</div>
                                <div class="text-gray-700"><span class="font-semibold">Año:</span><br />{{ objeto?.anioPublicacion || '-' }}</div>
                                <div class="text-gray-700"><span class="font-semibold">ISSN:</span><br />{{ objeto?.issn || objeto?.isbn || '-' }}</div>
                            </div>
                            <div class="text-gray-700"><br /><span class="font-semibold">Descriptores:</span> {{ objeto?.descriptor || '-' }}</div>
                            <div class="text-gray-700"><br /><span class="font-semibold">Nota General:</span> {{ objeto?.notaGeneral || '-' }}</div>
                        </ng-container>

                        <!-- TESIS -->
                        <ng-container *ngSwitchCase="'TESIS'">
                            <div class="text-gray-700"><b class="font-semibold">Código:</b><br />{{ objeto?.codigoLocalizacion || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Título:</span><br />{{ objeto?.titulo || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Autor:</span><br />{{ objeto?.autorPersonal || '-' }}</div>
                            <hr />
                            <div class="grid grid-cols-3 gap-4">
                                <div class="text-gray-700"><span class="font-semibold">Especialidad:</span><br />{{ objeto?.especialidad?.descripcion || '-' }}</div>
                                <div class="text-gray-700"><span class="font-semibold">País:</span><br />{{ objeto?.pais?.nombrePais || '-' }}</div>
                                <div class="text-gray-700"><span class="font-semibold">Año:</span><br />{{ objeto?.anioPublicacion || '-' }}</div>
                            </div>
                            <div class="text-gray-700"><br /><span class="font-semibold">Descriptores:</span> {{ objeto?.descriptor || '-' }}</div>
                            <div class="text-gray-700"><br /><span class="font-semibold">Nota General:</span> {{ objeto?.notaGeneral || '-' }}</div>
                        </ng-container>

                        <!-- OTROS -->
                        <ng-container *ngSwitchDefault>
                            <div class="text-gray-700"><b class="font-semibold">Código:</b><br />{{ objeto?.codigoLocalizacion || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Título:</span><br />{{ objeto?.titulo || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Autor:</span><br />{{ objeto?.autorPersonal || objeto?.autorInstitucional || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Año:</span><br />{{ objeto?.anioPublicacion || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Descriptores:</span><br />{{ objeto?.descriptor || '-' }}</div>
                            <hr />
                            <div class="text-gray-700"><span class="font-semibold">Nota General:</span><br />{{ objeto?.notaGeneral || '-' }}</div>
                        </ng-container>
                    </div>
                </div>
            </ng-template>
        </p-dialog>
    `,
    imports: [TemplateModule],
    providers: [MessageService, ConfirmationService]
})
export class ModalDetalleMaterial implements OnInit {
    loading: boolean = false;
    objeto: any = {};
    display: boolean = false;

    async ngOnInit() {}
    openModal(objeto: any) {
        this.objeto = objeto || {};
        this.display = true;
    }

    closeModal() {
        this.display = false;
    }

    /** Devuelve la URL de la imagen almacenada si existe */
    getImageUrl(obj: any): string | undefined {
        if (obj?.material?.url) {
            const p = obj.material.url as string;
            return p.startsWith('http') ? p : `${environment.filesUrl}${p}`;
        }
        if (obj?.rutaImagen) {
            const base = obj.rutaImagen.startsWith('http') ? obj.rutaImagen : `${environment.filesUrl}${obj.rutaImagen.startsWith('/') ? '' : '/'}${obj.rutaImagen}`;
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
}
