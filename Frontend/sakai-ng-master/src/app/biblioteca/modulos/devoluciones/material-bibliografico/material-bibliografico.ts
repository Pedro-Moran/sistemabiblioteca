import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';

import { Message } from 'primeng/message';
import { Table } from 'primeng/table';

import { TooltipModule } from 'primeng/tooltip';
import { ClaseGeneral } from '../../../interfaces/clase-general';

import { Sedes } from '../../../interfaces/sedes';

import { AuthService } from '../../../services/auth.service';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';

import { Tipo } from '../../../interfaces/prestamos/tipo';
import { PrestamosService } from '../../../services/prestamos.service';
import { DetalleBibliotecaDTO } from '../../../interfaces/material-bibliografico/biblioteca.model';

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
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">

                        <label for="tipo" class="block text-sm font-medium">Tipo</label>
                        <p-select [(ngModel)]="tipoFiltro" [options]="dataTipo" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                        <label for="palabra-clave" class="block text-sm font-medium">Palabra clave</label>
                                <input [(ngModel)]="palabraClave"pInputText id="palabra-clave" type="text" placeholder="Palabra clave"/>
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

                        <p-table #dt1 [value]="data" dataKey="idDetalleBiblioteca" [rows]="10"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                        [globalFilterFields]="['biblioteca.titulo','sede.descripcion','numeroIngreso','estadoDescripcion']" responsiveLayout="scroll">
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
                                    <th pSortableColumn="biblioteca.titulo" style="min-width:200px">Título<p-sortIcon field="biblioteca.titulo"></p-sortIcon></th>
                                    <th pSortableColumn="sede.descripcion" style="width: 8rem">Sede<p-sortIcon field="sede.descripcion"></p-sortIcon></th>
                                    <th pSortableColumn="numeroIngreso" style="width: 5rem">N.I.<p-sortIcon field="numeroIngreso"></p-sortIcon></th>
                                    <th pSortableColumn="estadoDescripcion" style="width: 8rem">Estado<p-sortIcon field="estadoDescripcion"></p-sortIcon></th>
                                    <th pSortableColumn="fechaReserva" style="width: 8rem">Fecha de préstamo<p-sortIcon field="fechaReserva"></p-sortIcon></th>
                                    <th style="width: 6rem">Devolver</th>
                                    <th style="width: 6rem">Cancelar</th>
                                </tr>
                            </ng-template>
                             <ng-template pTemplate="body" let-objeto>
                                <tr>
                                     <td>{{ objeto.biblioteca?.titulo }}</td>
                                     <td>{{ objeto.sede?.descripcion }}</td>
                                     <td>{{ objeto.numeroIngreso }}</td>
                                     <td>{{ objeto.estadoDescripcion }}</td>
                                     <td>{{ objeto.fechaReserva }}</td>
                                    <td>
                                        <p-button icon="pi pi-check" rounded outlined (click)="devolver(objeto)" pTooltip="Devolver" tooltipPosition="bottom"/>
                </td>
                <td>
                                        <p-button icon="pi pi-times" rounded outlined (click)="cancelar(objeto)" pTooltip="Cancelar" tooltipPosition="bottom"/>
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
                    </div>

                </div>
            </div>


            <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
    imports: [TemplateModule, TooltipModule],
    providers: [MessageService, ConfirmationService]
})
export class DevolucionMaterialBibliografico {
    titulo: string = "Devoluciones";
    data: any[] = [];

    modulo: string = "aceptaciones";
    loading: boolean = true;

    objetoDialog!: boolean;
    msgs: Message[] = [];

    user: any;

    @ViewChild('filter') filter!: ElementRef;
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    dataTipo: Tipo[] = [];
    tipoFiltro: Tipo = new Tipo();
    filtros: ClaseGeneral[] = [];
    opcionFiltro: ClaseGeneral = new ClaseGeneral();
    palabra: any;
    palabraClave: string = "";

    constructor(private prestamosService: PrestamosService,private materialBibliograficoService: MaterialBibliograficoService, private genericoService: GenericoService,
        private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
    async ngOnInit() {
        // this.user = this.authService.getUser();
        this.user = {
            "idusuario": 0
        }
        await this.ListaSede();
        await this.ListaTipo();
        await this.listar();
    }

    async ListaTipo() {
        try {
          const result: any = await this.prestamosService.api_prestamos_tipos('conf/tipo-lista').toPromise();
          if (result.status === "0") {
            this.dataTipo = result.data;
            let tipos = [{ id: 0, descripcion: 'TODOS', activo: true, estado: 1 }, ...this.dataTipo];

            this.dataTipo = tipos;
            this.tipoFiltro = this.dataTipo[0];
          }
        } catch (error) {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }

      }

    limpiar() {
        this.palabraClave = "";  // Resetea el campo de búsqueda
        this.sedeFiltro = this.dataSede[0];
        this.opcionFiltro = this.filtros[0];
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
            const result: any = await this.genericoService.sedes_get('conf/tipo-lista').toPromise();
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
    async listar() {
        this.loading = true;
        this.data = [];

        this.materialBibliograficoService.listarDetallesPrestados()
            .subscribe(
                 (result: DetalleBibliotecaDTO[]) => {
                    this.loading = false;
                    this.data = result;
                },
                (_: HttpErrorResponse) => {
                    this.loading = false;
                }
            );
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
    cancelar(objeto: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de cancelar la reserva del ejemplar?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
              this.loading = true;
              const data = { id: objeto.idDetalleBiblioteca };
              this.genericoService.conf_event_delete(data, this.modulo + '/cancelar')
                .subscribe(result => {
                  if (result.p_status == 0) {
                    this.objetoDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro cancelado.' });
                    this.listar();
                  } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar el proceso.' });
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

    regularizarPrestamo(){

    }
}
