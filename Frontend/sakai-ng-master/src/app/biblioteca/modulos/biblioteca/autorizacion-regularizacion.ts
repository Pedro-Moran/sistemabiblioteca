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
import { OcurrenciaEventService } from '../../services/ocurrencia-event.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDetalleUsuario } from './modal-usuario';
import { ModalDetalleOcurencia } from './modal-detalle-ocurrencia';
import { ModalRegularizaOcurencia } from './modal-regulariza-ocurrencia';

@Component({
    selector: 'app-autorizacion-regularizacion',
    standalone: true,
    template: ` <div class="card">
            <h5>{{ titulo }}</h5>
            <p-toolbar styleClass="mb-6">
                <div class="flex flex-col w-full gap-4">
                    <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                    <div class="grid grid-cols-7 gap-4">
                        <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                            <label for="opcion" class="block text-sm font-medium">Filtro</label>
                            <p-select [(ngModel)]="opcionFiltro" [options]="dataFiltro" optionLabel="descripcion" placeholder="Seleccionar" />
                        </div>
                        <div class="flex flex-col gap-2 col-span-4">
                            <label for="usuario" class="block text-sm font-medium">Usuario</label>
                            <input [(ngModel)]="usuario" pInputText id="usuario" type="text" placeholder="Usuario" />
                        </div>
                        <div class="flex items-end">
                            <button pButton type="button" class="p-button-rounded p-button-danger" icon="pi pi-search" (click)="buscar()" [disabled]="loading" pTooltip="Ver reporte" tooltipPosition="bottom"></button>
                        </div>
                    </div>
                </div>
            </p-toolbar>
            <p-table
                #dt1
                [value]="data"
                dataKey="id"
                [rows]="10"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                [rowsPerPageOptions]="[10, 25, 50]"
                [loading]="loading"
                [rowHover]="true"
                styleClass="p-datatable-gridlines"
                [paginator]="true"
                [globalFilterFields]="['id', 'codigoUsuario', 'idEjemplar']"
                responsiveLayout="scroll"
            >
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
                        <th style="width: 4rem"></th>
                        <th pSortableColumn="codigoUsuario" style="width: 6rem">Código<p-sortIcon field="codigoUsuario"></p-sortIcon></th>
                        <th pSortableColumn="idEjemplar" style="min-width:200px">ID Ejemplar/Equipo<p-sortIcon field="idEjemplar"></p-sortIcon></th>
                        <th style="width: 4rem"></th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-objeto>
                    <tr>
                        <td>
                            <div class="flex flex-wrap justify-center gap-2">
                                @if (objeto.regulariza == 1) {
                                    <p-button outlined severity="success" icon="pi pi-check-circle" pTooltip="Autorizado" tooltipPosition="bottom" (click)="estado(objeto, 0)" />
                                } @else {
                                    <p-button outlined icon="pi pi-check-circle" pTooltip="No autorizado" tooltipPosition="bottom" (click)="estado(objeto, 1)" />
                                }
                            </div>
                        </td>
                        <td>{{ objeto.codigoUsuario }}</td>
                        <td>
                            {{ objeto.esBiblioteca ? objeto.idEjemplar : objeto.idEquipo }}
                        </td>
                        <td>
                            <div class="flex flex-wrap justify-center gap-2">
                                <p-button outlined icon="pi pi-align-justify" pTooltip="Más información" tooltipPosition="bottom" (click)="verDetalle()" />
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
        <app-modal-detalle-usuario #modalDetalle></app-modal-detalle-usuario>
        <app-modal-detalle-ocurrencia #modalOcurrencia></app-modal-detalle-ocurrencia>
        <app-modal-regulariza-ocurrencia #modalRegularizaOcurrencia></app-modal-regulariza-ocurrencia>
        <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
        <p-toast></p-toast>`,
    imports: [TemplateModule, ModalDetalleUsuario, ModalDetalleOcurencia, ModalRegularizaOcurencia],
    providers: [MessageService, ConfirmationService]
})
export class AutorizacionRegularizacion {
    data: any[] = [];
    dataFiltro: any[] = [{ descripcion: 'TODOS' }, { descripcion: 'Pendiente costo' }, { descripcion: 'Costeados y enviados' }, { descripcion: 'Regularizados' }];
    loading: boolean = false;
    opcionFiltro: any = this.dataFiltro[0];
    usuario: string = '';

    titulo: string = "Autorización regularización";
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild('modalDetalle') modalDetalle!: ModalDetalleUsuario;
    @ViewChild('modalOcurrencia') modalOcurrencia!: ModalDetalleOcurencia;
    @ViewChild('modalRegularizaOcurrencia') modalRegularizaOcurrencia!: ModalRegularizaOcurencia;

    constructor(
        private ocurrenciasService: OcurrenciasService,
        private genericoService: GenericoService,
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private ocurrenciaEvents: OcurrenciaEventService
    ) {}
    async ngOnInit() {
        this.buscar();
    }
    buscar(){
        this.loading = true;
        this.ocurrenciasService.api_autorizacion_regularizacion().subscribe({
            next: (lista) => {
                let datos = [...lista];
                const filtro = this.opcionFiltro.descripcion;
                if (filtro === 'Pendiente costo') {
                    datos = datos.filter((o) => !o.estadoCosto || o.estadoCosto === 0);
                } else if (filtro === 'Costeados y enviados') {
                    datos = datos.filter((o) => o.estadoCosto === 1 && (!o.regulariza || o.regulariza === 0));
                } else if (filtro === 'Regularizados') {
                    datos = datos.filter((o) => o.regulariza === 1);
                }
                this.data = datos.sort((a: any, b: any) => (b.id ?? 0) - (a.id ?? 0));
                this.loading = false;
            },
            error: () => {
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
      estado(obj: any, valor: number){
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de cambiar estado?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loading = true;
                    this.ocurrenciasService.api_actualizar_regulariza(obj.id, valor).subscribe({
                    next: () => {
                        obj.regulariza = valor;
                        this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Estado actualizado.' });
                        if (obj.idEquipo) {
                            this.ocurrenciaEvents.notifyAutorizada(obj.idEquipo);
                        }
                        this.loading = false;
                    },
                    error: () => {
                      this.loading = false;
                    }
                  });
            }
        });
      }
      verDetalle(){

      }
}
