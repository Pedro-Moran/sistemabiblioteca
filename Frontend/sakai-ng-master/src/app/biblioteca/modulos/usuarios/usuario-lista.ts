import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { GenericoService } from '../../services/generico.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { InputValidation } from '../../input-validation';
import { TemplateModule } from '../../template.module';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
import { UsuarioService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-usuario-lista',
    standalone: true,
    template: ` <div class="">
            <div class="">
                <div class="card flex flex-col gap-4 w-full">
                    <h5>{{ titulo }}</h5>

                    <p-toolbar styleClass="mb-6">
                        <ng-template #start>
                            <div class="flex flex-wrap gap-4">
                                <div class="flex flex-col grow basis-0 gap-2">
                                    <p-select [(ngModel)]="rolFiltro" [options]="dataRolesFiltro" optionLabel="descripcion" placeholder="Seleccionar" />
                                </div>
                                <button pButton type="button" icon="pi pi-search" class="mr-2 p-inputtext-sm" (click)="listaUsuarios()" [disabled]="loading" pTooltip="Actualizar Lista" tooltipPosition="bottom"></button>
                            </div>
                        </ng-template>

                        <ng-template #end>
                            <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoRegistro()" pTooltip="Nuevo registro" tooltipPosition="bottom"></button>
                        </ng-template>
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
                        [globalFilterFields]="['id', 'email', 'rol.descripcion']"
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
                                <th style="width: 4rem" pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
                                <th pSortableColumn="email" style="min-width:200px">Correo<p-sortIcon field="email"></p-sortIcon></th>
                                <th pSortableColumn="rol.descripcion" style="min-width:200px">Rol<p-sortIcon field="rol.descripcion"></p-sortIcon></th>
                                <th style="min-width:95px;">Opciones</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-objeto>
                            <tr>
                                <td>
                                    {{ objeto.id }}
                                </td>
                                <td>
                                    {{ objeto.email }}
                                </td>
                                <td>
                                    {{ objeto.rol?.descripcion || (objeto.roles.length > 0 ? objeto.roles[0].descripcion : 'Sin rol') }}
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
                                <td colspan="4">No se encontraron registros.</td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="loadingbody">
                            <tr>
                                <td colspan="4">Cargando datos. Espere por favor.</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>

        <p-dialog [(visible)]="objetoDialog" [breakpoints]="{ '960px': '75vw' }" [style]="{ width: '70vw' }" [draggable]="false" [resizable]="false" header="Registro" [modal]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <form [formGroup]="form">
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full" *ngIf="objeto.id == 0">
                            <label for="rol">Rol</label>
                            <p-select [options]="dataRoles" optionLabel="descripcion" placeholder="Seleccionar" formControlName="rol" />
                            <app-input-validation [form]="form" modelo="rol" ver="Rol"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 w-full" *ngIf="objeto.id == 0">
                            <label for="sede">Local/Filial</label>
                            <p-select [options]="dataSedes" optionLabel="descripcion" placeholder="Seleccionar" formControlName="sede" />
                            <app-input-validation [form]="form" modelo="sede" ver="sede"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="tipodocumento">Tipo documento</label>
                            <p-select [options]="dataTipoDocumento" optionLabel="descripcion" placeholder="Seleccionar" formControlName="tipodocumento" />
                            <app-input-validation [form]="form" modelo="tipodocumento" ver="Tipo documento"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="numDocumento">Numero de documento</label>
                            <input type="text" pInputText id="numDocumento" formControlName="numDocumento" />
                            <app-input-validation [form]="form" modelo="numDocumento" ver="Numero de documento"></app-input-validation>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="nombreUsuario">Nombre</label>
                            <input type="text" pInputText id="nombreUsuario" formControlName="nombreUsuario" />
                            <app-input-validation [form]="form" modelo="nombreUsuario" ver="nombreUsuario"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="apellidoPaterno">Apellido Paterno</label>
                            <input type="text" pInputText id="apellidoPaterno" formControlName="apellidoPaterno" />
                            <app-input-validation [form]="form" modelo="apellidoPaterno" ver="apellidoPaterno"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="apellidoMaterno">Apellido Materno</label>
                            <input type="text" pInputText id="apellidoMaterno" formControlName="apellidoMaterno" />
                            <app-input-validation [form]="form" modelo="apellidoMaterno" ver="apellidoMaterno"></app-input-validation>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="email">Email</label>
                            <input type="text" pInputText id="email" formControlName="email" />
                            <app-input-validation [form]="form" modelo="email" ver="Email"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="telefono">Tel&eacute;fono</label>
                            <input type="text" pInputText id="telefono" formControlName="telefono" />
                            <app-input-validation [form]="form" modelo="telefono" ver="Telefono"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="celular">Celular</label>
                            <input type="text" pInputText id="celular" formControlName="celular" />
                            <app-input-validation [form]="form" modelo="celular" ver="Celular"></app-input-validation>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="password">Contraseña</label>
                            <p-password id="password" formControlName="password" [toggleMask]="true" [feedback]="false" inputStyleClass="w-full"></p-password>
                            <app-input-validation [form]="form" modelo="password" ver="password"></app-input-validation>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="direccion">Direcci&oacute;n</label>
                            <input type="text" pInputText id="direccion" formControlName="direccion" />
                            <app-input-validation [form]="form" modelo="direccion" ver="Direccion"></app-input-validation>
                        </div>
                    </div>
                </form>
            </ng-template>

            <ng-template pTemplate="footer">
                <button pButton pRipple type="button" icon="pi pi-times" (click)="cancelar()" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                <button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()" [disabled]="form.invalid" label="Guardar" class="p-button-success"></button>
            </ng-template>
        </p-dialog>
        <p-dialog [(visible)]="objetoDialogPermisos" [style]="{ width: '90%' }" header="{{ objetoUsuario?.descripcion }}" [modal]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <p-select appendTo="body" [(ngModel)]="objetoRol" [options]="dataRolesU" optionLabel="descripcion" placeholder="Seleccionar" class="col-12 md:col-10 text-left lg:text-left mr-2" />

                <button type="button" pButton pRipple icon="pi pi-plus" [disabled]="!objetoRol" (click)="agregarRol()" class="p-button-success mr-2 mb-2" pTooltip="Agregar modulo" tooltipPosition="bottom" styleClass="p-button-sm"></button>

                <p-table
                    #dt1
                    [value]="dataRolesUsuario"
                    dataKey="id"
                    [rows]="10"
                    [showCurrentPageReport]="true"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                    [rowsPerPageOptions]="[10, 25, 50]"
                    [loading]="loadingAgregarRol"
                    [rowHover]="true"
                    styleClass="p-datatable-gridlines"
                    [paginator]="true"
                    [globalFilterFields]="['idUsuario', 'email', 'descripcion']"
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
                            <th style="width: 4rem" pSortableColumn="idUsuario">ID <p-sortIcon field="idUsuario"></p-sortIcon></th>
                            <th pSortableColumn="email" style="min-width:200px">Correo<p-sortIcon field="email"></p-sortIcon></th>
                            <th pSortableColumn="descripcion" style="min-width:200px">Rol<p-sortIcon field="descripcion"></p-sortIcon></th>
                            <th style="width: 14rem">Opciones</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-objeto>
                        <tr>
                            <td>
                                {{ objeto.idUsuario }}
                            </td>
                            <td>
                                {{ objeto.email }}
                            </td>
                            <td>
                                {{ objeto.descripcion }}
                            </td>
                            <td class="text-center">
                                <button pButton pRipple icon="pi pi-trash" class="p-button-rounded p-button-danger" (click)="quitarRol(objeto)"></button>
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="4">No se encontraron registros.</td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="loadingbody">
                        <tr>
                            <td colspan="4">Cargando datos. Espere por favor.</td>
                        </tr>
                    </ng-template>
                </p-table>
            </ng-template>

            <ng-template pTemplate="footer">
                <button pButton pRipple type="button" icon="pi pi-times" (click)="hideDialogRoles()" label="Cerrar" class="p-button-outlined p-button-danger"></button>
            </ng-template>
        </p-dialog>

        <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
        <p-toast></p-toast>`,
    imports: [InputValidation, TemplateModule],
    providers: [MessageService, ConfirmationService]
})
export class UsuarioLista implements OnInit {
    titulo: string = 'Usuarios';
    data: ClaseGeneral[] = [];
    modulo: string = 'usuarios';
    loading: boolean = true;
    loadingAgregarRol: boolean = true;
    objeto: Usuario = new Usuario();
    form: FormGroup = new FormGroup({});
    objetoDialog!: boolean;
    objetoDialogPermisos!: boolean;
    rolFiltro: ClaseGeneral = new ClaseGeneral();
    dataRoles: ClaseGeneral[] = [];
    dataRolesU: ClaseGeneral[] = [];
    dataRolesUsuario: ClaseGeneral[] = [];
    dataRolesFiltro: ClaseGeneral[] = [];
    dataSedes: ClaseGeneral[] = [];
    dataTipoDocumento!: ClaseGeneral[];
    items: MenuItem[] | undefined;
    selectedItem: Usuario = new Usuario();
    idUsuario: number = 0;
    objetoUsuario!: any;
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    user: any;
    objetoRol!: ClaseGeneral;

