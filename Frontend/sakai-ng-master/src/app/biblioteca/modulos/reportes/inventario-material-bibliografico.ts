import { Component, OnDestroy } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableLazyLoadEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { NgIf } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { InventarioMaterialBibliograficoDTO } from '../../interfaces/reportes/inventario-material-bibliografico';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ReportesFiltroService } from '../../services/reportes-filtro.service';
import { construirCabeceraFiltros } from '../../utils/exportacion';

@Component({
    selector: 'app-reporte-inventario-material-bibliografico',
    standalone: true,
    template: `
        <div class="card relative flex flex-col gap-4 w-full">
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
                    <div class="flex items-end gap-2">
                        <button pButton icon="pi pi-file-excel" label="Excel" class="p-button-success" (click)="exportExcel()" tooltip="Exportar a Excel" [disabled]="loading || exportando"></button>
                        <button pButton icon="pi pi-file-pdf" label="PDF" class="p-button-info" (click)="exportPdf()" tooltip="Exportar a PDF" [disabled]="loading || exportando"></button>
                    </div>
                    </div>



            </div>

    </p-toolbar>
    <p-table [value]="resultados" [loading]="loading" [paginator]="true" [rows]="10" [lazy]="true" (onLazyLoad)="cargarPagina($event)" [totalRecords]="totalRecords">
        <ng-template pTemplate="header">
            <tr>
                <th>N°</th>
                <th>Código</th>
                <th>N° Ingreso</th>
                <th>N° Material</th>
                <th>Título</th>
                <th>Autor</th>
                <th>Año</th>
                <th>Estado</th>
                <th>Verificar</th>
                <th>Observaciones</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row let-i="rowIndex">
            <tr>
                <td>{{ i + 1 }}</td>
                <td>{{ row.codigo || '-' }}</td>
                <td>{{ row.numeroIngreso || '-' }}</td>
                <td>{{ row.numeroMaterial || '-' }}</td>
                <td>{{ row.titulo || '-' }}</td>
                <td>{{ row.autor || '-' }}</td>
                <td>{{ row.anio || '-' }}</td>
                <td>{{ row.estado || '-' }}</td>
                <td></td>
                <td></td>
            </tr>
        </ng-template>
    </p-table>
    <div *ngIf="exportando" class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
        <p-progressSpinner></p-progressSpinner>
        <span class="mt-4 text-lg font-semibold animate-pulse">{{ mensajeCarga }}</span>
    </div>
</div>
`,
            imports: [TemplateModule, TooltipModule, NgIf, ProgressSpinnerModule],
            providers: [MessageService, ConfirmationService]
})
export class ReporteInventarioMaterialBibliografico implements OnDestroy {
    titulo: string = "Inventario material bibliográfico";
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    coleccionFiltro: ClaseGeneral = new ClaseGeneral();
    dataColeccion: ClaseGeneral[] = [];
    tipo:number=1;
    loading: boolean = false;
    exportando: boolean = false;
    resultados: InventarioMaterialBibliograficoDTO[] = [];
    page: number = 0;
    pageSize: number = 1000;
    totalRecords: number = 0;
    mensajeCarga: string = 'Generando reporte';
    private intervaloTexto?: any;

    constructor(
        private materialService: MaterialBibliograficoService,
        private messageService: MessageService,
        private http: HttpClient,
        private filtrosService: ReportesFiltroService
    ) {}
    async ngOnInit() {
        await this.cargarFiltros();
        await this.reporte();
    }

    ngOnDestroy() {
        this.detenerAnimacion();
    }
    private async cargarFiltros() {
        const filtros = await this.filtrosService.cargarFiltros();
        this.dataSede = filtros.sedes;
        this.sedeFiltro = this.dataSede[0];
        this.dataColeccion = filtros.tiposMaterial;
        this.coleccionFiltro = this.dataColeccion[0];
    }
    async reporte() {
        this.page = 0;
        this.resultados = [];
        this.totalRecords = 0;
        await this.cargarPagina({ first: 0, rows: this.pageSize });
    }

