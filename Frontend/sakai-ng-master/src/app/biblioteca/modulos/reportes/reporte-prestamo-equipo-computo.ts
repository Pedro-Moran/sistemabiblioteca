import { Component, OnInit } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TableModule }    from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule }   from 'primeng/button';
import { TooltipModule }  from 'primeng/tooltip';
import { ToastModule }    from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToolbarModule }  from 'primeng/toolbar';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { PrestamosService } from '../../services/prestamos.service';
import { DetallePrestamo  } from '../../interfaces/detalle-prestamo';
import { Sedes            } from '../../interfaces/sedes';
import { ClaseGeneral     } from '../../interfaces/clase-general';
import { ReportesFiltroService } from '../../services/reportes-filtro.service';

import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { construirCabeceraFiltros, formatearFecha } from '../../utils/exportacion';
@Component({
    selector: 'app-reporte-prestamo-equipo-computo',
    standalone: true,
    imports: [     CommonModule,
                                   FormsModule,
                                   CalendarModule,
                                   TableModule,
                                   DropdownModule,
                                   ButtonModule,
                                   TooltipModule,
                                   ToastModule,
                                   ToolbarModule],
    template: `
<p-toast></p-toast>
<div class="card w-full p-4">
  <p-toolbar class="mb-4">
    <div class="card w-full">
      <h2 class="mb-4">Préstamo detallado de equipos de cómputo</h2>

      <!-- FILTROS -->
      <div class="formgroup-inline">
        <div class="field col-12 md:col-3">
          <label>Sede</label>
          <p-dropdown
            class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
            [options]="dataSede" optionLabel="descripcion" [(ngModel)]="sedeFiltro" placeholder="Todas">
          </p-dropdown>
        </div>
        <div class="field col-12 md:col-3">
          <label>Tipo Usuario</label>
          <p-dropdown
            class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
            [options]="dataTipoUsuario" optionLabel="descripcion" [(ngModel)]="tipoUsuarioFiltro" placeholder="Todos">
          </p-dropdown>
        </div>
        <div class="field col-12 md:col-3">
          <label>Estado</label>
          <p-dropdown
            class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
            [options]="tipoPrestamoLista"
                optionLabel="label"
                optionValue="value"
                [(ngModel)]="tipoPrestamoFiltro"
                placeholder="Todos">
          </p-dropdown>
        </div>
        <div class="field col-12 md:col-3">
          <label>Escuela</label>
          <p-dropdown
            class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
            [options]="dataEscuela" optionLabel="descripcion" [(ngModel)]="escuelaFiltro" placeholder="Todas">
          </p-dropdown>
        </div>
        <div class="field col-12 md:col-3">
          <label>Programa</label>
          <p-dropdown
            class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
            [options]="dataPrograma" optionLabel="descripcion" [(ngModel)]="programaFiltro" placeholder="Todos">
          </p-dropdown>
        </div>
        <div class="field col-12 md:col-3">
          <label>Ciclo</label>
          <p-dropdown
            class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
            [options]="dataCiclo" optionLabel="descripcion" [(ngModel)]="cicloFiltro" placeholder="Todos">
          </p-dropdown>
        </div>
      </div>

      <!-- FECHAS + BOTÓN -->
      <div class="formgroup-inline">
        <div class="field col-12 md:col-3">
          <label>Fecha Inicio</label>
          <p-calendar [(ngModel)]="fechaInicio" dateFormat="dd/mm/yy" [showIcon]="true">
          </p-calendar>
        </div>
        <div class="field col-12 md:col-3">
          <label>Fecha Fin</label>
          <p-calendar [(ngModel)]="fechaFin" dateFormat="dd/mm/yy" [showIcon]="true">
          </p-calendar>
        </div>
        <div class="field col-12 md:col-3">
          <button pButton type="button" label="Ver Reporte" icon="pi pi-search" class="p-button-raised p-button-danger "
            (click)="reporte()" [loading]="loading">
          </button>
        </div>
      </div>

      <!-- EXPORT -->
      <div class="formgroup-inline">
        <button pButton icon="pi pi-file-excel" label="XLS" class="mr-2 p-button-danger" (click)="exportExcel()">
        </button>
        <button pButton icon="pi pi-file-pdf" label="PDF" class="mr-2 p-button-danger" (click)="exportPdf()">
        </button>
      </div>
    </div>
  </p-toolbar>
  <!-- TABLA -->
  <div class="table-wrapper">
    <p-table [value]="resultados" [paginator]="true" [rows]="10" [loading]="loading" scrollable="true"
      scrollHeight="800px" [style]="{ 'overflow-x': 'auto', 'padding-bottom': '1rem'}"
      sortField="id" [sortOrder]="-1">
      <ng-template pTemplate="header">
        <tr>
          <th>Equipo</th>
          <th>Alcance</th>
          <th>Usuario</th>
          <th>Especialidad</th>
          <th>Sede</th>
          <th>Usuario Préstamo</th>
          <th>Fecha Préstamo</th>
          <th>Usuario Recepción</th>
          <th>Fecha Recepción</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-row>
        <tr>
          <td>{{ row.equipo.nombreEquipo }}</td>
          <td>{{ row.alcance }}</td>
          <td>{{ row.codigoUsuario }}</td>
          <td>{{ row.especialidad }}</td>
          <td>{{ row.equipo.sede.descripcion }}</td>
          <td>{{ row.usuarioPrestamo }}</td>
          <td>{{ row.fechaPrestamo | date:'dd/MM/yyyy HH:mm' }}</td>
          <td>{{ row.usuarioRecepcion || '-' }}</td>
          <td>{{ row.fechaRecepcion | date:'dd/MM/yyyy HH:mm' }}</td>
        </tr>
      </ng-template>
    </p-table>
  </div>
</div>
`,

            providers: [MessageService]
})

