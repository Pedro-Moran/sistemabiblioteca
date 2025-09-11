import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { ReportesFiltroService } from '../../services/reportes-filtro.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { MaterialBibliograficoResumenDTO } from '../../interfaces/reportes/material-bibliografico-resumen';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-reporte-material-bibliografico-resumen',
    standalone: true,
    template: ` 
        <div class="card flex flex-col gap-4 w-full">
    <h5>{{titulo}}</h5>
    <p-toolbar styleClass="mb-6">
    <div class="flex flex-col w-full gap-4">
                <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                <div class="grid grid-cols-7 gap-4">
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                        <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>

                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                    <label for="coleccion" class="block text-sm font-medium">Coleccion</label>
                    <p-select [(ngModel)]="coleccionFiltro" [options]="dataColeccion" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex items-end">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-danger"
                icon="pi pi-search"(click)="reporte()" [disabled]="loading"  pTooltip="Ver reporte" tooltipPosition="bottom">
            </button>
        </div>
                    </div>



            </div>

    </p-toolbar>
    <p-table [value]="resultados" [loading]="loading" [paginator]="true" [rows]="10">
        <ng-template pTemplate="header">
            <tr>
                <th>N°</th>
                <th>Código</th>
                <th>Título</th>
                <th>Autor</th>
                <th>Editorial</th>
                <th>Edición</th>
                <th>Año</th>
                <th>N° Ingreso</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row let-i="rowIndex">
            <tr>
                <td>{{ i + 1 }}</td>
                <td>{{ row.codigo || '-' }}</td>
                <td>{{ row.titulo || '-' }}</td>
                <td>{{ row.autor || '-' }}</td>
                <td>{{ row.editorial || '-' }}</td>
                <td>{{ row.edicion || '-' }}</td>
                <td>{{ row.anio || '-' }}</td>
                <td>{{ row.numeroIngreso || '-' }}</td>
            </tr>
        </ng-template>
    </p-table>
</div>
`,
            imports: [TemplateModule, TooltipModule],
            providers: [MessageService, ConfirmationService]
})
export class ReporteMaterialBibliograficoResumen {
    titulo: string = "Material bibliográfico resumen";
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    coleccionFiltro: ClaseGeneral = new ClaseGeneral();
    dataColeccion: ClaseGeneral[] = [];
    tipo:number=1;
    loading: boolean = true;
    resultados: MaterialBibliograficoResumenDTO[] = [];
    constructor(
        private filtrosService: ReportesFiltroService,
        private materialService: MaterialBibliograficoService,
        private messageService: MessageService
    ) {}
    async ngOnInit() {
        await this.cargarFiltros();
        await this.reporte();
    }
    private async cargarFiltros() {
        const filtros = await this.filtrosService.cargarFiltros();
        this.dataSede = filtros.sedes;
        this.sedeFiltro = this.dataSede[0];
        this.dataColeccion = filtros.tiposMaterial;
        this.coleccionFiltro = this.dataColeccion[0];
    }
    async reporte() {
        this.loading = true;
        try {
            const respuesta = await firstValueFrom(
                this.materialService.list({
                    sedeId: this.sedeFiltro?.id,
                    tipoMaterialId: this.coleccionFiltro?.id
                })
            );
            const lista = Array.isArray(respuesta) ? respuesta : [];
            this.resultados = lista.reduce((acc: MaterialBibliograficoResumenDTO[], b: any) => {
                const detalles = Array.isArray(b.detalles) && b.detalles.length ? b.detalles : [{}];
                detalles.forEach((d: any) => {
                    acc.push({
                        codigo:
                            d.codigoLocalizacion ??
                            b.codigoLocalizacion ??
                            b.codigo ??
                            '',
                        titulo: b.titulo ?? b.material?.titulo ?? '',
                        autor:
                            [
                                b.autorPersonal,
                                b.autorInstitucional,
                                b.autorSecundario,
                                b.material?.autorPrincipal,
                                b.material?.autorSecundario
                            ]
                                .filter(Boolean)
                                .join(' - ') || '',
                        editorial: b.editorialPublicacion ?? b.material?.editorial ?? '',
                        edicion: b.edicion ?? b.material?.edicion ?? '',
                        anio: b.anioPublicacion ?? b.material?.anioPublicacion ?? '',
                        numeroIngreso:
                            d.numeroIngreso ??
                            b.numeroDeIngreso ??
                            b.numeroIngreso ??
                            ''
                    });
                });
                return acc;
            }, []);
        } catch (err) {
            console.error(err);
            let detail = 'No fue posible cargar los datos';
            if (err instanceof HttpErrorResponse && err.status === 403) {
                detail = 'No cuenta con permisos para ver la información';
            }
            this.messageService.add({ severity: 'error', summary: 'Error', detail });
        } finally {
            this.loading = false;
        }
    }
}
