import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { EjemplarNoPrestadoDTO } from '../../interfaces/reportes/ejemplar-no-prestado';
import { HttpClient } from '@angular/common/http';
import { construirCabeceraFiltros, formatearFecha } from '../../utils/exportacion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ReportesFiltroService } from '../../services/reportes-filtro.service';

@Component({
    selector: 'app-reporte-ejemplar-no-prestado',
    standalone: true,
    template: `
        <div class="card flex flex-col gap-4 w-full">
            <h5>{{ titulo }}</h5>
            <p-toolbar styleClass="mb-6">
                <div class="flex flex-col w-full gap-4">
                    <div class="grid grid-cols-7 gap-4">
                        <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                            <label class="block text-sm font-medium">Local/Filial</label>
                            <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" />
                        </div>
                        <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                            <label class="block text-sm font-medium">Tipo Material</label>
                            <p-select [(ngModel)]="tipoMaterialFiltro" [options]="dataTipoMaterial" optionLabel="descripcion" placeholder="Seleccionar" />
                        </div>
                        <div class="flex flex-col gap-2 col-span-7 md:col-span-3 lg:col-span-3">
                            <label class="block text-sm font-medium">Especialidad</label>
                            <p-select [(ngModel)]="especialidadFiltro" [options]="dataEspecialidad" optionLabel="descripcion" placeholder="Seleccionar" />
                        </div>
                        <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                            <label class="block text-sm font-medium">Programa</label>
                            <p-select [(ngModel)]="programaFiltro" [options]="dataPrograma" optionLabel="descripcion" placeholder="Seleccionar" />
                        </div>
                        <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                            <label class="block text-sm font-medium">Ciclo</label>
                            <p-select [(ngModel)]="cicloFiltro" [options]="dataCiclo" optionLabel="descripcion" placeholder="Seleccionar" />
                        </div>
                        <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                            <label class="block text-sm font-medium">Nro Ingreso</label>
                            <input [(ngModel)]="nroIngreso" pInputText type="text" />
                        </div>
                        <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                            <label class="block text-sm font-medium">Fecha inicio</label>
                            <p-datepicker appendTo="body" [(ngModel)]="fechaInicio" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" dateFormat="dd/mm/yy"></p-datepicker>
                        </div>
                        <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                            <label class="block text-sm font-medium">Fecha fin</label>
                            <p-datepicker appendTo="body" [(ngModel)]="fechaFin" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" dateFormat="dd/mm/yy"></p-datepicker>
                        </div>
                        <div class="flex items-end">
                            <button pButton type="button" class="p-button-rounded p-button-danger" icon="pi pi-search" (click)="reporte()" [disabled]="loading" pTooltip="Ver reporte" tooltipPosition="bottom"></button>
                        </div>
                        <div class="flex col-span-1 md:col-span-2 lg:col-span-2">
                            <button pButton icon="pi pi-file-excel" class="mr-2 p-button-danger" (click)="exportExcel()" tooltip="Exportar a Excel"></button>
                            <button pButton icon="pi pi-file-pdf" class="mr-2 p-button-danger" (click)="exportPdf()" tooltip="Exportar a PDF"></button>
                        </div>
                </div>

            </div>

            </p-toolbar>
            <p-table [value]="resultados" [paginator]="true" [rows]="10" [loading]="loading" scrollable="true" scrollHeight="400px" [style]="{ 'overflow-x': 'auto', 'padding-top': '10px' }">
                <ng-template pTemplate="header">
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Código localización</th>
                        <th>N° ingreso</th>
                        <th>Autor personal</th>
                        <th>Año</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                    <tr>
                        <td>{{ row.idDetalle }}</td>
                        <td>{{ row.titulo }}</td>
                        <td>{{ row.codigoLocalizacion }}</td>
                        <td>{{ row.numeroIngreso }}</td>
                        <td>{{ row.autor }}</td>
                        <td>{{ row.anio }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    imports: [TemplateModule, TooltipModule],
    providers: [MessageService]
})
export class ReporteEjemplarNoPrestado {
    titulo: string = "Ejemplar no prestados";
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    dataPrograma: ClaseGeneral[] = [];
    programaFiltro: ClaseGeneral = new ClaseGeneral();
    dataTipoMaterial: ClaseGeneral[] = [];
    tipoMaterialFiltro: ClaseGeneral = new ClaseGeneral();
    dataEscuela: ClaseGeneral[] = [];
    escuelaFiltro: ClaseGeneral = new ClaseGeneral();
    dataAnio: ClaseGeneral[] = [];
    anioFiltro: ClaseGeneral = new ClaseGeneral();
    dataMes: ClaseGeneral[] = [];
    mesFiltro: ClaseGeneral = new ClaseGeneral();
    dataCiclo: ClaseGeneral[] = [];
    cicloFiltro: ClaseGeneral = new ClaseGeneral();
    dataTipoUsuario: ClaseGeneral[] = [];
    tipoUsuarioFiltro: ClaseGeneral = new ClaseGeneral();
    dataEstado: ClaseGeneral[] = [];
    estadoFiltro: ClaseGeneral = new ClaseGeneral();
    dataTipoPrestamo: ClaseGeneral[] = [];
    tipoPrestamoFiltro: ClaseGeneral = new ClaseGeneral();
    dataEspecialidad: ClaseGeneral[] = [];
    especialidadFiltro: ClaseGeneral = new ClaseGeneral();
    nroIngreso: string = '';
    fechaInicio: Date = new Date();
    fechaFin: Date = new Date();
    tipo: number = 1;
    loading: boolean = true;
    resultados: EjemplarNoPrestadoDTO[] = [];

    constructor(
        private svc: MaterialBibliograficoService,
        private messageService: MessageService,
        private http: HttpClient,
        private filtrosService: ReportesFiltroService
    ) {}

    async ngOnInit() {
        await this.cargarFiltros();
        await this.reporte();
    }
    private async cargarFiltros() {
        const filtros = await this.filtrosService.cargarFiltros();
        this.dataSede = filtros.sedes;
        this.sedeFiltro = this.dataSede[0];
        this.dataPrograma = filtros.programas;
        this.programaFiltro = this.dataPrograma[0];
        this.dataTipoMaterial = filtros.tiposMaterial;
        this.tipoMaterialFiltro = this.dataTipoMaterial[0];
        this.dataEspecialidad = filtros.especialidades;
        this.especialidadFiltro = this.dataEspecialidad[0];
        this.dataCiclo = filtros.ciclos;
        this.cicloFiltro = this.dataCiclo[0];
    }
    private formatDate(fecha: Date | null): string | undefined {
        return fecha ? fecha.toISOString().split('T')[0] : undefined;
    }
    async reporte() {
        this.loading = true;
        try {
            this.resultados =
                (await this.svc
                    .reporteEjemplarNoPrestado({
                        sede: this.sedeFiltro?.id,
                        tipoMaterial: this.tipoMaterialFiltro?.id,
                        especialidad: this.especialidadFiltro?.id,
                        programa: this.programaFiltro?.id,
                        ciclo: this.cicloFiltro?.id,
                        numeroIngreso: this.nroIngreso || undefined,
                        fechaInicio: this.formatDate(this.fechaInicio),
                        fechaFin: this.formatDate(this.fechaFin)
                    })
                    .toPromise()) ?? [];
        } finally {
            this.loading = false;
        }
    }
    async exportExcel() {
        if (!this.resultados.length) {
            this.messageService.add({ severity: 'warn', detail: 'No hay datos para exportar.' });
            return;
        }
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Reporte');
        const buffer = await this.http.get('/assets/logo.png', { responseType: 'arraybuffer' }).toPromise();
        const logoId = wb.addImage({ buffer, extension: 'png' });
        ws.addImage(logoId, { tl: { col: 0.2, row: 0.2 }, ext: { width: 220, height: 80 } });
        ws.addRows([[], [], [], []]); // espacio para la imagen
        ws.mergeCells('C5', 'H6');
        const title = ws.getCell('C5');
        title.value = this.titulo;
        title.alignment = { vertical: 'middle', horizontal: 'center' };
        title.font = { size: 16, bold: true };
        ws.addRow([]);
        const filtrosCabecera = construirCabeceraFiltros([
            { etiqueta: 'Sede', valor: this.sedeFiltro?.descripcion, defecto: 'Todas' },
            { etiqueta: 'Tipo Material', valor: this.tipoMaterialFiltro?.descripcion, defecto: 'Todos' },
            { etiqueta: 'Especialidad', valor: this.especialidadFiltro?.descripcion, defecto: 'Todas' },
            { etiqueta: 'Programa', valor: this.programaFiltro?.descripcion, defecto: 'Todos' },
            { etiqueta: 'Ciclo', valor: this.cicloFiltro?.descripcion, defecto: 'Todos' },
            { etiqueta: 'N° ingreso', valor: this.nroIngreso || undefined, defecto: 'Todos' },
            { etiqueta: 'Fecha Inicio', valor: formatearFecha(this.fechaInicio), defecto: 'Todos' },
            { etiqueta: 'Fecha Fin', valor: formatearFecha(this.fechaFin), defecto: 'Todos' },
            { etiqueta: 'Fecha emisión', valor: new Date().toLocaleString() }
        ]);
        ws.addRow(filtrosCabecera.etiquetas);
        ws.addRow(filtrosCabecera.valores);
        ws.addRow([]);
        const headerRow = ws.addRow(['ID', 'Título', 'Código localización', 'N° ingreso', 'Autor personal', 'Año']);
        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: 'center' };
        this.resultados.forEach((r) => ws.addRow([
            r.idDetalle,
            r.titulo,
            r.codigoLocalizacion,
            r.numeroIngreso ?? '',
            r.autor,
            r.anio ?? ''
        ]));
        ws.columns.forEach((col) => (col.width = 25));
        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), 'ejemplares_no_prestados.xlsx');
    }

    exportPdf() {
        if (!this.resultados.length) {
            this.messageService.add({ severity: 'warn', detail: 'No hay datos para exportar.' });
            return;
        }
        const doc = new jsPDF({ orientation: 'landscape' });
        const img = new Image();
        img.src = '/assets/logo.png';
        img.onload = () => {
            doc.addImage(img, 'PNG', 10, 10, 60, 25);
            doc.setFontSize(16);
            const pageWidth = doc.internal.pageSize.getWidth();
            doc.text(this.titulo, pageWidth / 2, 20, { align: 'center' });
            const filtrosCabecera = construirCabeceraFiltros([
                { etiqueta: 'Sede', valor: this.sedeFiltro?.descripcion, defecto: 'Todas' },
                { etiqueta: 'Tipo Material', valor: this.tipoMaterialFiltro?.descripcion, defecto: 'Todos' },
                { etiqueta: 'Especialidad', valor: this.especialidadFiltro?.descripcion, defecto: 'Todas' },
                { etiqueta: 'Programa', valor: this.programaFiltro?.descripcion, defecto: 'Todos' },
                { etiqueta: 'Ciclo', valor: this.cicloFiltro?.descripcion, defecto: 'Todos' },
                { etiqueta: 'N° ingreso', valor: this.nroIngreso || undefined, defecto: 'Todos' },
                { etiqueta: 'Fecha Inicio', valor: formatearFecha(this.fechaInicio), defecto: 'Todos' },
                { etiqueta: 'Fecha Fin', valor: formatearFecha(this.fechaFin), defecto: 'Todos' },
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
                head: [['ID', 'Título', 'Código localización', 'N° ingreso', 'Autor personal', 'Año']],
                body: this.resultados.map((r) => [
                    r.idDetalle,
                    r.titulo,
                    r.codigoLocalizacion,
                    r.numeroIngreso ?? '',
                    r.autor,
                    r.anio ?? ''
                ]),
                startY: inicioTabla,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] }
            });
            doc.save('ejemplares_no_prestados.pdf');
        };
    }
}
