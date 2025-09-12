import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
import { Table } from 'primeng/table';
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
import { FormEquipo } from './form-equipo';
import { Equipo } from '../../../interfaces/biblioteca-virtual/equipo';
import { Estado } from '../../../interfaces/biblioteca-virtual/estado';

@Component({
    selector: 'app-biblioteca-virtual',
    standalone: true,
    template: ` <div class="">
            <div class="">
                <div class="card flex flex-col gap-4 w-full">
                    <h5>{{ titulo }}</h5>
                    <p-toolbar styleClass="mb-6">
                        <ng-template #start>
                            <div class="flex flex-col w-full gap-4">
                                <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                                <div class="grid grid-cols-7 gap-4">
                                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                                        <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSedesFiltro" optionLabel="descripcion" placeholder="Seleccionar" (onChange)="filtrarPorSede()" />
                                    </div>
                                    <div class="flex flex-col gap-2 col-span-3 md:col-span-3 lg:col-span-3">
                                        <label for="discapacidad" class="block text-sm font-medium">&nbsp;</label>
                                        <div class="col-span-2 flex items-center gap-2">
                                            <p-checkbox id="checkDiscapacidad" name="option" [(ngModel)]="discapacidadFiltro" [binary]="true" (onChange)="filtrarPorSede()"></p-checkbox>
                                            <label for="checkDiscapacidad" class="text-sm">¿Equipos con discapacidad?</label>
                                        </div>
                                    </div>
                                    <div class="flex items-end">
                                        <button pButton type="button" class="p-button-rounded p-button-danger" icon="pi pi-search" (click)="filtrarPorSede()" [disabled]="loading" pTooltip="Filtrar" tooltipPosition="bottom"></button>
                                    </div>
                                </div>
                            </div>
                        </ng-template>

                        <ng-template #end>
                            <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoRegistro()" pTooltip="Nuevo registro" tooltipPosition="bottom"></button>
                        </ng-template>
                    </p-toolbar>

                    <p-table
                        #dt1
                        [value]="data"
                        dataKey="idEquipo"
                        selectionMode="multiple"
                        [(selection)]="selectedRows"
                        [rows]="10"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]"
                        [loading]="loading"
                        [rowHover]="true"
                        styleClass="p-datatable-gridlines"
                        [paginator]="true"
                        [globalFilterFields]="['idEquipo', 'sede.descripcion', 'nombreEquipo', 'numeroEquipo', 'ip', 'estado.descripcion']"
                        responsiveLayout="scroll"
                    >
                        <ng-template pTemplate="caption">
                            <div class="flex items-center justify-between">
                                <p-button [outlined]="true" icon="pi pi-filter-slash" label="Limpiar" (click)="clear(dt1)" />

                                <div class="flex items-center gap-2">
                                    <p-iconfield>
                                        <input pInputText type="text" placeholder="Filtrar" #filter (input)="onGlobalFilter(dt1, $event)" />
                                    </p-iconfield>
                                    <button pButton type="button" class="p-button-danger" label="Eliminar seleccionados" icon="pi pi-trash" (click)="deleteSelected()" [disabled]="!selectedRows.length"></button>
                                </div>
                            </div>
                        </ng-template>
                        <ng-template pTemplate="header">
                            <tr>
                                <th style="width:3rem"><p-tableHeaderCheckbox></p-tableHeaderCheckbox></th>
                                <th pSortableColumn="sede.descripcion" style="width: 8rem">Sede<p-sortIcon field="sede.descripcion"></p-sortIcon></th>
                                <th pSortableColumn="nombreEquipo" style="min-width:200px">Nombre de equipo<p-sortIcon field="nombreEquipo"></p-sortIcon></th>
                                <th pSortableColumn="numeroEquipo" style="min-width:200px">N&uacute;mero equipo<p-sortIcon field="numeroEquipo"></p-sortIcon></th>
                                <th pSortableColumn="ip" style="width: 8rem">IP<p-sortIcon field="ip"></p-sortIcon></th>
                                <th pSortableColumn="estado.descripcion" style="width: 8rem">Estado<p-sortIcon field="estado.descripcion"></p-sortIcon></th>
                                <th style="width: 4rem">Opciones</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-objeto>
                            <tr [pSelectableRow]="objeto">
                                <td><p-tableCheckbox [value]="objeto"></p-tableCheckbox></td>
                                <td>
                                    {{ objeto.sede?.descripcion || '—' }}
                                </td>
                                <td>
                                    {{ objeto.nombreEquipo }}
                                </td>
                                <td>
                                    {{ objeto.numeroEquipo }}
                                </td>
                                <td>
                                    {{ objeto.ip }}
                                </td>
                                <td [ngClass]="objeto.estado.idEstado === 1 ? 'text-primary' : 'text-green-500'">
                                    {{ objeto.estado.descripcion }}
                                </td>
                                <td class="text-center">
                                    <div style="position: relative;">
                                        <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="showMenu($event, objeto)"></button>
                                        <p-menu #menu [popup]="true" [model]="items" appendTo="body"></p-menu>
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

                    <!-- Diálogo para cambiar estado -->
                    <p-dialog [(visible)]="displayChangeState" header="Cambiar estado" modal="true" [style]="{ width: '40vw' }" closable="true">
                        <ng-template pTemplate="content">
                            <form [formGroup]="estadoForm" class="p-fluid">
                                <div class="field">
                                    <label for="nuevoEstado">Nuevo Estado</label>
                                    <p-select id="nuevoEstado" formControlName="nuevoEstado" [options]="estadoLista" optionLabel="descripcion" placeholder="Seleccionar" appendTo="body"> </p-select>
                                    <div *ngIf="estadoForm.get('nuevoEstado')?.touched && estadoForm.get('nuevoEstado')?.invalid" class="p-error">Seleccione un estado válido.</div>
                                </div>
                            </form>
                        </ng-template>
                        <ng-template pTemplate="footer">
                            <button pButton type="button" label="Cancelar" (click)="cancelarCambioEstado()"></button>
                            <button pButton type="button" label="Guardar" (click)="guardarEstado()" [disabled]="estadoForm.invalid"></button>
                        </ng-template>
                    </p-dialog>
                </div>
            </div>
        </div>
        <app-form-equipo #modalEquipo [selectedSede]="sedeFiltro" (saved)="filtrarPorSede()"></app-form-equipo>

        <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
        <p-toast></p-toast>`,
    imports: [TemplateModule, TooltipModule, FormEquipo],
    providers: [MessageService, ConfirmationService]
})
export class BibliotecaVirtual implements OnInit {
    titulo: string = 'Biblioteca Virtual';
    data: any[] = [];
    modulo: string = 'biblioteca';
    loading: boolean = true;
    objeto: Ejemplar = new Ejemplar();
    submitted!: boolean;
    objetoDialog!: boolean;
    msgs: Message[] = [];
    form: FormGroup = new FormGroup({});
    user: any;
    selectedItem: any;
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    items!: MenuItem[];
    dataSede: Sedes[] = [];
    dataSedesFiltro: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    filtros: ClaseGeneral[] = [];
    opcionFiltro: ClaseGeneral = new ClaseGeneral();
    dataEstadoRecurso: EstadoRecurso[] = [];
    dataTipoEjemplarRecurso: ClaseGeneral[] = [];
    dataAutor: ClaseGeneral[] = [];
    dataEditorial: ClaseGeneral[] = [];
    dataTipoActivo: ClaseGeneral[] = [];
    palabra: any;
    itemsMaterial: any[] = [];
    palabraClave: string = '';
    estadoLista: any[] = []; // Lista de estados cargados desde el backend
    estadoForm!: FormGroup; // Formulario para cambio de estado

