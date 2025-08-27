import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { PrestamosService } from '../../services/prestamos.service';
import { UsuarioPrestamosEquipoDTO } from '../../interfaces/reportes/usuario-prestamos-equipo';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-reporte-usuarios-atendidos-biblioteca',
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
                    <label for="tipoUsuario" class="block text-sm font-medium">Tipo usuario</label>
                    <p-select [(ngModel)]="tipoUsuarioFiltro" [options]="dataTipoUsuario" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-3 lg:col-span-3">
                        <label for="especialidad" class="block text-sm font-medium">Especialidad</label>
                        <p-select [(ngModel)]="especialidadFiltro" [options]="dataEspecialidad" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>

                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                    <label for="programa" class="block text-sm font-medium">Programa</label>
                    <p-select [(ngModel)]="programaFiltro" [options]="dataPrograma" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                    <label for="ciclo" class="block text-sm font-medium">Ciclo</label>
                    <p-select [(ngModel)]="cicloFiltro" [options]="dataCiclo" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    </div>

                    <div class="grid grid-cols-7 gap-4">
                    <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="tipoPrestamo" class="block text-sm font-medium">Fecha inicio</label>
                        <p-datepicker
                            appendTo="body"
                            [(ngModel)]="fechaInicio"
                            [ngClass]="'w-full'"
                            [style]="{ width: '100%' }"
                            [readonlyInput]="true"
                            dateFormat="dd/mm/yy">
                        </p-datepicker>
                    </div>
                    <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="tipoPrestamo" class="block text-sm font-medium">Fecha fin</label>
                    <p-datepicker
                            appendTo="body"
                            [(ngModel)]="fechaFin"
                            [ngClass]="'w-full'"
                            [style]="{ width: '100%' }"
                            [readonlyInput]="true"
                            dateFormat="dd/mm/yy">
                        </p-datepicker>
                    </div>
                    <div class="flex items-end">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-danger"
                icon="pi pi-search"(click)="reporte()" [disabled]="loading"  pTooltip="Ver reporte" tooltipPosition="bottom">
            </button>
        </div>
                    <div class="flex col-span-1 md:col-span-2 lg:col-span-2">

                    </div>
                </div>

            </div>
        <div class="formgroup-inline">
            <button pButton icon="pi pi-file-excel" label="XLS" class="mr-2 p-button-danger" (click)="exportExcel()" tooltip="Exportar a Excel"></button>
            <button pButton icon="pi pi-file-pdf" label="PDF" class="mr-2 p-button-danger" (click)="exportPdf()" tooltip="Exportar a PDF"></button>
    </div>
    </p-toolbar>
    <p-table [value]="resultados" [loading]="loading" [paginator]="true" [rows]="10" sortField="id" [sortOrder]="-1">
        <ng-template pTemplate="header">
            <tr>
                <th>Usuario</th>
                <th>Sede</th>
                <th>Préstamos</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
            <tr>
                <td>{{ row.usuario }}</td>
                <td>{{ row.sede || '-' }}</td>
                <td>{{ row.totalPrestamos }}</td>
            </tr>
        </ng-template>
    </p-table>
</div>
`,
    imports: [TemplateModule, TooltipModule],
    providers: [MessageService, ConfirmationService]
})
export class ReporteUsuariosAtendidosBiblioteca {
    titulo: string = "Usuarios atendidos biblioteca virtual";
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
    fechaInicio?: Date;
    fechaFin?: Date;
    nroIngreso: string = '';
    tipo: number = 1;
    loading: boolean = true;
    resultados: UsuarioPrestamosEquipoDTO[] = [];

    constructor(
        private prestamosService: PrestamosService,
        private messageService: MessageService,
        private http: HttpClient
    ) {}
    async ngOnInit() {
        await this.reporte();
    }
    async reporte() {
        this.loading = true;
        try {
            this.resultados = await firstValueFrom(this.prestamosService.reporteUsuariosAtendidosBiblioteca());
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
        ws.mergeCells('C1', 'F2');
        const title = ws.getCell('C1');
        title.value = 'Usuarios atendidos';
        title.alignment = { vertical: 'middle', horizontal: 'center' };
        title.font = { size: 16, bold: true };
        ws.addRow([]);
        const headerRow = ws.addRow(['Usuario', 'Sede', 'Préstamos']);
        headerRow.font = { bold: true };
        headerRow.alignment = { horizontal: 'center' };
        this.resultados.forEach((r) => ws.addRow([r.usuario, r.sede || '-', r.totalPrestamos]));
        ws.columns.forEach((col) => (col.width = 25));
        const buf = await wb.xlsx.writeBuffer();
        saveAs(new Blob([buf]), 'usuarios_atendidos.xlsx');
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
            doc.text('Usuarios atendidos', 80, 20);
            doc.setFontSize(10);
            const hoy = new Date();
            doc.text(`Fecha de emisión: ${hoy.toLocaleDateString()}`, 80, 25);
            autoTable(doc, {
                head: [['Usuario', 'Sede', 'Préstamos']],
                body: this.resultados.map((r) => [r.usuario, r.sede || '-', r.totalPrestamos]),
                startY: 35,
                styles: { fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185] }
            });
            doc.save('usuarios_atendidos.pdf');
        };
    }
}
