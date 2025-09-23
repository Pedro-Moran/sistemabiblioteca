import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
import { Equipo } from '../../../interfaces/biblioteca-virtual/equipo';
import { ModalNuevoOcurencia } from '../../laboratorio-computo/modal-nuevo-ocurrencia';
import { OcurrenciaEventService } from '../../../services/ocurrencia-event.service';

@Component({
  selector: 'app-aceptaciones-equipos',
  standalone: true,
  styles: [
    `.highlight-row { animation: fadeHighlight 2s ease-in-out forwards; }
     @keyframes fadeHighlight { from { background-color: #ffe08a; } to { background-color: transparent; } }
     .pulse { animation: pulse 1s infinite; }
     @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }`
  ],
  template: ` <div class="">
                <div class="">
                    <div class="card flex flex-col gap-4 w-full">
                        <h5>{{titulo}}</h5>
                        <p-toolbar styleClass="mb-6">
            <ng-template #start>
            <div class="flex flex-wrap gap-4">

                        <div class="flex flex-col grow basis-0 gap-2">
                        <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" (onChange)="filtrarPorSede()"/>

                        </div>
                        <div class="flex items-end">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-danger"
                icon="pi pi-search"(click)="listar()" [disabled]="loading"  pTooltip="Filtrar" tooltipPosition="bottom">
            </button>
        </div>

                    </div>
            </ng-template>

        </p-toolbar>

        <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                        [globalFilterFields]="['id','sede.descripcion','nombreEquipo','numeroEquipo','ip','estado.descripcion']" responsiveLayout="scroll">
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
                                <th pSortableColumn="sede.descripcion" style="width: 8rem">Sede<p-sortIcon field="sede.descripcion"></p-sortIcon></th>
                                    <th pSortableColumn="nombreEquipo"  style="min-width:200px">Nombre de equipo<p-sortIcon field="nombreEquipo"></p-sortIcon></th>
                                    <th pSortableColumn="numeroEquipo"  style="min-width:200px">N&uacute;mero equipo<p-sortIcon field="numeroEquipo"></p-sortIcon></th>
                                    <th pSortableColumn="ip" style="width: 8rem">IP<p-sortIcon field="ip"></p-sortIcon></th>
                                    <th pSortableColumn="estado.descripcion" style="width: 8rem">Estado<p-sortIcon field="estado.descripcion"></p-sortIcon></th>
                                    <th style="width: 4rem" >Cargar Equipo</th>
                                    <th style="width:8rem">Ocurrencia</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-objeto>
                                <tr [ngClass]="{ 'highlight-row': objeto.highlight }">
                                    <td>
                                        {{ objeto.sede?.descripcion || '—' }}

                                    </td>
                                    <td>
                                        {{objeto.nombreEquipo}}

                                    </td>
                                    <td>
                                        {{objeto.numeroEquipo}}
                                    </td>
                                    <td>
                                        {{objeto.ip}}
                                    </td>
                                    <td [ngClass]="objeto.estado?.idEstado === 1 ? 'text-primary' : 'text-green-500'">
                                        {{ objeto.estado?.descripcion || '—' }}
                                        </td>
                                    <td class="text-center">
                                    <button
                pButton
                type="button"
                class="p-button-rounded"
                [ngClass]="objeto.tieneOcurrencia ? 'p-button-warning' : 'p-button-success'"
                icon="pi pi-check"
                (click)="cambiarEstadoADisponible(objeto)"
                [disabled]="objeto.tieneOcurrencia"
                [pTooltip]="objeto.tieneOcurrencia ? 'Material con observación' : 'Confirmar'"
                tooltipPosition="bottom">
            </button>
            <span
                *ngIf="objeto.tieneOcurrencia"
                (click)="irAutorizacion(objeto)"
                class="text-xs text-blue-500 underline cursor-pointer block mt-1"
                pTooltip="Autorizar ocurrencia" tooltipPosition="bottom">
                Ver ocurrencia
            </span>

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
  imports: [TemplateModule,TooltipModule, ModalNuevoOcurencia],
  providers: [MessageService, ConfirmationService]
})
export class AceptacionesEquipos implements AfterViewInit {
  titulo: string = "Aceptaciones de Equipos";
  data: any[] = [];
  detalle:any[]=[];
  modulo: string = "aceptaciones";
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
  filtros: ClaseGeneral[] = [];
  expandedRows = {};
  @ViewChild('modalOcurrencia') modal!: ModalNuevoOcurencia;
  selectedEquipoOcurrencia: Equipo | null = null;

  constructor(private bibliotecaVirtualService: BibliotecaVirtualService, private materialBibliograficoService: MaterialBibliograficoService, private genericoService: GenericoService, private fb: FormBuilder,
    private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService,
    private ocurrenciaEvents: OcurrenciaEventService) { }

  ngAfterViewInit(): void {
    this.modal.saved.subscribe(() => {
      if (this.selectedEquipoOcurrencia) {
        this.selectedEquipoOcurrencia.tieneOcurrencia = true;
        this.selectedEquipoOcurrencia.highlight = true;
        const id = this.selectedEquipoOcurrencia.id || this.selectedEquipoOcurrencia.idEquipo;
        if (id) {
          this.ocurrenciaEvents.addEquipo(id);
        }
        const ref = this.selectedEquipoOcurrencia;
        setTimeout(() => ref.highlight = false, 2000);
        this.selectedEquipoOcurrencia = null;
      }
    });

    this.ocurrenciaEvents.ocurrenciaAutorizada.subscribe(() => {
      if (this.sedeFiltro && this.sedeFiltro.id && this.sedeFiltro.id !== 0) {
        this.filtrarPorSede();
      } else {
        this.listar();
      }
    });
  }

  async ngOnInit() {
    // this.user = this.authService.getUser();
    this.user = {
      "idusuario": 0
    }
    await this.ListaSede();
    await this.listar();
    this.detalle=[
        {
            "sede":{"id":1,"descripcion": "Sede A", "activo": true},
            "nroIngreso":"39819",
            "tipoAdquisicion":{"id":1,"descripcion": "Tipo A", "activo": true},
            "tipoMaterial":{"id":1,"descripcion": "Tipo A", "activo": true},
            "fechaIngreso":"14/11/2016",
            "estado":{"id":1,"descripcion": "En proceso", "activo": true}
        }
    ]
  }

onAbrirOcurrencia(item: any) {
  this.selectedEquipoOcurrencia = item;
  this.modal.openModal(item);
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
      const result: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
      if (result.status === 0) {
        this.dataSede = result.data;
        let sedes = [{ id: 0, descripcion: 'TODAS LAS SEDES', activo: true, estado: 1 }, ...this.dataSede];

        this.dataSede = sedes;
        this.sedeFiltro = this.dataSede[0];
      }
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
    }

  }
  async listar() {
    this.loading = true;
    this.data = [];

    this.bibliotecaVirtualService.listarEquiposEnProceso()
      .subscribe(
        (result: any) => {
          this.loading = false;
          if (result.status == 0) {
            this.data = result.data;
            this.applyPersistedPending();
          }
        }
        , (error: HttpErrorResponse) => {
          this.loading = false;
        }
      );

    this.loading = false;
  }
  cambiarEstadoRegistro(objeto: Ejemplar) {
    let estado = "";
    if (objeto.activo) {
      estado = "Desactivar";
    } else {
      estado = "Activar"
    }
    this.confirmationService.confirm({
      message: '¿Estás seguro(a) de que quieres cambiar el estado: ' + objeto.codigo + ' a ' + estado + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
        this.loading = true;
        const data = { id: objeto.id, activo: !objeto.activo, idusuario: this.user.idusuario };
        this.genericoService.conf_event_put(data, this.modulo + '/activo')
          .subscribe(result => {
            if (result.p_status == 0) {
              this.objetoDialog = false;
              this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Estado de registro satisfactorio.' });
              this.listar();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
            }
            this.loading = false;
          }
            , (error: HttpErrorResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
              this.loading = false;
            });
      }
    });
  }
  showMenu(event: MouseEvent, selectedItem: any) {
    this.selectedItem = selectedItem;
    this.menu.toggle(event);
  }

  verDetalle(objeto:any){

  }

  irAutorizacion(equipo: Equipo): void {
    const id = equipo.id || equipo.idEquipo;
    if (id) {
      this.ocurrenciaEvents.setDestino(id);
    }
    this.router.navigate(['/main/laboratorio-computo/ocurrencias']);
  }

cambiarEstadoADisponible(equipo: Equipo): void {
  // Extrae el id comprobando si existe 'id' o 'idEquipo'
  const equipoId = equipo.id || equipo.idEquipo;
  if (!equipoId) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'El equipo no tiene un ID válido para cambiar su estado.'
    });
    return;
  }

  if (equipo.tieneOcurrencia) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Material con observación pendiente.'
    });
    return;
  }

  // Muestra un cuadro de confirmación
  this.confirmationService.confirm({
    message: '¿Seguro que desea cambiar de estado a DISPONIBLE?',
    header: 'Confirmar cambio de estado',
    icon: 'pi pi-info-circle',
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    accept: () => {
      // Llama al servicio para cambiar el estado enviando el id correcto y el estado "DISPONIBLE"
      this.bibliotecaVirtualService.cambiarEstado(equipoId, 'DISPONIBLE')
        .subscribe(
          (result: any) => {
            if (result.status === 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Estado modificado',
                detail: 'El equipo ahora está DISPONIBLE.'
              });
              if (equipo.tieneOcurrencia) {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Advertencia',
                  detail: 'Este registro tiene una ocurrencia.'
                });
              }
              // Puedes volver a filtrar o recargar la lista para reflejar el cambio
              this.filtrarPorSede();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: result.message || 'No se pudo cambiar el estado.'
              });
            }
          },
          (error: HttpErrorResponse) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error. Inténtelo más tarde.'
            });
          }
        );
    },
    reject: () => {
      this.messageService.add({
        severity: 'warn',
        summary: 'Cancelado',
        detail: 'El estado no se ha modificado.'
      });
    }
  });
}




  filtrarPorSede() {
        if (this.sedeFiltro && this.sedeFiltro.id) {
      this.bibliotecaVirtualService.filtrarPorSedeEnProcesp(this.sedeFiltro.id).subscribe(
              (result: any) => {
                this.loading = false;
                if (result.status == "0") {
                  this.data = result.data;
                  this.applyPersistedPending();
                }
              }
              , (error: HttpErrorResponse) => {
                this.loading = false;
              }
            );
        } else {
          this.listar();
        }
      }


  onRowExpand(event: TableRowExpandEvent) {
}

onRowCollapse(event: TableRowCollapseEvent) {
}
  private applyPersistedPending(): void {
    this.data.forEach(e => {
      const id = e.id || e.idEquipo;
      e.tieneOcurrencia = this.ocurrenciaEvents.tieneOcurrencia(id);
    });
  }
}