    private mapear(lista: any[]): InventarioMaterialBibliograficoDTO[] {
        return lista.flatMap((b: any) => {
            const detalles = Array.isArray(b.detalles) && b.detalles.length ? b.detalles : [{} as any];
            return detalles.map((d: any) => ({
                id: d.idDetalleBiblioteca ?? b.id ?? 0,
                codigo: b.codigoLocalizacion ?? '',
                numeroIngreso: d.numeroIngreso ?? b.numeroDeIngreso ?? '',
                numeroMaterial: d.codigoBarra ?? b.codigoLocalizacion ?? '',
                titulo: b.titulo ?? b.material?.titulo ?? '',
                autor: b.autorPersonal ?? b.material?.autorPrincipal ?? '',
                anio: b.anioPublicacion ?? b.material?.anioPublicacion ?? '',
                estado: d.estadoDescripcion ?? d.idEstado ?? ''
            }));
        });
    }

    private async obtenerTodo(): Promise<InventarioMaterialBibliograficoDTO[]> {
        const acumulado: InventarioMaterialBibliograficoDTO[] = [];
        let page = 0;
        while (true) {
            const lista = await firstValueFrom(
                this.materialService.list(
                    {
                        sedeId: this.sedeFiltro?.id ?? 0,
                        tipoMaterialId: this.coleccionFiltro?.id ?? 0
                    },
                    page,
                    this.pageSize
                )
            );
            const mapeados = this.mapear(lista);
            acumulado.push(...mapeados);
            if (lista.length < this.pageSize) {
                break;
            }
            page++;
        }
        return acumulado;
    }