    constructor(
        private genericoService: GenericoService,
        private usuarioService: UsuarioService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}
    async ngOnInit() {
        // this.user = this.authService.getUser();

        this.user = {
            idusuario: 0
        };
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
                label: 'Permisos',
                icon: 'pi pi-key',
                command: (event) => this.permisosRegistro(this.selectedItem)
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: (event) => this.deleteRegistro(this.selectedItem)
            }
        ];
        await this.ListaRoles();
        await this.ListaSede();
        await this.tipodocumentos();
        this.formValidar();
        await this.listaUsuarios();
    }
    nuevoRegistro() {
        // Reinicia el objeto a una nueva instancia con id=0
        this.objeto = new Usuario();
        // Reinicia el formulario
        this.form.reset();
        // Vuelve a configurar el formulario para el modo nuevo
        this.formValidar();
        // Abre el diálogo para nuevo registro
        this.objetoDialog = true;
    }

    async ListaRoles() {
        try {
            const result: any = await this.genericoService.roles_get('roles/lista-roles').toPromise();
            const roles = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];
            this.dataRoles = roles;
            this.dataRolesFiltro = roles;
            this.rolFiltro = this.dataRolesFiltro[0] ?? new ClaseGeneral();
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }
    }
    async ListaSede() {
        try {
            const result: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
            const sedes = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];
            this.dataSedes = sedes;
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
        }
    }

    async tipodocumentos(): Promise<void> {
        try {
            const result: any = await firstValueFrom(
                this.usuarioService.conf_event_get('lista-activo')
            );
            if (result.status === '0') {
                this.dataTipoDocumento = result.data;
                console.log('Tipos de documento:', this.dataTipoDocumento);
            }
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }
    }
    async formValidar() {
        let dataObjeto = this.objeto ? JSON.parse(JSON.stringify(this.objeto)) : {};
        dataObjeto.sede = dataObjeto.sede || null;
        this.form = this.fb.group({
            id: [dataObjeto.idUsuario],
            rol: [dataObjeto.rol, dataObjeto.id === 0 ? Validators.required : []],
            sede: [dataObjeto.sede],
            apellidoPaterno: [dataObjeto.apellidoPaterno, [Validators.required, Validators.maxLength(100), Validators.minLength(5), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],
            apellidoMaterno: [dataObjeto.apellidoMaterno, [Validators.required, Validators.maxLength(100), Validators.minLength(5), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],
            password: [dataObjeto.password],
            tipodocumento: [dataObjeto.tipodocumento, [Validators.required]],
            numDocumento: [dataObjeto.numDocumento, [Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]],
            nombreUsuario: [dataObjeto.nombreUsuario, [Validators.required, Validators.maxLength(100), Validators.minLength(5), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],
            email: [dataObjeto.email, [Validators.required, Validators.maxLength(50), Validators.email]],
            telefono: [dataObjeto.telefono, [Validators.minLength(9), Validators.maxLength(15), Validators.pattern('^[0-9]+$')]],
            celular: [dataObjeto.celular, [Validators.minLength(9), Validators.maxLength(15), Validators.pattern('^[0-9]+$')]],
            direccion: [dataObjeto.direccion, [Validators.maxLength(150), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ,.;-\\s\\-()]+$')]]
        });
    }
    async listaUsuarios() {
        this.loading = true;
        const rolId = this.rolFiltro.idRol ?? this.rolFiltro.id;
        const url = `listaPorRol/${rolId}`;
        this.usuarioService.api_usuarios_lista(url).subscribe(
            (result: any) => {
                this.loading = false;
                const registros = Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];
                const filtroRol =
                    rolId && rolId !== 0
                        ? (obj: any) => {
                              if (obj.rol?.idRol === rolId || obj.idRol === rolId) {
                                  return true;
                              }
                              if (Array.isArray(obj.roles) && obj.roles.length) {
                                  return obj.roles.some((rol: any) => (rol.idRol ?? rol.id) === rolId);
                              }
                              return false;
                          }
                        : () => true;
                this.data = registros
                    .filter((obj: any) => filtroRol(obj))
                    .map((obj: any) => ({
                        ...obj,
                        celular: obj.celular ?? obj.CELL ?? obj.cell
                    }));
            },
            (_error: HttpErrorResponse) => {
                this.loading = false;
            }
        );
    }
    cambiarEstadoRegistro(objeto: Usuario) {
        const nuevoEstado = objeto.idEstado === 'ACTIVO' ? 'DESACTIVADO' : 'ACTIVO';
        let estado = '';
        if (objeto.idEstado == 'ACTIVO') {
            estado = 'Desactivar';
        } else {
            estado = 'Activar';
        }
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres cambiar el estado: ' + objeto.idEstado + ' a ' + estado + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loading = true;
                const data = { id: objeto.idUsuario, idEstado: nuevoEstado };
                this.usuarioService.conf_event_put(data, 'activo').subscribe(
                    (result) => {
                        if (result.p_status == 0) {
                            this.objetoDialog = false;
                            this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Estado de registro satisfactorio.' });
                            this.listaUsuarios();
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

    async editarRegistro(objeto: Usuario) {
        // Clonamos el objeto para evitar modificar la lista original
        await this.tipodocumentos();
        this.objeto = JSON.parse(JSON.stringify(objeto));
        console.log('Objeto a editar:', this.objeto);

        const idTipoDoc =
            this.objeto.tipodocumento?.idTipoDocumento ??
            this.objeto.idtipodocumento;

        const documentoSeleccionado = this.dataTipoDocumento.find(
            (item) => item.idTipoDocumento === Number(idTipoDoc)
        );

        const usuarioPatch = {
            id: this.objeto.idUsuario ?? this.objeto.id, // Corregido para mapear el ID real
            rol: this.objeto.rol ? new ClaseGeneral({ id: this.objeto.rol.idRol, descripcion: this.objeto.rol.descripcion }) : new ClaseGeneral(),
            sede: this.objeto.sede,
            tipodocumento: documentoSeleccionado,
            numDocumento: this.objeto.numDocumento,
            nombreUsuario: this.objeto.nombreUsuario,
            apellidoPaterno: this.objeto.apellidoPaterno,
            apellidoMaterno: this.objeto.apellidoMaterno,
            password: '',
            email: this.objeto.email,
            telefono: this.objeto.telefono?.toString(),
            celular: this.objeto.celular?.toString(),
            direccion: this.objeto.direccion
        };

        console.log('Objeto mapeado para editar:', usuarioPatch);

        this.form.patchValue(usuarioPatch);
        console.log('Formulario patchValue:', this.form.value);

        this.objetoDialog = true;
    }
    deleteRegistro(objeto: Usuario) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres eliminar: ' + objeto.nombreUsuario + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loading = true;
                const data = { id: objeto.idUsuario };
                this.usuarioService.conf_event_delete(data, 'eliminar').subscribe(
                    (result) => {
                        if (result.p_status == 0) {
                            this.objetoDialog = false;
                            this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro eliminado.' });
                            this.listaUsuarios();
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

    async permisosRegistro(objeto: Usuario) {
        this.loadingAgregarRol = true;
        const id = objeto.idUsuario ?? objeto.id; // Usa el ID disponible
        this.objetoUsuario = {
            id,
            email: objeto.email,
            descripcion: objeto.nombres
        };
        this.objetoRol = new ClaseGeneral();
        this.objetoDialogPermisos = true;
        this.rolAsignados(id);
    }

    rolAsignados(idusuario: any) {
        this.idUsuario = idusuario;
        this.dataRolesUsuario = [];
        let data = { id: idusuario, accion: 1 };
        this.usuarioService.conf_event_get('permisosRolPorUsuario/' + idusuario + '/' + 1).subscribe(
            (result: any) => {
                this.loadingAgregarRol = false;
                if (result.status == '0') {
                    this.dataRolesUsuario = result.data.map((r: any) => ({
                        ...r,
                        idUsuario: idusuario,
                        email: this.objetoUsuario.email
                    }));
                }
            },
            (error: HttpErrorResponse) => {
                this.loadingAgregarRol = false;
            }
        );
        data = { id: idusuario, accion: 2 };
        this.dataRolesU = [];
        this.genericoService.roles_get('permisosRolPorUsuario/' + idusuario + '/' + 2).subscribe(
            (result: any) => {
                this.loadingAgregarRol = false;
                if (result.status == '0') {
                    this.dataRolesU = result.data;
                    this.objetoRol = this.dataRolesU[0];
                }
            },
            (error: HttpErrorResponse) => {
                this.loadingAgregarRol = false;
            }
        );
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

    guardar() {
        const formValues = this.form.value;
        let tipodocumento = this.form.get('tipodocumento')?.value;
        let rol = this.form.get('rol')?.value;
        let sede = this.form.get('sede')?.value;
        const usuarioLogeado = localStorage.getItem('upsjb_reserva') || 'desconocido';
        const password = formValues.password ? formValues.password : this.objeto.password;

        console.log('ver' + rol.idRol);
        const id = Number(this.form.get('id')?.value) || 0;
        const data = {
            id,
            idUsuario: id,
            nombreUsuario: formValues.nombreUsuario,
            apellidoPaterno: formValues.apellidoPaterno,
            apellidoMaterno: formValues.apellidoMaterno,
            email: formValues.email,
            emailPersonal: formValues.emailPersonal,
            password,
            horaTrabajo: formValues.horaTrabajo,
            idSede: sede?.id,
            tipodocumento: tipodocumento
                ? { idTipoDocumento: tipodocumento.idTipoDocumento }
                : null,
            numDocumento: formValues.numDocumento,
            telefono: formValues.telefono,
            CELL: formValues.celular,
            direccion: formValues.direccion,
            roles: [{ idRol: rol.idRol }],
            usuarioCreacion: usuarioLogeado
        };

        if (!id) {
            this.usuarioService.conf_event_post(data, 'admin/register').subscribe(
                (result) => {
                    if (result.p_status == 0) {
                        this.listaUsuarios();
                        this.objetoDialog = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Satisfactorio',
                            detail: result.p_mensaje
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: result.p_mensaje
                        });
                    }
                },
                (error: HttpErrorResponse) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Ocurrió un error. Inténtelo más tarde'
                    });
                }
            );
        } else {
            // Actualización de registro
            this.usuarioService.conf_event_put(data, 'actualizar').subscribe(
                (result) => {
                    if (result.p_status == 0) {
                        this.listaUsuarios();
                        this.objetoDialog = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Satisfactorio',
                            detail: 'Registro actualizado correctamente.'
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo actualizar el registro.'
                        });
                    }
                },
                (error: HttpErrorResponse) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Ocurrió un error. Inténtelo más tarde'
                    });
                }
            );
        }
    }

    hideDialogRoles() {
        this.objetoDialogPermisos = false;
    }

    agregarRol() {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres agregar el rol: ' + this.objetoRol.descripcion + ' ?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loadingAgregarRol = true;
                const data = { idrol: this.objetoRol.idRol, idusuario: this.objetoUsuario.id };
                this.usuarioService.conf_event_post(data, 'agregar-rol').subscribe(
                    (result) => {
                        this.objetoRol = new ClaseGeneral();
                        if (result.p_status == 0) {
                            this.loadingAgregarRol = false;
                            this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro satisfactorio.' });
                            this.rolAsignados(this.objetoUsuario.id);
                        } else {
                            this.loadingAgregarRol = false;
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
                        }
                    },
                    (error: HttpErrorResponse) => {
                        this.loadingAgregarRol = false;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
                    }
                );
            }
        });
    }

    quitarRol(objeto: ClaseGeneral) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres eliminar el rol: ' + objeto.descripcion + ' ?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                this.loadingAgregarRol = true;
                const data = { idrol: objeto.idRol, idusuario: this.objetoUsuario.id };
                console.log(data);
                this.usuarioService.conf_event_post(data, 'quitar-rol').subscribe(
                    (result) => {
                        if (result.p_status == 0) {
                            this.loadingAgregarRol = false;
                            this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Modulo eliminado satisfactorio.' });
                            this.rolAsignados(this.objetoUsuario.id);
                        } else {
                            this.loadingAgregarRol = false;
                            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
                        }
                    },
                    (error: HttpErrorResponse) => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
                        this.loadingAgregarRol = false;
                    }
                );
            }
        });
    }
}
