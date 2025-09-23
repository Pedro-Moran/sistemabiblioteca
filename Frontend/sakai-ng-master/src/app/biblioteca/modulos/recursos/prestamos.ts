import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Table } from 'primeng/table';
import { InputValidation } from '../../input-validation';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { Usuario } from '../../interfaces/usuario';
import { GenericoService } from '../../services/generico.service';
import { UsuarioService } from '../../services/usuarios.service';
import { TemplateModule } from '../../template.module';
import { ReservasService } from '../../services/reservas.service';
import { Reservas } from '../../interfaces/reservas';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Prestamo } from '../../interfaces/prestamo';

@Component({
    selector: 'app-prestamos',
    standalone: true,
    template: `    
        <div class="">
        <div class="">
     
            <div class="card flex flex-col gap-4 w-full">
                <h5>{{titulo}}</h5>
               
                <p-toolbar styleClass="mb-6">
    <ng-template #start>
    <div class="flex flex-wrap gap-4">
                            <div class="flex flex-col grow basis-0 gap-2">
                            <p-select [(ngModel)]="situacionFiltro" [options]="dataSituacionFiltro" optionLabel="descripcion" placeholder="Seleccionar" />
    
                            </div>
                            <div class="flex flex-col grow basis-0 min-w-[100px] max-w-[100px] gap-2">
                           <p-datepicker [(ngModel)]="fechaFiltroIni"
              [maxDate]="fechaFiltroFin"
              [readonlyInput]="true"
              dateFormat="dd/mm/yy">
</p-datepicker>
                            </div>
                            <div class="flex flex-col grow basis-0 min-w-[100px] max-w-[100px] gap-2">
                           <p-datepicker [(ngModel)]="fechaFiltroFin"
              [minDate]="fechaFiltroIni"
              [readonlyInput]="true"
              dateFormat="dd/mm/yy">
</p-datepicker>
                            </div>
                            <div class="flex flex-col grow basis-0 gap-2">
                                <input pInputText id="nombre" type="text" placeholder="Palabra clave"/>
                            </div>
                            <button pButton type="button" icon="pi pi-search" class="mr-2 p-inputtext-sm"
                            (click)="listaPrestamos()" [disabled]="loading" pTooltip="Actualizar Lista"
                            tooltipPosition="bottom"></button>
                        </div>
    
    </ng-template>
    
    <ng-template #end >
         <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoRegistro()" 
                        pTooltip="Nuevo registro" tooltipPosition="bottom"></button>
                              
    </ng-template>
    </p-toolbar>
    <p-table #dt1 [value]="data" dataKey="id" [rows]="10" [showCurrentPageReport]="true"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                    [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true"
                    styleClass="p-datatable-gridlines" [paginator]="true"
                    [globalFilterFields]="['ejemplar.material.tipoRecurso.tipo.descripcion','ejemplar.material.tipoRecurso.descripcion','ejemplar.sede.descripcion','ejemplar.codigo','ejemplar.nroingreso','situacionReserva.descripcion','fechaHoraInicio','fechaHoraFin','motivo']"
                    responsiveLayout="scroll">
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
                            <th style="min-width:200px" pSortableColumn="usuario.nombres">USUARIO <p-sortIcon field="usuario.nombres"></p-sortIcon></th>
                            <th style="min-width:200px" pSortableColumn="ejemplar.material.nombre">EJEMPLAR <p-sortIcon field="ejemplar.material.nombre"></p-sortIcon></th>
                            <th style="width: 8rem" pSortableColumn="ejemplar.codigo"> CODIGO <p-sortIcon field="ejemplar.codigo"></p-sortIcon></th>
                            <th style="width: 8rem" pSortableColumn="ejemplar.sede.descripcion">SEDE <p-sortIcon field="ejemplar.sede.descripcion"></p-sortIcon></th>
                            <th style="width: 4rem" pSortableColumn="situacionReserva.descripcion">ESTADO <p-sortIcon
                                    field="situacionReserva.descripcion"></p-sortIcon></th>
                            <th style="width: 4rem" pSortableColumn="fechaHoraInicio">FECHA INICIO. <p-sortIcon
                                    field="fechaHoraInicio"></p-sortIcon></th>
                            <th pSortableColumn="fechaHoraFin" style="width: 4rem">FECHA FIN<p-sortIcon
                                    field="fechaHoraFin"></p-sortIcon></th>
                            <th style="width: 4rem">Opciones</th>
    
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-objeto>
                        <tr>
                            <td>
                                {{objeto.usuario.nombres}}<br/>
                                <small>{{objeto.usuario.tipodocumento?.descripcion}}: {{objeto.usuario.numerodocumento}}</small>
                            </td>
                            <td>
                                {{objeto.ejemplar.material.nombre}}<br/>
                                <small>{{objeto.ejemplar.sede?.descripcion}}</small><br/>
                                <small>{{objeto.ejemplar.material.tipoRecurso?.descripcion}} ({{objeto.ejemplar.material.tipoRecurso.tipo?.descripcion}})</small>
                            </td>
                            <td>
                                {{objeto.ejemplar.codigo}}
                            </td>
                            <td>
                                {{objeto.ejemplar.sede.descripcion}}
                            </td>
                            <td>
                                {{objeto.situacionReserva.descripcion}}
                            </td>
                            <td>
                                {{objeto.fechaHoraInicio}}
                            </td>
                            <td>
                                {{objeto.fechaHoraFin}}
                            </td>
                            <td class="text-center">
                                <div style="position: relative;">
                                    <button pButton type="button" icon="pi pi-ellipsis-v"
                                        class="p-button-rounded p-button-text p-button-plain"
                                        (click)="showMenu($event, objeto)"></button>
                                    <p-menu #menu [popup]="true" [model]="items" appendTo="body"></p-menu>
                                </div>
    
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="11">No se encontraron registros.</td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="loadingbody">
                        <tr>
                            <td colspan="11">Cargando datos. Espere por favor.</td>
                        </tr>
                    </ng-template>
                </p-table>
    </div>
    </div>
    </div>
    
    <p-dialog [(visible)]="objetoDialog" [breakpoints]="{ '960px': '75vw' }" [style]="{ width: '70vw' }" [draggable]="false"
        [resizable]="false" header="Registro" [modal]="true" styleClass="p-fluid">
        <ng-template pTemplate="content">
            <form [formGroup]="form">
            
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        
                            <div class="flex flex-col gap-2 w-full">
                            <label for="usuario">Usuario</label>
                            <p-autocomplete formControlName="usuario" [(ngModel)]="palabra" inputId="multiple-ac-1" multiple fluid [suggestions]="itemsUsuarios" (completeMethod)="buscar($event)" />
 
                            
                                <app-input-validation
                            [form]="form"
                            modelo="usuario"
                            ver="Usuario"></app-input-validation>
                            </div>
                        
                        <div class="flex flex-col gap-2 w-full">
                        <label for="ejemplar">Ejemplar</label>
                        <p-autocomplete formControlName="ejemplar" [(ngModel)]="palabra" inputId="multiple-ac-1" multiple fluid [suggestions]="itemsUsuarios" (completeMethod)="buscar($event)" />
                        <app-input-validation [form]="form" modelo="ejemplar"
                                ver="Ejemplar"></app-input-validation>
                        </div>
                    </div>
                    
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                        <label for="fechaHoraInicio">Fecha y Hora Inicio</label>
                        <p-datepicker formControlName="fechaHoraInicio" appendTo="body"             
              [readonlyInput]="true" inputId="calendar-12h" [showTime]="true" [hourFormat]="'24'" 
              dateFormat="dd/mm/yy">
</p-datepicker>
                            <app-input-validation [form]="form" modelo="fechaHoraInicio" ver="Fecha y hora inicio"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                        <label for="fechaHoraFin">Fecha y Hora Fin</label>
                        <p-datepicker formControlName="fechaHoraFin"  appendTo="body"            
              [readonlyInput]="true" inputId="calendar-12h" [showTime]="true"  [hourFormat]="'24'"
              dateFormat="dd/mm/yy">
</p-datepicker>
                            <app-input-validation [form]="form" modelo="fechaHoraFin" ver="Fecha y hora fin"></app-input-validation>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                        <label for="motivo">Motivo</label>
                        <textarea pTextarea id="motivo" rows="4" formControlName="motivo"></textarea>
                            <app-input-validation [form]="form" modelo="motivo" ver="Motivo"></app-input-validation>
                        </div>
                    </div>
            </form>
        </ng-template>
    
        <ng-template pTemplate="footer">
            <button pButton pRipple type="button" icon="pi pi-times" (click)="cancelar()" label="Cancelar"
                class="p-button-outlined p-button-danger"></button>
            <button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()" [disabled]="form.invalid"
                label="Guardar" class="p-button-success"></button>
        </ng-template>
    </p-dialog>
    <p-dialog [(visible)]="objetoDialogEditar" [breakpoints]="{ '960px': '75vw' }" [style]="{ width: '70vw' }" [draggable]="false"
        [resizable]="false" header="Registro" [modal]="true" styleClass="p-fluid">
        <ng-template pTemplate="content">
    <form [formGroup]="form">
        <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
            <!-- Usuario -->
             
            <div class="p-x-3 w-full md:w-1/2">
            <p-panel header="Usuario" [toggleable]="true">
    <p class="m-0">
    <label>{{ objeto.usuario.nombres }}</label><br />
    <small>{{ objeto.usuario.tipodocumento?.descripcion }}: {{ objeto.usuario.numerodocumento }}</small><br />
    <small>{{ objeto.usuario.email }}</small>
    </p>
</p-panel>
            </div>

            <!-- Recurso -->
            <div class="p-x-3 w-full md:w-1/2">
            <p-panel header="Ejemplar" [toggleable]="true">
    <p class="m-0"> 
    <b>{{ objeto.ejemplar.codigo }}</b> - {{ objeto.ejemplar.material.titulo }}<br />
                    <small>{{ objeto.ejemplar.sede?.descripcion }}</small><br />
                    <small>{{ objeto.ejemplar.material.tipoRecurso?.descripcion }} ({{ objeto.ejemplar.material.tipoRecurso?.tipo?.descripcion }})</small>
    </p>
</p-panel>
               
            </div>
        </div>

        <!-- Fecha y Hora -->
        <div class="flex flex-col md:flex-row gap-x-4 gap-y-2 mt-3">
            <div class="flex flex-col gap-2 w-full">
                <label for="fechaHoraInicio">Fecha y Hora Inicio</label>
                <p-datepicker formControlName="fechaHoraInicio" appendTo="body"
                              [readonlyInput]="true" inputId="calendar-12h" 
                              [showTime]="true" [hourFormat]="'24'" 
                              dateFormat="dd/mm/yy">
                </p-datepicker>
                <app-input-validation [form]="form" modelo="fechaHoraInicio" ver="Fecha y hora inicio"></app-input-validation>
            </div>
            <div class="flex flex-col gap-2 w-full">
                <label for="fechaHoraFin">Fecha y Hora Fin</label>
                <p-datepicker formControlName="fechaHoraFin" appendTo="body"
                              [readonlyInput]="true" inputId="calendar-12h" 
                              [showTime]="true" [hourFormat]="'24'"
                              dateFormat="dd/mm/yy">
                </p-datepicker>
                <app-input-validation [form]="form" modelo="fechaHoraFin" ver="Fecha y hora fin"></app-input-validation>
            </div>
        </div>

        <!-- Motivo -->
        <div class="flex flex-col gap-2 mt-3">
            <label for="motivo">Motivo</label>
            <textarea pTextarea id="motivo" rows="4" formControlName="motivo"></textarea>
            <app-input-validation [form]="form" modelo="motivo" ver="Motivo"></app-input-validation>
        </div>
    </form>
</ng-template>

    
        <ng-template pTemplate="footer">
            <button pButton pRipple type="button" icon="pi pi-times" (click)="cancelarEditar()" label="Cancelar"
                class="p-button-outlined p-button-danger"></button>
            <button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()" [disabled]="form.invalid"
                label="Guardar" class="p-button-success"></button>
        </ng-template>
    </p-dialog>
    
     <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
        <p-toast></p-toast>`,
    imports: [InputValidation, TemplateModule],
    providers: [MessageService, ConfirmationService]
})
export class PrestamosComponent implements OnInit {
    titulo: string = "Prestamos";
    data: ClaseGeneral[] = [];;
    modulo: string = "prestamos";
    loading: boolean = true;
    objeto: Prestamo = new Prestamo();
    form: FormGroup = new FormGroup({});
    objetoDialog!: boolean;
    objetoDialogEditar!: boolean;
    situacionFiltro: ClaseGeneral = new ClaseGeneral();
    sedeFiltro: ClaseGeneral = new ClaseGeneral();
    dataSituacion: ClaseGeneral[] = [];
    dataSituacionFiltro: ClaseGeneral[] = [];
    dataSedes: ClaseGeneral[] = [];
    dataSedesFiltro: ClaseGeneral[] = [];
    items: MenuItem[] | undefined;
    selectedItem: Reservas = new Reservas();
    idUsuario: number = 0;
    objetoUsuario!: any;
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    user: any;
    fechaActual: Date = new Date();
    fechaFiltroIni: Date = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() - 3, 1);
    fechaFiltroFin: Date = new Date();
    palabra: any;
    itemsUsuarios: any[] = [];


    constructor(private reservasService: ReservasService, private genericoService: GenericoService, private usuarioService: UsuarioService, private fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService) { }
    async ngOnInit() {
        // this.user = this.authService.getUser();

        this.user = {
            "idusuario": 0
        }
        this.items = [
            {
                label: 'Anular/Activar',
                icon: 'pi pi-check',
                command: (event) => this.cambiarEstadoRegistro(this.selectedItem)
            },
            {
                label: 'Actualizar',
                icon: 'pi pi-pencil',
                command: (event) => this.editarRegistro(this.selectedItem)
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: (event) => this.deleteRegistro(this.selectedItem)
            }
        ]
        await this.ListaSituacion();
        await this.ListaSede();
        this.formValidar();
        await this.listaPrestamos();
    }
    buscar(event: AutoCompleteCompleteEvent) {
        this.itemsUsuarios = [...Array(10).keys()].map(item => event.query + '-' + item);
    }
    nuevoRegistro() {
        this.formValidar();
        this.objetoDialog = true;
    }

    async ListaSituacion() {
        try {
            const result: any = await this.reservasService.api_situacion_lista('conf/lista-roles').toPromise();
            if (result.status === "0") {
                this.dataSituacion = result.data;
                let situacion = [{ id: 0, descripcion: 'TODOS LOS ESTADOS', activo: true, estado: 1 }, ...result.data];
                this.dataSituacionFiltro = situacion;
                this.situacionFiltro = this.dataSituacionFiltro[0];
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }

    }
    async ListaSede() {
        try {
            const result: any = await this.genericoService.sedes_get('sede/lista-activo').toPromise();
            if (result.status === "0") {
                this.dataSedes = result.data;
                let sedes = [{ id: 0, descripcion: 'TODAS LAS SEDES', activo: true, estado: 1 }, ...result.data];
                this.dataSedesFiltro = sedes;
                this.sedeFiltro = this.dataSedesFiltro[0];
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
        }
    }

    async formValidar() {
        let dataObjeto = this.objeto ? JSON.parse(JSON.stringify(this.objeto)) : {};
        this.form = this.fb.group({

            id: [dataObjeto.id],
            usuario: [dataObjeto.usuario, [Validators.required]],
            ejemplar: [dataObjeto.ejemplar, [Validators.required]],
            situacionReserva: [dataObjeto.situacionReserva, [Validators.required]],
            fechaHoraInicio: [dataObjeto.fechaHoraInicio, [Validators.required]],
            fechaHoraFin: [dataObjeto.fechaHoraFin, [Validators.required]],
            motivo: [dataObjeto.motivo, [Validators.required, Validators.maxLength(200), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],

        });
    }
    async listaPrestamos() {
        this.loading = true;
        this.reservasService.api_prestamos_lista(this.modulo + '/listaPorSituacion/' + this.situacionFiltro.id)
            .subscribe(
                (result: any) => {
                    this.loading = false;
                    if (result.status == "0") {
                        this.data = result.data;
                    }
                    this.loading = false;
                }
                , (error: HttpErrorResponse) => {
                    this.loading = false;
                }
            );

    }


    cambiarEstadoRegistro(objeto: Usuario) {
        let estado = ""
        if (objeto.activo) {
            estado = "Desactivar";
        } else {
            estado = "Activar"
        }
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres cambiar el estado: ' + objeto.nombres + ' a ' + estado + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loading = true;
                const data = { id: objeto.id, activo: !objeto.activo };
                this.usuarioService.conf_event_put(data, this.modulo + '/activo')
                    .subscribe(result => {
                        if (result.p_status == 0) {
                            this.objetoDialog = false;
                            this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Estado de registro satisfactorio.' });
                            this.listaPrestamos();
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

    async editarRegistro(objeto: Reservas) {
        this.objeto = JSON.parse(JSON.stringify(objeto));
        this.formValidar();
        this.form.get('situacionReserva')?.patchValue(this.objeto.situacionReserva);

        this.objetoDialogEditar = true;
    }

    deleteRegistro(objeto: Usuario) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres eliminar: ' + objeto.nombres + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loading = true;
                const data = { id: objeto.id };
                this.usuarioService.conf_event_delete(data, this.modulo + '/eliminar')
                    .subscribe(result => {
                        if (result.p_status == 0) {
                            this.objetoDialog = false;
                            this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro eliminado.' });
                            this.listaPrestamos();
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

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    cancelar() {
        this.objetoDialog = false;
    }

    cancelarEditar() {
        this.objetoDialogEditar = false;
    }

    guardar() {
        let tipodocumento = this.form.get('tipodocumento')?.value;
        let rol = this.form.get('rol')?.value;
        let sede = this.form.get('sede')?.value;
        const data = {
            id: this.form.get('id')?.value, idusuario: this.user.idusuario
        };

        this.usuarioService.conf_event_post(data, this.modulo + '/registrar')
            .subscribe(result => {
                if (result.p_status == 0) {
                    this.listaPrestamos();
                    this.objetoDialog = false;
                    this.objetoDialogEditar = false;
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: result.p_mensaje });
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: result.p_mensaje });
                }
            }
                , (error: HttpErrorResponse) => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
                });
    }


}
