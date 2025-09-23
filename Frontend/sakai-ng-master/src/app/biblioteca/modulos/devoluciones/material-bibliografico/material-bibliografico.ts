import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

import { Message } from 'primeng/message';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';

import { TooltipModule } from 'primeng/tooltip';
import { ClaseGeneral } from '../../../interfaces/clase-general';

import { Sedes } from '../../../interfaces/sedes';

import { AuthService } from '../../../services/auth.service';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
import { ModalNuevoOcurencia } from '../../laboratorio-computo/modal-nuevo-ocurrencia';

import { Tipo } from '../../../interfaces/prestamos/tipo';
import { PrestamosService } from '../../../services/prestamos.service';
import { DetalleBibliotecaDTO } from '../../../interfaces/material-bibliografico/biblioteca.model';

interface PrestamoUsuario {
  codigoUsuario: string;
  nombreUsuario: string;
  documentoUsuario?: string | null;
  correoUsuario?: string | null;
  tipoPrestamo: string | null;
  cantidad: number;
  detalles: DetalleBibliotecaDTO[];
}

@Component({
    selector: 'app-aceptaciones',
    standalone: true,
    template: ` <div class="">
                <div class="">
                    <div class="card flex flex-col gap-4 w-full">
                        <h5>{{titulo}}</h5>
                        <p-toolbar styleClass="mb-6">
            <ng-template #start>
            <div class="flex flex-wrap gap-4">

                        <div class="flex flex-col grow basis-0 gap-2">
                        <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" (ngModelChange)="listar()" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">

                        <label for="tipo" class="block text-sm font-medium">Tipo</label>
                        <p-select [(ngModel)]="tipoFiltro" [options]="dataTipo" optionLabel="descripcion" placeholder="Seleccionar" (ngModelChange)="listar()" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                        <label for="tipo-busqueda" class="block text-sm font-medium">Buscar por</label>
                        <p-select [(ngModel)]="campoBusqueda" [options]="opcionesBusqueda" optionLabel="label" optionValue="value" placeholder="Seleccionar" (ngModelChange)="aplicarFiltros()" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                        <label for="palabra-clave" class="block text-sm font-medium">Palabra clave</label>
                                <input [(ngModel)]="palabraClave" (ngModelChange)="aplicarFiltros()" pInputText id="palabra-clave" type="text" placeholder="Palabra clave"/>
                        </div>
                        <div class="flex items-end">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-danger"
                icon="pi pi-search"(click)="listar()" [disabled]="loading"  pTooltip="Filtrar" tooltipPosition="bottom">
            </button>
        </div><div class="flex items-end">
        <button
        pButton
        type="button"
        class="p-button-rounded p-button-danger"
        icon="pi pi-trash"
        (click)="limpiar()"pTooltip="Limpiar" tooltipPosition="bottom">
    </button>
        </div>

                    </div>
            </ng-template>

        </p-toolbar>

                        <p-table #dt1 [value]="prestadosDetalle" dataKey="codigoUsuario" [rows]="10"
                        [showCurrentPageReport]="true"
                        [expandedRowKeys]="expandedRows" (onRowExpand)="onRowExpand($event)" (onRowCollapse)="onRowCollapse($event)"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                        [globalFilterFields]="['nombreUsuario','tipoPrestamo']" responsiveLayout="scroll">
                        <ng-template pTemplate="caption">

                       <div class="flex items-center justify-between">
               <p-button [outlined]="true" icon="pi pi-filter-slash" label="Limpiar" (click)="clear(dt1)" />

               <p-iconfield>
                   <input pInputText type="text" placeholder="Filtrar" #filter (input)="onGlobalFilter(dt1, $event)"/>
               </p-iconfield>
           </div>
                       </ng-template>
                            <ng-template pTemplate="header">
                                <tr>
                                <th style="width: 5rem"></th>
                                    <th ></th>
                                    <th pSortableColumn="nombreUsuario" style="min-width:200px">Apellidos y Nombres<p-sortIcon field="nombreUsuario"></p-sortIcon></th>
                                 <th pSortableColumn="tipoPrestamo" style="width: 8rem">Tipo<p-sortIcon field="tipoPrestamo"></p-sortIcon></th>
                                    <th pSortableColumn="cantidad" style="width: 4rem">Cantidad<p-sortIcon field="cantidad"></p-sortIcon></th>

                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-detalle let-expanded="expanded">
                                <tr>
                                <td>
                <p-button type="button" pRipple [pRowToggler]="detalle" [text]="true" [rounded]="true" [plain]="true" [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
            </td>
                                <td>
                                <i class="pi pi-user" style="font-size: 2.5rem"></i>
                                <!--<img [src]="objeto.foto" [alt]="objeto.nombres" width="50" class="shadow-lg" />-->

                                    </td>
                                <td>{{detalle.nombreUsuario}}
                                    </td>
                                    <td>
                                        {{ getTipoPrestamoDescripcion(detalle.tipoPrestamo) }}

                                    </td>
                                    <td>
                                        {{detalle.cantidad || '—'}}

                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template #expandedrow let-detalle>
                            <tr>
                            <td colspan="8">


                            <p-table
    [value]="detalle.detalles"
    showGridlines
    [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template pTemplate="header">
            <tr>
                <th>Título</th>
                <th>Código</th>
                <th>N.I</th>
                <th>Fecha de préstamo</th>
                <th>Hora de préstamo</th>
                <th>Devolver</th>
                <th>Ocurrencia</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-bib>
            <tr>
                <td>{{ bib.biblioteca?.titulo || '-' }}</td>
                <td>{{ bib.biblioteca?.id }}</td>
                <td>{{ bib.numeroIngreso }}</td>
                <td>
                    <div>Fecha inicio: {{ bib.fechaPrestamo ? (bib.fechaPrestamo | date:'dd-MM-yyyy') : '-' }}</div>
                    <div>Fecha fin: {{ bib.fechaDevolucion ? (bib.fechaDevolucion | date:'dd-MM-yyyy') : '-' }}</div>
                </td>
                <td>
                    <div>Hora inicio: {{ bib.horaInicio || '-' }}</div>
                    <div>Hora fin: {{ bib.horaFin || '-' }}</div>
                </td>
                <td>
                <p-button icon="pi pi-check" rounded outlined (click)="devolver(bib)" pTooltip="Devolver" tooltipPosition="bottom"/>
                </td>
                <td>
                <p-button icon="pi pi-file" rounded outlined pTooltip="Registrar ocurrencia" tooltipPosition="bottom" (click)="onAbrirOcurrencia(bib)" />
                </td>
            </tr>
        </ng-template>
</p-table>
</td>
</tr>
                            </ng-template>
                            <ng-template pTemplate="emptymessage">
                                <tr>
                                    <td colspan="8">No se encontraron registros.</td>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="loadingbody">
                                <tr>
                                    <td colspan="8">Cargando datos. Espere por favor.</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    <app-modal-nuevo-ocurrencia #modalOcurrencia></app-modal-nuevo-ocurrencia>
                    </div>

                </div>
            </div>


            <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
    imports: [TemplateModule, TooltipModule, ModalNuevoOcurencia],
    providers: [MessageService, ConfirmationService]
})
export class DevolucionMaterialBibliografico implements OnInit {
    titulo: string = "Devoluciones";
    prestadosDetalle: PrestamoUsuario[] = [];
    expandedRows: { [key: string]: boolean } = {};

    loading: boolean = true;

    objetoDialog!: boolean;
    msgs: Message[] = [];

    user: any;

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('modalOcurrencia') modal!: ModalNuevoOcurencia;
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    dataTipo: Tipo[] = [];
    tipoFiltro: Tipo = new Tipo();
    filtros: ClaseGeneral[] = [];
    opcionFiltro: ClaseGeneral = new ClaseGeneral();
    palabraClave: string = "";
    opcionesBusqueda = [
      { label: 'Nombres', value: 'nombre' },
      { label: 'N° Documento', value: 'documento' },
      { label: 'Email', value: 'email' },
    ];
    campoBusqueda: string = 'nombre';
    private todosDetallesPrestados: DetalleBibliotecaDTO[] = [];
    private usuarioCache = new Map<string, { nombre: string; correo: string; documento: string }>();

    constructor(private prestamosService: PrestamosService,private materialBibliograficoService: MaterialBibliograficoService, private genericoService: GenericoService,
        private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
    async ngOnInit() {
        // this.user = this.authService.getUser();
        this.user = {
            "idusuario": 0
        }
        await this.ListaSede();
        await this.ListaTipo();
        this.listar();
    }

    async ListaTipo() {
        try {
          const result: any = await this.prestamosService.api_prestamos_tipos('conf/tipo-lista').toPromise();
          if (result.status === "0") {
            this.dataTipo = result.data.map((t: any) => ({
              ...t,
              codigo: this.mapDescripcionTipoToCodigo(t.descripcion)
            }));
            this.dataTipo = [{ id: 0, descripcion: 'TODOS', activo: true, codigo: null }, ...this.dataTipo];
            this.tipoFiltro = this.dataTipo[0];
          }
        } catch (error) {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
      }

    }

    private mapDescripcionTipoToCodigo(desc: string): string {
        const normalized = desc
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .trim().toUpperCase().replace(/\s+/g, '_');
        switch (normalized) {
          case 'EN_SALA':
          case 'PRESTAMO_EN_SALA':
            return 'PRESTAMO_EN_SALA';
          case 'A_DOMICILIO':
          case 'PRESTAMO_A_DOMICILIO':
            return 'PRESTAMO_A_DOMICILIO';
          case 'SALA_Y_DOMICILIO':
          case 'EN_SALA_DOMICILIO':
          case 'PRESTAMO_SALA_DOMICILIO':
          case 'SALAYDOMICILIO':
            return 'PRESTAMO_SALA_DOMICILIO';
          default:
            return normalized;
        }
    }

    limpiar() {
        this.palabraClave = "";  // Resetea el campo de búsqueda
        this.sedeFiltro = this.dataSede[0];
        this.tipoFiltro = this.dataTipo[0];
        this.campoBusqueda = 'nombre';
        this.listar();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }



    async ListaSede() {
        try {
            const result: any = await this.genericoService
                .sedes_get('api/equipos/sedes')
                .toPromise();
            const sedes = [
                { id: 0, descripcion: 'TODOS', activo: true, estado: 1 },
                ...((Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : []))
            ];
            this.dataSede = sedes;
            this.sedeFiltro = this.dataSede[0];
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudieron cargar sedes' });
        }

    }
    listar(): void {
        this.cargarTodosDetallesPrestados();
    }

    private cargarTodosDetallesPrestados(): void {
        const sedeId = this.sedeFiltro?.id && this.sedeFiltro.id !== 0 ? this.sedeFiltro.id : undefined;
        const tipoCodigo = this.tipoFiltro?.codigo ? this.tipoFiltro.codigo : undefined;
        this.loading = true;
        this.materialBibliograficoService.listarDetallesPrestados(sedeId, tipoCodigo)
            .subscribe({
                next: (lista: DetalleBibliotecaDTO[]) => {
                    this.todosDetallesPrestados = lista;
                    this.completarNombres(this.todosDetallesPrestados)
                        .finally(() => {
                            this.aplicarFiltros();
                            this.loading = false;
                        });
                },
                error: () => {
                    this.loading = false;
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los ejemplares prestados.' });
                }
            });
    }

    private async completarNombres(prestamos: DetalleBibliotecaDTO[]): Promise<void> {
        const codigos = Array.from(new Set(
            prestamos
                .map(p => p.codigoUsuario)
                .filter((c): c is string => !!c && !this.usuarioCache.has(c))
        ));

        const promesas = codigos.map(async codigo => {
            const usuarios = await this.materialBibliograficoService
                .listarUsuarios(codigo)
                .toPromise();
            const u = usuarios?.[0];
            const nombre = u
                ? ([u.apellidoPaterno, u.apellidoMaterno, u.nombreUsuario || u.nombres]
                    .filter(Boolean)
                    .join(' ')
                    .trim() || u.displayname || '')
                : '';
            const correo = u?.email || '';
            const documento = String(u?.numerodocumento || u?.numDocumento || u?.numeroDocumento || '');
            this.usuarioCache.set(codigo, { nombre, correo, documento });
        });

        await Promise.all(promesas);

        prestamos.forEach(p => {
            const info = p.codigoUsuario ? this.usuarioCache.get(p.codigoUsuario) : undefined;
            if (info) {
                if (!p.nombreUsuario) {
                    p.nombreUsuario = info.nombre;
                }
                if (!p.correoUsuario) {
                    p.correoUsuario = info.correo;
                }
                if (!p.documentoUsuario && info.documento) {
                    p.documentoUsuario = info.documento;
                }
            }
        });
    }

    aplicarFiltros(): void {
        const termino = this.palabraClave?.trim().toLowerCase() || '';
        const sedeId = this.sedeFiltro?.id && this.sedeFiltro.id !== 0 ? this.sedeFiltro.id : null;
        const tipoCodigo = this.tipoFiltro?.codigo || null;

        const filtrados = this.todosDetallesPrestados.filter(det => {
            const valorBusqueda = (() => {
                switch (this.campoBusqueda) {
                    case 'documento':
                        return det.documentoUsuario;
                    case 'email':
                        return det.correoUsuario;
                    case 'nombre':
                    default:
                        return det.usuarioPrestamo ?? det.nombreUsuario;
                }
            })()?.toLowerCase() || '';

            const coincideTermino = !termino || valorBusqueda.includes(termino);
            const coincideSede = !sedeId || det.codigoSede === sedeId;
            const coincideTipo = !tipoCodigo || this.mapDescripcionTipoToCodigo(det.tipoPrestamo ?? '') === tipoCodigo;

            return coincideTermino && coincideSede && coincideTipo;
        });
        this.prestadosDetalle = this.agruparPorUsuario(filtrados);
    }

    onRowExpand(event: TableRowExpandEvent) {
        this.expandedRows[event.data.codigoUsuario] = true;
    }

    onRowCollapse(event: TableRowCollapseEvent) {
        delete this.expandedRows[event.data.codigoUsuario];
    }

    private agruparPorUsuario(detalles: DetalleBibliotecaDTO[]): PrestamoUsuario[] {
        const mapa = new Map<string, PrestamoUsuario>();

        detalles.forEach(det => {
            const codigo = det.codigoUsuario ?? 'DESCONOCIDO';
            const nombre = det.usuarioPrestamo ?? det.nombreUsuario ?? '';
            const documento = det.documentoUsuario ?? null;
            const correo = det.correoUsuario ?? null;
            if (!mapa.has(codigo)) {
                mapa.set(codigo, {
                    codigoUsuario: codigo,
                    nombreUsuario: nombre,
                    documentoUsuario: documento,
                    correoUsuario: correo,
                    tipoPrestamo: det.tipoPrestamo ?? null,
                    cantidad: 0,
                    detalles: []
                });
            }
            const entry = mapa.get(codigo)!;
            entry.detalles.push(det);
            entry.cantidad = entry.detalles.length;
            entry.tipoPrestamo ??= det.tipoPrestamo ?? null;
            if (!entry.nombreUsuario && nombre) {
                entry.nombreUsuario = nombre;
            }
            if (!entry.documentoUsuario && documento) {
                entry.documentoUsuario = documento;
            }
            if (!entry.correoUsuario && correo) {
                entry.correoUsuario = correo;
            }
        });

        return Array.from(mapa.values());
    }

    getTipoPrestamoDescripcion(tipo?: string | null): string {
        const normalized = tipo ? tipo.trim().toUpperCase().replace(/\s+/g, '_') : '';
        switch (normalized) {
            case 'PRESTAMO_EN_SALA':
            case 'EN_SALA':
                return 'En sala';
            case 'PRESTAMO_A_DOMICILIO':
            case 'A_DOMICILIO':
                return 'A domicilio';
            case 'PRESTAMO_SALA_DOMICILIO':
            case 'EN_SALA_DOMICILIO':
            case 'SALAYDOMICILIO':
            case 'SALA_Y_DOMICILIO':
                return 'Sala y domicilio';
            default:
                return tipo ?? '';
        }
    }

    onAbrirOcurrencia(item: any) {
        this.modal.openModal(item);
    }

    devolver(objeto: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de recepcionar el ejemplar?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
              this.loading = true;
              this.materialBibliograficoService.devolverDetalle(objeto.idDetalleBiblioteca)
                .subscribe({
                  next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Ejemplar devuelto.' });
                    this.listar();
                  },
                  error: (_: HttpErrorResponse) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
                  }
                }).add(() => this.loading = false);
            }
          });
    }
    regularizarPrestamo(){

    }
}