export class ReportePrestamoEquipoComputo implements OnInit {
  titulo = 'Préstamo detallado de equipos de cómputo';

  dataSede: Sedes[]               = [];
  dataTipoUsuario: ClaseGeneral[] = [];
  dataEstado: ClaseGeneral[]      = [];
  dataEscuela: ClaseGeneral[]     = [];
  dataPrograma: ClaseGeneral[]    = [];
  dataCiclo: ClaseGeneral[]       = [];

  sedeFiltro?:        Sedes;
  tipoUsuarioFiltro?: ClaseGeneral;
  escuelaFiltro?:     ClaseGeneral;
  programaFiltro?:    ClaseGeneral;
  cicloFiltro?:       ClaseGeneral;

  fechaInicio?: Date;
  fechaFin?:    Date;

  resultados: DetallePrestamo[] = [];
  loading = false;
  estadoLista: any[] = [];
  tipoPrestamoLista = [
    { label: 'Todos',                value: null                },
    { label: 'En sala',              value: 'EN_SALA'           },
    { label: 'A domicilio',          value: 'PRESTAMO_A_DOMICILIO' },
  ];
  tipoPrestamoFiltro: string | null = null;

      constructor(private svc: PrestamosService,
                    private messageService: MessageService,
                    private http: HttpClient,
                    private filtrosService: ReportesFiltroService) {}

      async ngOnInit() {
        await this.cargarFiltros();
        await this.cargarEstados();
        await this.reporte();
      }