    async cargarPagina(event: TableLazyLoadEvent) {
        const rows = event.rows ?? 0;
        const last = (event.first || 0) + rows;
        if (last >= this.resultados.length && !this.loading) {
            this.loading = true;
            try {
                const lista = await firstValueFrom(
                    this.materialService.list(
                        {
                            sedeId: this.sedeFiltro?.id ?? 0,
                            tipoMaterialId: this.coleccionFiltro?.id ?? 0
                        },
                        this.page,
                        this.pageSize
                    )
                );
                const nuevos = this.mapear(lista);
                this.resultados = [...this.resultados, ...nuevos];
                this.page++;
                this.totalRecords = this.resultados.length + (lista.length < this.pageSize ? 0 : 1);
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

    async exportExcel() {
        this.exportando = true;
        this.iniciarAnimacion();
        try {
            const datos = await this.obtenerTodo();
            if (!datos.length) {
                this.messageService.add({ severity: 'warn', detail: 'No hay datos para exportar.' });
                return;
            }
            const wb = new ExcelJS.Workbook();
            const ws = wb.addWorksheet('Reporte');
            const buffer = await this.http.get('/assets/logo.png', { responseType: 'arraybuffer' }).toPromise();
            const logoId = wb.addImage({ buffer, extension: 'png' });
            ws.addImage(logoId, { tl: { col: 0.2, row: 0.2 }, ext: { width: 220, height: 80 } });
            ws.addRows([[], [], [], []]); // espacio para la imagen
            ws.mergeCells('C5', 'J6');
            const title = ws.getCell('C5');
            title.value = this.titulo;
            title.alignment = { vertical: 'middle', horizontal: 'center' };
            title.font = { size: 16, bold: true };
            ws.addRow([]);
            const filtrosCabecera = construirCabeceraFiltros([
                { etiqueta: 'Sede', valor: this.sedeFiltro?.descripcion, defecto: 'Todas' },
                { etiqueta: 'Colección', valor: this.coleccionFiltro?.descripcion, defecto: 'Todas' },
                { etiqueta: 'Fecha emisión', valor: new Date().toLocaleString() }
            ]);
            ws.addRow(filtrosCabecera.etiquetas);
            ws.addRow(filtrosCabecera.valores);
            ws.addRow([]);
            const headerRow = ws.addRow(['N°', 'Código', 'N° Ingreso', 'N° Material', 'Título', 'Autor', 'Año', 'Estado', 'Verificar', 'Observaciones']);
            headerRow.font = { bold: true };
            headerRow.alignment = { horizontal: 'center' };
            datos.forEach((r, idx) => {
                ws.addRow([
                    idx + 1,
                    r.codigo ?? '-',
                    r.numeroIngreso ?? '-',
                    r.numeroMaterial ?? '-',
                    r.titulo ?? '-',
                    r.autor ?? '-',
                    r.anio ?? '-',
                    r.estado ?? '-',
                    '',
                    ''
                ]);
            });
            ws.columns.forEach(col => (col.width = 20));
            const buf = await wb.xlsx.writeBuffer();
            saveAs(new Blob([buf]), 'inventario_material_bibliografico.xlsx');
        } catch (err) {
            console.error(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible exportar.' });
        } finally {
            this.detenerAnimacion();
            this.exportando = false;
        }
    }

    async exportPdf() {
        this.exportando = true;
        this.iniciarAnimacion();
        try {
            const datos = await this.obtenerTodo();
            if (!datos.length) {
                this.messageService.add({ severity: 'warn', detail: 'No hay datos para exportar.' });
                return;
            }
            const doc = new jsPDF({ orientation: 'landscape' });
            const img = new Image();
            img.src = '/assets/logo.png';
            await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    doc.addImage(img, 'PNG', 10, 10, 60, 25);
                    doc.setFontSize(16);
                    const pageWidth = doc.internal.pageSize.getWidth();
                    doc.text(this.titulo, pageWidth / 2, 20, { align: 'center' });
                    const filtrosCabecera = construirCabeceraFiltros([
                        { etiqueta: 'Sede', valor: this.sedeFiltro?.descripcion, defecto: 'Todas' },
                        { etiqueta: 'Colección', valor: this.coleccionFiltro?.descripcion, defecto: 'Todas' },
                        { etiqueta: 'Fecha emisión', valor: new Date().toLocaleString() }
                    ]);
                    autoTable(doc, {
                        head: [filtrosCabecera.etiquetas],
                        body: [filtrosCabecera.valores],
                        startY: 40,
                        styles: { fontSize: 9 }
                    });
                    const inicioTabla = (doc as any).lastAutoTable.finalY + 5;
                    autoTable(doc, {
                        head: [['N°', 'Código', 'N° Ingreso', 'N° Material', 'Título', 'Autor', 'Año', 'Estado', 'Verificar', 'Observaciones']],
                        body: datos.map((r, idx) => [
                            idx + 1,
                            r.codigo ?? '-',
                            r.numeroIngreso ?? '-',
                            r.numeroMaterial ?? '-',
                            r.titulo ?? '-',
                            r.autor ?? '-',
                            r.anio ?? '-',
                            r.estado ?? '-',
                            '',
                            ''
                        ]),
                        startY: inicioTabla,
                        styles: { fontSize: 8 },
                        headStyles: { fillColor: [41, 128, 185] }
                    });
                    doc.save('inventario_material_bibliografico.pdf');
                    resolve();
                };
                img.onerror = (err) => reject(err);
            });
        } catch (err) {
            console.error(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible exportar.' });
        } finally {
            this.detenerAnimacion();
            this.exportando = false;
        }
    }

    private iniciarAnimacion() {
        this.mensajeCarga = 'Generando reporte';
        this.intervaloTexto = setInterval(() => {
            this.mensajeCarga = this.mensajeCarga === 'Generando reporte' ? 'Espere por favor' : 'Generando reporte';
        }, 1000);
    }

    private detenerAnimacion() {
        if (this.intervaloTexto) {
            clearInterval(this.intervaloTexto);
            this.intervaloTexto = undefined;
        }
    }
}
