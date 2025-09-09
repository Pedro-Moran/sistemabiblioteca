import { Component, OnInit } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { TableModule }    from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule }   from 'primeng/button';
import { TooltipModule }  from 'primeng/tooltip';
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
                                   ToolbarModule],
    template: `
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
  this.loading = true;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const fi = this.fechaInicio
    ? `${pad(this.fechaInicio.getDate())}/${pad(this.fechaInicio.getMonth()+1)}/${this.fechaInicio.getFullYear()}`
    : undefined;
  const ff = this.fechaFin
    ? `${pad(this.fechaFin.getDate())}/${pad(this.fechaFin.getMonth()+1)}/${this.fechaFin.getFullYear()}`
    : undefined;
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


    // 2) Título y fecha
    ws.mergeCells('C1', 'G2');
    const tituloCell = ws.getCell('C1');
    tituloCell.value = 'ESTADÍSTICA MENSUAL DEL SERVICIO';
    tituloCell.alignment = { vertical: 'middle', horizontal: 'center' };
    tituloCell.font = { size: 16, bold: true };

    ws.getCell('C3').value = `Fecha de emisión: ${new Date().toLocaleDateString()}`;

    // 3) Filtros
    ws.getCell('C4').value = `Sede: ${this.sedeFiltroLabel}`;
    ws.getCell('G3').value = `Programa: ${this.programaFiltroLabel}`;
    ws.getCell('A5').value = ``;
    // …

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

  // 1) Crear un elemento Image y apuntar a tu logo en assets
  const img = new Image();
  img.src = '/assets/logo.png';

  img.onload = () => {
    // 2) Añadir la imagen al PDF (x=10, y=10, width=40, height=15)
    doc.addImage(img, 'PNG', 10, 10, 60, 25);

    // 3) Escribir título y fecha
    doc.setFontSize(16);
    doc.text('ESTADÍSTICA MENSUAL DEL SERVICIO', 80, 20);
    doc.setFontSize(10);
    const hoy = new Date();
    doc.text(`Fecha de emisión: ${hoy.toLocaleDateString()}`, 80, 25);

    // 4) Repetir filtros si quieres
    doc.setFontSize(9);
    doc.text(`Sede: ${this.sedeFiltroLabel}`, 80, 30);
    doc.text(`Programa: ${this.programaFiltroLabel}`, 120, 30);
    // … más filtros …

    // 5) Generar la tabla con autoTable
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
      startY: 35,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    // 6) Guardar el PDF
    doc.save('estadistica_mensual.pdf');
  };

  img.onerror = () => {
    console.error('No se pudo cargar /assets/logo.png');
    // Si quieres, puedes seguir sin logo:
    // doc.text('ESTADÍSTICA MENSUAL DEL SERVICIO', 10, 20);
    // autoTable(...)
    // doc.save(...)
  };
    }
}