      private async cargarFiltros() {
        const filtros = await this.filtrosService.cargarFiltros();
        this.dataSede        = filtros.sedes;
        this.dataTipoUsuario = filtros.tipoUsuarios;
        this.dataEscuela     = filtros.especialidades;
        this.dataPrograma    = filtros.programas;
        this.dataCiclo       = filtros.ciclos;
      }

async reporte() {
  if (!this.fechaInicio || !this.fechaFin) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Debe seleccionar un rango de fechas.'
    });
    return;
  }

  this.loading = true;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const fi = `${pad(this.fechaInicio.getDate())}/${pad(this.fechaInicio.getMonth()+1)}/${this.fechaInicio.getFullYear()}`;
  const ff = `${pad(this.fechaFin.getDate())}/${pad(this.fechaFin.getMonth()+1)}/${this.fechaFin.getFullYear()}`;
  const estado = this.tipoPrestamoFiltro ?? undefined;

  try {
    // Forzamos un array vacío si la llamada devolviera undefined
    const data = (await this.svc
      .listar(
        this.sedeFiltro?.id,
        this.tipoUsuarioFiltro?.id,
        estado,
        this.escuelaFiltro?.id,
        this.programaFiltro?.id,
        this.cicloFiltro?.id,
        fi,
        ff,
        'equipos'
      )
      .toPromise()) ?? [];

    this.resultados = data;
  } finally {
    this.loading = false;
  }
}

  async cargarEstados() {
      try {
        const result: any = await this.svc.listarEstados().toPromise();
        if (result.status === 0) {
          this.estadoLista = result.data;
        }
      } catch (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los estados.' });
      }
    }

  get sedeFiltroLabel(): string {
    return this.sedeFiltro?.descripcion ?? 'Todas';
  }

  get programaFiltroLabel(): string {
    return this.programaFiltro?.descripcion ?? 'Todos';
  }

  async exportExcel() {
    if (!this.resultados.length) {
      this.messageService.add({ severity:'warn', detail:'No hay datos para exportar.' });
      return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Estadística');

     const buffer = await this.http
        .get('/assets/logo.png', { responseType: 'arraybuffer' })
        .toPromise();

      // 2) Lo añade a ExcelJS
      const logoId = wb.addImage({ buffer, extension: 'png' });
      ws.addImage(logoId, {
        tl: { col: 0.2, row: 0.2 },
        ext: { width: 220, height: 80 }
      });
      ws.addRows([[], [], [], []]); // espacio para la imagen

    // 2) Título
    ws.mergeCells('C5', 'G6');
    const tituloCell = ws.getCell('C5');
    tituloCell.value = this.titulo;
    tituloCell.alignment = { vertical: 'middle', horizontal: 'center' };
    tituloCell.font = { size: 16, bold: true };
    ws.addRow([]);

    // 3) Filtros
    const filtrosCabecera = construirCabeceraFiltros([
      { etiqueta: 'Sede', valor: this.sedeFiltro?.descripcion, defecto: 'Todas' },
      { etiqueta: 'Tipo Usuario', valor: this.tipoUsuarioFiltro?.descripcion, defecto: 'Todos' },
      {
        etiqueta: 'Estado',
        valor: this.tipoPrestamoLista.find((t) => t.value === this.tipoPrestamoFiltro)?.label,
        defecto: 'Todos'
      },
      { etiqueta: 'Escuela', valor: this.escuelaFiltro?.descripcion, defecto: 'Todas' },
      { etiqueta: 'Programa', valor: this.programaFiltro?.descripcion, defecto: 'Todos' },
      { etiqueta: 'Ciclo', valor: this.cicloFiltro?.descripcion, defecto: 'Todos' },
      { etiqueta: 'Fecha Inicio', valor: formatearFecha(this.fechaInicio), defecto: 'Todos' },
      { etiqueta: 'Fecha Fin', valor: formatearFecha(this.fechaFin), defecto: 'Todos' },
      { etiqueta: 'Fecha emisión', valor: new Date().toLocaleString() }
    ]);
    ws.addRow(filtrosCabecera.etiquetas);
    ws.addRow(filtrosCabecera.valores);
    ws.addRow([]);

    // 4) Encabezados de la tabla
    const headerRow = ws.addRow([ 'Equipo', 'Alcance', 'Usuario', 'Especialidad',
                                                'Sede', 'Usuario Préstamo', 'Fecha Préstamo',
                                                'Usuario Recepción', 'Fecha Recepción' ]);
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: 'center' };

    // 5) Filas de datos
    this.resultados.forEach(r => {
      ws.addRow([
        r.equipo?.nombreEquipo ?? '',
                          r.alcance,
                          r.codigoUsuario ?? r.usuarioPrestamo ?? '',
                          r.especialidad,
                          r.equipo?.sede?.descripcion ?? '',
                          r.usuarioPrestamo,
                          r.fechaPrestamo,
                          r.usuarioRecepcion || '-',
                          r.fechaRecepcion || '-'
      ]);
    });

    // 6) Ajustes estéticos (ancho de columnas, bordes…)
    ws.columns.forEach(col => col.width = 20);

    // 7) Generar y descargar
    const buf = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buf]), 'estadistica_mensual.xlsx');
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
      { etiqueta: 'Tipo Usuario', valor: this.tipoUsuarioFiltro?.descripcion, defecto: 'Todos' },
      {
        etiqueta: 'Estado',
        valor: this.tipoPrestamoLista.find((t) => t.value === this.tipoPrestamoFiltro)?.label,
        defecto: 'Todos'
      },
      { etiqueta: 'Escuela', valor: this.escuelaFiltro?.descripcion, defecto: 'Todas' },
      { etiqueta: 'Programa', valor: this.programaFiltro?.descripcion, defecto: 'Todos' },
      { etiqueta: 'Ciclo', valor: this.cicloFiltro?.descripcion, defecto: 'Todos' },
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
      head: [[
        'Equipo', 'Alcance', 'Usuario', 'Especialidad',
        'Sede', 'Usuario Préstamo', 'Fecha Préstamo',
        'Usuario Recepción', 'Fecha Recepción'
      ]],
      body: this.resultados.map(r => [
        r.equipo?.nombreEquipo ?? '',
        r.alcance ?? '',
        r.codigoUsuario ?? r.usuarioPrestamo ?? '',
        r.especialidad ?? '',
        r.equipo?.sede?.descripcion ?? '',
        r.usuarioPrestamo ?? '',
        r.fechaPrestamo ?? '',
        r.usuarioRecepcion || '-',
        r.fechaRecepcion || '-'
      ]),
      startY: inicioTabla,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    doc.save('estadistica_mensual.pdf');
  };

  img.onerror = () => {
    console.error('No se pudo cargar /assets/logo.png');
  };
    }
}