    @ViewChild('modalEquipo') modalEquipo!: FormEquipo;
    @ViewChild('dt1') dt!: Table;
    selectedRows: Equipo[] = [];
    displayChangeState: boolean = false;
    discapacidadFiltro: boolean = false;

    constructor(
        private bibliotecaVirtualService: BibliotecaVirtualService,
        private genericoService: GenericoService,
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.estadoForm = this.fb.group({
            nuevoEstado: [null, Validators.required]
        });
    }
    async ngOnInit() {
        this.items = [
            {
                label: 'Cambiar estado',
                icon: 'pi pi-check',
                command: () => this.abrirModalCambioEstado(this.selectedItem)
            },
            {
                label: 'Actualizar',
                icon: 'pi pi-pencil',
                command: (event) => this.editarRegistro(this.selectedItem)
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () => this.deleteRegistro(this.selectedItem)
            }
        ];
        // this.user = this.authService.getUser();
        this.user = {
            idusuario: 0
        };
        await this.cargarEstados();
        await this.ListaSede();
        this.filtrarPorSede();
        this.formValidar();
    }

    async cargarEstados() {
        try {
            const result: any = await this.bibliotecaVirtualService.listarEstados().toPromise();
            if (result.status === 0) {
                this.estadoLista = result.data;
            }
        } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los estados.' });
        }
    }

    // Método para abrir el modal de cambio de estado
    abrirModalCambioEstado(equipo: Equipo): void {
        if (!equipo) {
            this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Primero seleccione un equipo.' });
            return;
        }
        this.selectedItem = equipo;
        this.estadoForm.reset(); // Limpia el formulario de cambio de estado
        this.displayChangeState = true;
    }

    // Cancela el cambio de estado
    cancelarCambioEstado(): void {
        this.displayChangeState = false;
    }

    // Guarda el nuevo estado (llama al servicio "cambiarEstado")
    guardarEstado(): void {
        if (this.estadoForm.invalid) {
            return;
        }
        const nuevoEstado: Estado = this.estadoForm.get('nuevoEstado')?.value;
        const equipoId = this.selectedItem.id || this.selectedItem.idEquipo;
        this.loading = true;
        this.bibliotecaVirtualService.cambiarEstado(equipoId, nuevoEstado.descripcion).subscribe(
            (result: any) => {
                if (result.status === 0) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Satisfactorio',
                        detail: 'Estado actualizado correctamente.'
                    });
                    this.displayChangeState = false;
                    this.filtrarPorSede();
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: result.message || 'No se pudo cambiar el estado.'
                    });
                }
                this.loading = false;
            },
            (error: HttpErrorResponse) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ocurrió un error. Inténtelo más tarde.'
                });
                this.loading = false;
            }
        );
    }
    buscar(event: AutoCompleteCompleteEvent) {
        this.itemsMaterial = [...Array(10).keys()].map((item) => event.query + '-' + item);
    }

    formValidar() {
        let dataObjeto = JSON.parse(JSON.stringify(this.objeto));
        let documentosFiltrados;
        /* if (dataObjeto.material.tipoRecurso) {
      // dataObjeto.material.tipoRecurso.tipo=dataObjeto.material.tipoRecurso.tipo;
      this.listarTiposRecurso();!!/*dataObjeto.material.tipoRecurso=dataObjeto.tipoRecurso;
    } else {
      dataObjeto.material.tipoRecurso = null;
      dataObjeto.tipo = null;
    }*/
        this.form = this.fb.group({
            id: [dataObjeto.id],
            buscar: [''],
            sede: [dataObjeto.sede ?? null, [Validators.required]],
            estado: [dataObjeto.estado, [Validators.required]],
            codigo: [dataObjeto.codigo, [Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]],
            nroingreso: [dataObjeto.nroingreso, [Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]],
            horaInicio: [dataObjeto.horaInicio ?? null, [Validators.required]],
            horaFin: [dataObjeto.horaFin ?? null, [Validators.required]],
            maxHoras: [
                dataObjeto.maxHoras ?? null,
                [
                    Validators.required,
                    Validators.min(1),
                    Validators.max(24) // por ejemplo, si el máximo posible es 24 horas
                ]
            ],
            tipoEjemplar: [dataObjeto.tipoEjemplar, [Validators.required]],
            tipo: [dataObjeto.material?.tipoRecurso?.tipo, [Validators.required]],
            tipoRecurso: [dataObjeto.material?.tipoRecurso, [Validators.required]]
            //       nombre: [dataObjeto.material.nombre, [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
            //       descripcion: [dataObjeto.material.descripcion, [Validators.required, Validators.maxLength(200), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
            //       autor: [dataObjeto.material.autor, [Validators.required]],
            //       genero: [dataObjeto.material.genero, [Validators.required]],
            //       editorial: [dataObjeto.material.editorial, [Validators.required]],
            //       anioPublicacion: [dataObjeto.material.anioPublicacion, [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+$')]],
            //       numPaginas: [dataObjeto.material.numPaginas, [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+$')]],
            //       tipoActivo: [dataObjeto.material.tipoActivo, [Validators.required]]
        });
    }
    refreshPag() {}

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
    // editarRegistro(objeto: any): void {
    //   const equipo = this.mapToEquipo(objeto);
    //   console.log('✅ Enviando a editar:', equipo);
    //   this.modalEquipo.setData(equipo);
    //   this.modalEquipo.openModal();
    // }
    editarRegistro(objeto: Equipo): void {
        if ((objeto as any).idEquipo) {
            objeto.id = (objeto as any).idEquipo;
        }
        console.log('Registro recibido:', objeto);
        this.objeto = JSON.parse(JSON.stringify(objeto));
        this.modalEquipo.editarRegistro(objeto);
        this.formValidar();
        //this.objetoDialog = true;
    }

    private mapToEquipo(obj: any): Equipo {
        return {
            id: obj.id ?? null,
            estado: obj.estado ?? { idEstado: 1, descripcion: 'EN PROCESO', activo: true },
            nombreEquipo: obj.nombreEquipo ?? '',
            numeroEquipo: obj.numeroEquipo ?? '',
            ip: obj.ip ?? '',
            equipoDiscapacidad: obj.equipoDiscapacidad ?? false,
            sede: obj.sede ?? this.sedeFiltro ?? null,
            activo: obj.activo ?? true
        };
    }

    nuevoRegistro() {
        this.modalEquipo.openModal();
    }

    cancelar() {
        this.objetoDialog = false;
        this.submitted = false;
    }

    deleteRegistro(objeto: Ejemplar) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres eliminar: ' + objeto.idEquipo + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loading = true;
                const data = { id: objeto.idEquipo };
                this.genericoService.conf_event_delete_1(objeto.idEquipo, 'api/equipos/delete').subscribe(
                    (result) => {
                        if (result.status === 0) {
                            this.objetoDialog = false;
                            this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro eliminado.' });
                            this.filtrarPorSede();
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
                        }
                        this.loading = false;
                    },
                    (error: HttpErrorResponse) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
                        this.loading = false;
                    }
                );
            }
        });
    }

    deleteSelected() {
        if (!this.selectedRows.length) {
            return;
        }
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de eliminar los seleccionados?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                const ids = this.selectedRows.map((item) => item.id ?? item.idEquipo).filter((id): id is number => id !== undefined);
                this.loading = true;
                this.bibliotecaVirtualService.eliminarEquipos(ids).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registros eliminados.' });
                        this.selectedRows = [];
                        this.filtrarPorSede();
                        this.loading = false;
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar el proceso.' });
                        this.loading = false;
                    }
                });
            }
        });
    }

    guardar() {
        this.loading = true;
        const data = { id: this.form.get('id')?.value, descripcion: this.form.get('descripcion')?.value, usuarioid: this.user.idusuario, activo: true, accion: 'registrar' };
        this.genericoService.conf_event_post(data, this.modulo + '/registrar').subscribe(
            (result) => {
                if (result.p_status == 0) {
                    this.objetoDialog = false;
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro guardado.' });
                    this.filtrarPorSede();
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
                }
                this.loading = false;
            },
            (error: HttpErrorResponse) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
                this.loading = false;
            }
        );
    }

    async ListaSede() {
        try {
            const result: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
            if (result.status === 0) {
                this.dataSede = result.data;
                this.dataSedesFiltro = this.dataSede;
                this.sedeFiltro = this.dataSedesFiltro[0];
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }
    }
    async listar() {
        this.loading = true;
        this.data = [];

        this.bibliotecaVirtualService.listarEquipos().subscribe(
            (result: any) => {
                this.loading = false;
                if (result.status == '0') {
                    this.data = result.data;
                }
            },
            (error: HttpErrorResponse) => {
                this.loading = false;
            }
        );

        this.loading = false;
    }
    cambiarEstadoRegistro(objeto: Ejemplar) {
        let estado = '';
        if (objeto.activo) {
            estado = 'Desactivar';
        } else {
            estado = 'Activar';
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
                this.genericoService.conf_event_put(data, this.modulo + '/activo').subscribe(
                    (result) => {
                        if (result.p_status == 0) {
                            this.objetoDialog = false;
                            this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Estado de registro satisfactorio.' });
                            this.filtrarPorSede();
                        } else {
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
                        }
                        this.loading = false;
                    },
                    (error: HttpErrorResponse) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
                        this.loading = false;
                    }
                );
            }
        });
    }
    showMenu(event: MouseEvent, selectedItem: any) {
        this.selectedItem = selectedItem;
        this.menu.toggle(event);
    }

    filtrarPorSede() {
        if (!this.sedeFiltro) {
            return;
        }
        this.loading = true;
        const sedeId = this.sedeFiltro.id;
        const discapacidad = this.discapacidadFiltro;

        this.bibliotecaVirtualService.filtrarPorSede(sedeId, discapacidad).subscribe(
            (result: any) => {
                this.loading = false;
                if (result.status == '0') {
                    this.data = result.data;
                }
            },
            (error: HttpErrorResponse) => {
                this.loading = false;
            }
        );
    }
}
