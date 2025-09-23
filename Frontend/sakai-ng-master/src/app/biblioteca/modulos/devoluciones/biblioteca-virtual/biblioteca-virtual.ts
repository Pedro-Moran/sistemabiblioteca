import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { ClaseGeneral } from '../../../interfaces/clase-general';
import { Ejemplar } from '../../../interfaces/detalle';
import { EstadoRecurso } from '../../../interfaces/estado-recurso';
import { Sedes } from '../../../interfaces/sedes';
import { TipoRecurso } from '../../../interfaces/tipo-recurso';
import { AuthService } from '../../../services/auth.service';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
import { BibliotecaVirtualService } from '../../../services/biblioteca-virtual.service';
import { Tipo } from '../../../interfaces/prestamos/tipo';
import { PrestamosService } from '../../../services/prestamos.service';
import { ModalNuevoOcurencia } from '../../laboratorio-computo/modal-nuevo-ocurrencia';


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
                              <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion"
                                placeholder="Seleccionar sede" (onChange)="onSedeChange($event.value)"
                                [style.width.px]="200"></p-select>

                            </div>
                            <div class="flex flex-col grow basis-0 gap-2">

                              <label for="tipo" class="block text-sm font-medium">Tipo</label>
                              <p-select [(ngModel)]="tipoFiltro" [options]="dataTipo" optionLabel="descripcion"
                                placeholder="Seleccionar" (ngModelChange)="aplicarFiltros()" />

                            </div>
                            <div class="flex flex-col grow basis-0 gap-2">
                              <label for="palabra-clave" class="block text-sm font-medium">Palabra clave</label>
                              <input [(ngModel)]="palabraClave" pInputText id="palabra-clave" type="text" placeholder="Palabra clave" />
                            </div>
                            <div class="flex flex-col grow basis-0 gap-2">
                              <label class="block text-sm font-medium invisible">Placeholder</label>
                              <div class="flex items-center gap-2">
                                <p-checkbox id="checkDiscapacidad" name="option" [(ngModel)]="discapacidadFiltro" [binary]="true" (onChange)="aplicarFiltros()"></p-checkbox>
                                <label for="checkDiscapacidad" class="text-sm">¿Equipos con discapacidad?</label>
                              </div>
                            </div>
                            <div class="flex items-end">
                              <button pButton type="button" class="p-button-rounded p-button-danger" icon="pi pi-search"
                                (click)="aplicarFiltros()" [disabled]="loading" pTooltip="Filtrar" tooltipPosition="bottom">
                              </button>
                            </div>
                            <div class="flex items-end">
                              <button pButton type="button" class="p-button-rounded p-button-danger" icon="pi pi-trash"
                                (click)="limpiar()" pTooltip="Limpiar" tooltipPosition="bottom">
                              </button>
                            </div>

                          </div>
                        </ng-template>

                      </p-toolbar>

                      <p-table #dt1 [value]="data" dataKey="id" [rows]="10" [showCurrentPageReport]="true"
                        [expandedRowKeys]="expandedRows" (onRowExpand)="onRowExpand($event)" (onRowCollapse)="onRowCollapse($event)"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines"
                        [paginator]="true"
                        [globalFilterFields]="['id','usuario','nombreEquipo','numeroEquipo','ip','estado.descripcion','fechaPrestamo']"
                        responsiveLayout="scroll">
                        <ng-template pTemplate="caption">

                          <div class="flex items-center justify-between">
                            <p-button [outlined]="true" icon="pi pi-filter-slash" label="Limpiar" (click)="clear(dt1)" />

                            <p-iconfield>
                              <input pInputText type="text" placeholder="Filtrar" #filter (input)="onGlobalFilter(dt1, $event)" />
                            </p-iconfield>
                          </div>
                        </ng-template>
                        <ng-template pTemplate="header">
                          <tr>
                            <th></th>
                            <th pSortableColumn="nombres" style="min-width:200px">Usuario<p-sortIcon field="nombres"></p-sortIcon></th>
                            <th pSortableColumn="nombreEquipo" style="width: 4rem">Equipo<p-sortIcon field="nombreEquipo"></p-sortIcon>
                            </th>
                            <th pSortableColumn="numeroEquipo" style="width: 4rem">N&uacute;mero<p-sortIcon
                                field="numeroEquipo"></p-sortIcon></th>
                            <th pSortableColumn="ip" style="width: 8rem">Dirección IP<p-sortIcon field="ip"></p-sortIcon></th>
                            <th pSortableColumn="estado.descripcion" style="width: 8rem">Estado<p-sortIcon
                                field="estado.descripcion"></p-sortIcon></th>
                            <th pSortableColumn="fechaPrestamo" style="width: 8rem">Fecha de préstamo<p-sortIcon
                                field="fechaPrestamo"></p-sortIcon></th>
                            <th style="width: 8rem">Devolver</th>
                            <th style="width:8rem">Ocurrencia</th>
                          </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-objeto let-expanded="expanded">
                          <tr>

                            <td>
                              <i class="pi pi-user" style="font-size: 2.5rem"></i>
                              <!--<img [src]="objeto.foto" [alt]="objeto.nombres" width="50" class="shadow-lg" />-->

                            </td>
                            <td>{{objeto.usuarioPrestamo || objeto.nombreUsuario || objeto.usuario}}
                            </td>
                            <td>
                              {{objeto.equipo?.nombreEquipo || objeto.nombreEquipo}}

                            </td>
                            <td>
                              {{objeto.equipo?.numeroEquipo || objeto.numeroEquipo}}
                            </td>
                            <td>
                              {{objeto.equipo?.ip || objeto.ip}}
                            </td>
                            <td>
                              {{objeto.estado?.descripcion || objeto.estado}}
                            </td>
                            <td>
                              {{objeto.fechaPrestamo | date:'dd-MM-yyyy'}}
                            </td>
                            <td>
                              <p-button icon="pi pi-check" rounded outlined (click)="devolver(objeto)" pTooltip="Devolver"
                                tooltipPosition="bottom" />

                            </td>
                            <td>
                               <p-button
                                 icon="pi pi-file"
                                 rounded
                                 outlined
                                 pTooltip="Registrar ocurrencia"
                                 tooltipPosition="bottom"
                                 (click)="onAbrirOcurrencia(objeto)"
                               ></p-button>
                            </td>
                          </tr>
                        </ng-template>

                        <ng-template pTemplate="emptymessage">
                          <tr>
                            <td colspan="9">No se encontraron registros.</td>
                          </tr>
                        </ng-template>
                        <ng-template pTemplate="loadingbody">
                          <tr>
                            <td colspan="9">Cargando datos. Espere por favor.</td>
                          </tr>
                        </ng-template>
                      </p-table>
                      <app-modal-nuevo-ocurrencia #modalOcurrencia></app-modal-nuevo-ocurrencia>
                    </div>

                  </div>
                </div>


                <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
                <p-toast></p-toast>`,
    imports: [TemplateModule, TooltipModule, ModalNuevoOcurencia ],
    providers: [MessageService, ConfirmationService]
})
export class DevolucionBibliotecaVirtual implements OnInit {
    titulo: string = "Devoluciones";
    data: any[] = [];
    detalle: any[] = [];
    loading: boolean = true;
    objeto: Ejemplar = new Ejemplar();
    objetoDialog!: boolean;
    msgs: Message[] = [];
    form: FormGroup = new FormGroup({});
    user: any;
    selectedItem: any;
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    dataTipo: Tipo[] = [];
    tipoFiltro: Tipo = new Tipo();
    filtros: ClaseGeneral[] = [];
    opcionFiltro: ClaseGeneral = new ClaseGeneral();
    palabraClave: string = "";
    discapacidadFiltro: boolean = false;
    expandedRows = {};
    todosPrestamos: any[] = [];
    @ViewChild('modalOcurrencia') modal!: ModalNuevoOcurencia;

    constructor(private bibliotecaVirtualService: BibliotecaVirtualService, private prestamosService: PrestamosService,private materialBibliograficoService: MaterialBibliograficoService, private genericoService: GenericoService, private fb: FormBuilder,
        private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
    async ngOnInit() {
        // this.user = this.authService.getUser();
        this.user = {
            "idusuario": 0
        }
//         await this.ListaSede();
        await this.cargarSedes();
        await this.ListaTipo();
        await this.listar();
        this.detalle = [
            {
                "coleccion": { "id": 1, "descripcion": "Libro", "activo": true },
                "codigo": "344.2/M/4",
                "numeroIngreso": "39819",
                "titulo": "Titulo",
                "fechaReserva": "14/11/2025 17:40:10",
                "fechaPrestamo": "14/11/2025 17:40:10"
            }
        ]
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
        this.tipoFiltro = this.dataTipo[0];
        this.discapacidadFiltro = false;
        this.sedeFiltro = this.dataSede[0];
        this.listar();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    aplicarFiltros() {
        const termino = this.palabraClave.trim().toLowerCase();
        const tipoCodigo = this.tipoFiltro?.codigo || null;
        const requiereDiscapacidad = this.discapacidadFiltro;

        this.data = this.todosPrestamos.filter(item => {
            const coincideTipo = !tipoCodigo || this.mapDescripcionTipoToCodigo(item.tipoPrestamo ?? '') === tipoCodigo;
            const coincideDiscapacidad = !requiereDiscapacidad || !!item.equipo?.discapacidad;
            const textoBusqueda = [
                item.usuarioPrestamo,
                item.nombreUsuario,
                item.usuario,
                item.correoUsuario,
                item.documentoUsuario,
                item.equipo?.nombreEquipo,
                item.equipo?.numeroEquipo,
                item.equipo?.ip
            ]
                .map(v => String(v || '').toLowerCase())
                .some(v => v.includes(termino));
            const coincidePalabra = !termino || textoBusqueda;
            return coincideTipo && coincideDiscapacidad && coincidePalabra;
        });
    }


    private async cargarSedes() {
    try {
      const res: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
      if (res.status === 0) {
        // prepende “Todas las sedes”
        this.dataSede = [{ id: '0', descripcion: 'TODAS LAS SEDES', activo: true }, ...res.data];
      }
    } catch {
      this.messageService.add({ severity: 'error', detail: 'No se pudieron cargar las sedes.' });
    }
  }
onAbrirOcurrencia(item: any) {
  this.modal.openModal(item);
}

    async ListaSede() {
        try {
            const result: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
            if (result.status === "0") {
                this.dataSede = result.data;
                let sedes = [{ id: 0, descripcion: 'TODOS', activo: true, estado: 1 }, ...this.dataSede];

                this.dataSede = sedes;
                this.sedeFiltro = this.dataSede[0];
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }

    }
    listar() {
        this.loading = true;
        const sedeId = this.sedeFiltro?.id || 0;
        this.bibliotecaVirtualService.listarDevoluciones(sedeId)
          .subscribe({
            next: r => {
              this.todosPrestamos = (r.data || []).map(item => ({
                ...item,
                equipo: {
                  ...item.equipo,
                  nombreEquipo:
                    item.equipo?.nombreEquipo ??
                    item.nombreEquipo ??
                    item.equipoNombre ??
                    '',
                  numeroEquipo:
                    item.equipo?.numeroEquipo ??
                    item.numeroEquipo ??
                    item.numero ??
                    '',
                  ip:
                    item.equipo?.ip ??
                    item.ip ??
                    item.direccionIp ??
                    item.direccionIP ??
                    ''
                }
              }));
              this.aplicarFiltros();
              this.loading = false;
            },
            error: (_: HttpErrorResponse) => {
              this.messageService.add({ severity: 'error', detail: 'Error al cargar devoluciones.' });
              this.loading = false;
            }
          });
      }
    showMenu(event: MouseEvent, selectedItem: any) {
        this.selectedItem = selectedItem;
        this.menu.toggle(event);
    }

    devolver(objeto: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de recepcionar el equipo de computo?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
            this.loading = true;
            this.bibliotecaVirtualService.devolver(objeto.id)
              .subscribe({
                next: res => {
                  if (res.status === '0') {
                    this.messageService.add({ severity: 'success', detail: 'Devolución registrada.' });
                    this.listar();   // recargar la lista
                  } else {
                    this.messageService.add({ severity: 'error', detail: 'No se pudo devolver.' });
                  }
                },
                error: () => {
                  this.messageService.add({ severity: 'error', detail: 'Error de red al devolver.' });
                }
              })
              .add(() => this.loading = false);
          }
        });
      }

    onRowExpand(event: TableRowExpandEvent) {
    }

    onRowCollapse(event: TableRowCollapseEvent) {
    }
    regularizarPrestamo(){

    }

    onSedeChange(sede: Sedes) {
      this.sedeFiltro = sede;
      this.listar();
    }
}
