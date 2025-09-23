import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { BibliotecaVirtualService } from '../../services/biblioteca-virtual.service';
import { GenericoService } from '../../services/generico.service';
import { TemplateModule } from '../../template.module';
import { Table } from 'primeng/table';
import { OcurrenciasService } from '../../services/ocurrencias.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalImpresion } from './modal-impresion';
import { ModalVistaPdf } from './modal-vista-pdf';

@Component({
    selector: 'app-impresion-constancia',
    standalone: true,
    template: ` <div class="card">
        <h5>{{titulo}}</h5>
        <p-toolbar styleClass="mb-6">
    <div class="flex flex-col w-full gap-4">
                <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                <div class="grid grid-cols-7 gap-4">

                    <div class="flex flex-col gap-2 col-span-4">
                    <label for="usuario" class="block text-sm font-medium">Buscar estudiante</label>
                                <input [(ngModel)]="usuario"pInputText id="usuario" type="text" placeholder="Buscar"/>

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

    </p-toolbar>
    <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                        [globalFilterFields]="['id','codigo','estudiante','nombres']" responsiveLayout="scroll">
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
                                <th pSortableColumn="codigo" style="width: 4rem">Codigo<p-sortIcon field="codigo"></p-sortIcon></th>
                                <th pSortableColumn="estudiante" style="min-width:200px">Estudiante<p-sortIcon field="estudiante"></p-sortIcon></th>
                                    <th pSortableColumn="especialidad" style="min-width:200px">Especialidad<p-sortIcon field="especialidad"></p-sortIcon></th>
                                    <th pSortableColumn="sede" style="min-width:200px">Local/Filial<p-sortIcon field="sede"></p-sortIcon></th>
                                    <th style="width: 8rem"></th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-objeto>
                                <tr>
                                <td>{{objeto.codigo}}
                                    </td>
                                    <td>
                                        {{objeto.estudiante}}

                                    </td>
                                    <td>
                                        {{objeto.especialidad}}

                                    </td>
                                    <td>
                                        {{objeto.sede}}

                                    </td>
                                    <td>
                                        <div class="flex flex-wrap justify-center gap-2">
                                            <p-button outlined icon="pi pi-inbox" [severity]="objeto.pendiente ? 'secondary' : 'help'" pTooltip="Imprimir" tooltipPosition="bottom" (click)="imprimir(objeto)"/>
                                            <p-button outlined icon="pi pi-search" pTooltip="Ver información" tooltipPosition="bottom" (click)="verDetalle(objeto)"/>
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
    </div>

<app-modal-impresion #modalImpresion></app-modal-impresion>
<app-modal-vista-pdf #modalVista></app-modal-vista-pdf>

<p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
        imports: [TemplateModule,ModalImpresion,ModalVistaPdf],
        providers: [MessageService, ConfirmationService]
})
export class InpresionConstancia {
    data: any[] = [];
    dataFiltro: any[] = [
        {"descripcion":"TODOS"},
        {"descripcion":"Pendiente costo"},
        {"descripcion":"Costeados y enviados"},
        {"descripcion":"Regularizados"}
    ];
    loading: boolean = false;
    opcionFiltro: any = this.dataFiltro[0];
    usuario:string="";

    titulo: string = "Impresión de constancias";
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('modalImpresion') modalImpresion!: ModalImpresion;
    @ViewChild('modalVista') modalVista!: ModalVistaPdf;

    constructor(private ocurrenciasService: OcurrenciasService, private genericoService: GenericoService, private fb: FormBuilder,
    private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
    async ngOnInit() {
        this.buscar();
    }
    buscar(){
        this.loading = true;
        this.ocurrenciasService.api_constancias(this.usuario)
              .subscribe(
                (result: any) => {
                  this.loading = false;
                  if (result.status == "0") {
                    this.data = result.data;
                  }
                }
                , (error: HttpErrorResponse) => {
                  this.loading = false;
                }
              );
    }

      onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
      }

      clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
      }
      estado(){
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de cambiar estado?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loading = true;
                //registrar nueva especiadad
                this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Estado actualizado.' });
                this.loading = false;
            }
        });
      }
      verDetalle(obj:any){
        this.ocurrenciasService.api_constancias_preview(obj.codigo)
          .subscribe(blob => {
            this.modalVista.openModal(blob);
          });
      }
      imprimir(obj:any){
        this.modalImpresion.openModal(obj);
      }
}
