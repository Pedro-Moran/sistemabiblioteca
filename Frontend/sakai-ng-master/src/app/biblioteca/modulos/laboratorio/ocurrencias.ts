import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { BibliotecaVirtualService } from '../../services/biblioteca-virtual.service';
import { GenericoService } from '../../services/generico.service';
import { TemplateModule } from '../../template.module';
import { Table } from 'primeng/table';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { ModalNuevoOcurencia } from './modal-nuevo-ocurrencia';
import { ModalDetalleOcurencia } from './modal-detalle-ocurrencia';

@Component({
    selector: 'app-ocurrencias-laboratorio',
    standalone: true,
    template: ` <div class="card">
        <h5>{{titulo}}</h5>
        <p-toolbar styleClass="mb-6">
        <ng-template #start>
    <div class="flex flex-col w-full gap-4">
                <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                <div class="grid grid-cols-7 gap-4">
                <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                        <label for="opcion" class="block text-sm font-medium">Estado</label>
                        <p-select [(ngModel)]="opcionFiltro" [options]="dataFiltro" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-6 md:col-span-4">
                    <label for="alumno" class="block text-sm font-medium">Alumno</label>
                                <input [(ngModel)]="alumno"pInputText id="alumno" type="text" placeholder="Alumno"/>

                    </div>
                    <div class="flex items-end">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-danger"
                icon="pi pi-search"(click)="buscar()" [disabled]="loading"  pTooltip="Ver reporte" tooltipPosition="bottom">
            </button>
        </div>
                    </div>



            </div>
            </ng-template>
            <ng-template #end>
                 <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoRegistro()"
                                pTooltip="Nuevo registro" tooltipPosition="bottom"></button>


            </ng-template>
    </p-toolbar>
    <p-tabs value="0">
                            <p-tablist>
                                <p-tab value="0">Ocurrencias</p-tab>
                                <p-tab value="1">Estudiantes</p-tab>
                                <p-tab value="2">Materiales</p-tab>
                            </p-tablist>
                            <p-tabpanels>
                                <p-tabpanel value="0">
                                <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                        [globalFilterFields]="['id','ocurrencia','semestre','sede','ciclo','laboratorio','fecha']" responsiveLayout="scroll">
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
                                    <th style="width: 8rem"></th>
                                <th pSortableColumn="ocurrencia" style="width: 4rem">Ocurrencia<p-sortIcon field="ocurrencia"></p-sortIcon></th>
                                <th pSortableColumn="semestre" style="min-width:200px">Semestre<p-sortIcon field="semestre"></p-sortIcon></th>
                                    <th pSortableColumn="sede" style="min-width:200px">Sede/Especialidad<p-sortIcon field="sede"></p-sortIcon></th>
                                    <th pSortableColumn="ciclo"  style="min-width:200px">Ciclo<p-sortIcon field="ciclo"></p-sortIcon></th>
                                    <th pSortableColumn="laboratorio"  style="min-width:200px">Laboratorio<p-sortIcon field="laboratorio"></p-sortIcon></th>
                                    <th pSortableColumn="fecha" style="width: 8rem">Fecha<p-sortIcon field="fecha"></p-sortIcon></th>

                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-objeto>
                                <tr>
                                    <td>
                                    <div class="flex flex-wrap justify-center gap-2">
                                <p-button outlined icon="pi pi-pencil" pTooltip="Más información" tooltipPosition="bottom" (click)="editar()"/>
                                                           </div>
                                    </td>
                                <td>{{objeto.ocurrencia}}
                                    </td>
                                    <td>
                                        {{objeto.semestre}}

                                    </td>
                                    <td>
                                        {{objeto.sede}}

                                    </td>
                                    <td>
                                        {{objeto.ciclo}}
                                    </td>
                                    <td>
                                        {{objeto.laboratorio}}
                                    </td>
                                    <td>
                                        {{objeto.fecha}}
                                    </td>
                                    <td>
                                        <div class="flex flex-wrap justify-center gap-2">
                                            <p-button outlined icon="pi pi-align-justify" pTooltip="Más información" tooltipPosition="bottom" (click)="verDetalle()"/>
                                        </div>
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
                                </p-tabpanel>
                            </p-tabpanels>
</p-tabs>


    </div>


<app-modal-nuevo-ocurrencia #modalNuevoOcurrencia></app-modal-nuevo-ocurrencia>
<app-modal-detalle-ocurrencia #modalDetalleOcurrencia></app-modal-detalle-ocurrencia>
<p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
        imports: [TemplateModule,ModalNuevoOcurencia,ModalDetalleOcurencia],
        providers: [MessageService, ConfirmationService]
})
export class OcurrenciasLaboratorio {
    data: any[] = [];
    dataFiltro: any[] = [
        {"descripcion":"TODOS"},
        {"descripcion":"Pendiente costo"},
        {"descripcion":"Costeados y enviados"},
        {"descripcion":"Regularizados"}
    ];
    loading: boolean = false;
    opcionFiltro: any = this.dataFiltro[0];
    alumno:string="";

    titulo: string = "Mantenimiento de materiales en deuda - Laboratorio ciencias";
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('modalNuevoOcurrencia') modalNuevoOcurrencia!: ModalNuevoOcurencia;
    @ViewChild('modalDetalleOcurrencia') modalDetalleOcurrencia!: ModalDetalleOcurencia;

    constructor(private genericoService: GenericoService, private fb: FormBuilder,
    private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService,
    private materialBsvc: MaterialBibliograficoService) { }
    async ngOnInit() {
        this.buscar();
    }
    buscar(){
        this.loading = true;
        this.materialBsvc.api_ocurrencias_laboratorio().subscribe({
          next: (lista) => {
            // Solo listamos ocurrencias marcadas como de laboratorio
            this.data = lista.filter(o => o.esBiblioteca === false);
            this.loading = false;
          },
          error: (error: HttpErrorResponse) => {
            this.loading = false;
          }
        });
    }

      onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      }

      clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
      }
      verDetalle(){
        this.modalDetalleOcurrencia.openModal();
      }
      editar(){}
      nuevoRegistro(){
        this.modalNuevoOcurrencia.openModal();
      }
}
