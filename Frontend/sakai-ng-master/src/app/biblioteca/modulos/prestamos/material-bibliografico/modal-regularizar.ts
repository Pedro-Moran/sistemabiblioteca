import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { DetalleBibliotecaDTO } from '../../../interfaces/material-bibliografico/DetalleBibliotecaDTO';
import { Usuario } from '../../../interfaces/usuario';
import { InputValidation } from '../../../input-validation';
import { GenericoService } from '../../../services/generico.service';
import { DocumentoService } from '../../../services/documento.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Select } from 'primeng/select';
@Component({
    selector: 'app-modal-regularizar',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{ width: '80vw' }" header="Regularizar" [modal]="true" [closable]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <p-tabs [(value)]="activeTab">
                    <p-tablist>
                        <p-tab value="0">Datos de Usuario</p-tab>
                        <p-tab value="1">Otros Usuarios</p-tab>
                    </p-tablist>
                    <p-tabpanels>
                        <p-tabpanel value="0">
                            <form [formGroup]="form">
                                <h3 class="text-base font-semibold">Datos del usuario</h3>
                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="tipoUsuario">Tipo de usuario</label>
                                        <p-select appendTo="body" id="tipoUsuario" formControlName="tipoUsuario" [options]="tipoUsuarioLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
                                        <app-input-validation [form]="form" modelo="tipoUsuario" ver="Tipo Usuario"></app-input-validation>
                                    </div>
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="titulo">Buscar por</label>
                                        <div class="col-span-2 flex items-center gap-2">
                                            <div class="col-span-2 flex items-center gap-2">
                                                <p-radiobutton id="option1" name="tipoBuscar" value="1" formControlName="tipoBuscar" />
                                                <label for="option1">N&deg; Documento</label>
                                                <p-radiobutton id="option2" name="tipoBuscar" value="2" formControlName="tipoBuscar" />
                                                <label for="option2">Apellidos y nombres</label>
                                                <p-radiobutton id="option3" name="tipoBuscar" value="3" formControlName="tipoBuscar" />
                                                <label for="option3">Email</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="especialidad">Buscar</label>
                                        <div class="flex items-center gap-x-2">
                                            <input pInputText id="palabra-clave" type="text" formControlName="palabraBuscar" class="w-full" />
                                            <button pButton type="button" class="p-button-rounded bg-red-500 text-white" icon="pi pi-search" (click)="buscar()" [disabled]="!form.get('palabraBuscar')?.value" pTooltip="Buscar"></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                                    <div class="flex flex-col gap-2 w-full relative" (mouseenter)="toggleTablaUsuarios(true)" (mouseleave)="toggleTablaUsuarios(false)">
                                        <label for="usuario">Seleccione usuario</label>
                                        <p-select
                                            #usuarioSelect
                                            appendTo="body"
                                            id="usuario"
                                            formControlName="usuario"
                                            [options]="usuariosLista"
                                            optionLabel="descripcion"
                                            placeholder="Seleccionar"
                                            class="w-full"
                                            [style.pointer-events]="mostrarTablaUsuarios ? 'none' : 'auto'"
                                        ></p-select>
                                        <app-input-validation [form]="form" modelo="usuario" ver="usuario"></app-input-validation>
                                        <div
                                            class="absolute top-full left-0 w-full z-10 bg-white border rounded shadow transition-all duration-300 transform"
                                            [ngClass]="{ 'opacity-100 translate-y-0': mostrarTablaUsuarios, 'opacity-0 -translate-y-2 pointer-events-none': !mostrarTablaUsuarios }"
                                        >
                                            <p-table [value]="usuariosLista" [tableStyle]="{ 'min-width': '20rem' }" styleClass="p-datatable-gridlines">
                                                <ng-template pTemplate="header">
                                                    <tr>
                                                        <th>Código</th>
                                                        <th>Nombre</th>
                                                    </tr>
                                                </ng-template>
                                                <ng-template pTemplate="body" let-u>
                                                    <tr (click)="seleccionarUsuario(u)" class="cursor-pointer hover:bg-gray-100">
                                                        <td>{{ u.codigoUsuario }}</td>
                                                        <td>{{ u.descripcion }}</td>
                                                    </tr>
                                                </ng-template>
                                            </p-table>
                                        </div>
                                    </div>
                                </div>
                                <h3 class="mt-4 text-base font-semibold">Detalle de pr&eacute;stamo</h3>
                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="numeroIngreso">N&uacute;mero de ingreso</label>
                                        <input pInputText id="numeroIngreso" type="text" formControlName="numeroIngreso" class="w-full" />
                                        <app-input-validation [form]="form" modelo="numeroIngreso" ver="numeroIngreso"></app-input-validation>
                                    </div>
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="tipoMaterial">Tipo de material bibliografico</label>
                                        <p-select appendTo="body" id="tipoMaterial" formControlName="tipoMaterial" [options]="tipoMaterialLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
                                        <app-input-validation [form]="form" modelo="tipoMaterial" ver="tipoMaterial"></app-input-validation>
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="usuario">Fecha de prestamo</label>
                                        <p-datepicker appendTo="body" formControlName="fechaPrestamo" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" dateFormat="dd/mm/yy"> </p-datepicker>
                                        <app-input-validation [form]="form" modelo="fechaPrestamo" ver="Fecha Prestamo"></app-input-validation>
                                    </div>

                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="horaInicio">Hora inicio de pr&eacute;stamo</label>
                                        <p-datepicker appendTo="body" formControlName="horaInicio" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" timeOnly="true"> </p-datepicker>
                                        <app-input-validation [form]="form" modelo="horaInicio" ver="Hora Inicio"></app-input-validation>
                                    </div>

                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="horaFin">Hora fin de pr&eacute;stamo</label>
                                        <p-datepicker appendTo="body" formControlName="horaFin" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" timeOnly="true"> </p-datepicker>
                                        <app-input-validation [form]="form" modelo="horaFin" ver="Hora Fin"></app-input-validation>
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="usuarioPrestamo">Usuario de pr&eacute;stamo</label>
                                        <p-select appendTo="body" id="usuarioPrestamo" formControlName="usuarioPrestamo" [options]="usuariosPRLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
                                        <app-input-validation [form]="form" modelo="usuarioPrestamo" ver="Usuario Prestamo"></app-input-validation>
                                    </div>

                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="fechaDevolucion">Fecha de devoluci&oacute;n</label>
                                        <p-datepicker appendTo="body" formControlName="fechaDevolucion" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" dateFormat="dd/mm/yy"> </p-datepicker>
                                        <app-input-validation [form]="form" modelo="fechaDevolucion" ver="Fecha Devolución"></app-input-validation>
                                    </div>
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="usuarioRecepcion">Usuario de recepci&oacute;n</label>
                                        <p-select appendTo="body" id="usuarioRecepcion" formControlName="usuarioRecepcion" [options]="usuariosPRLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
                                        <small class="text-xs text-gray-500">Para registrar usuario de recepción debe ir al módulo devoluciones</small>
                                    </div>
                                </div>
                            </form>
                        </p-tabpanel>
                        <p-tabpanel value="1">
                            <form [formGroup]="formOtroUsuario">
                                <h3 class="text-base font-semibold">Datos del usuario</h3>
                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="tipoUsuario">Tipo de usuario</label>
                                        <p-select appendTo="body" id="tipoUsuario" formControlName="tipoUsuario" [options]="tipoUsuarioLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
                                        <app-input-validation [form]="formOtroUsuario" modelo="tipoUsuario" ver="Tipo Usuario"></app-input-validation>
                                    </div>
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="tipoDocumento">Tipo de documento</label>
                                        <p-select appendTo="body" id="tipoDocumento" formControlName="tipoDocumento" [options]="tipoDocumentoLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
                                        <app-input-validation [form]="formOtroUsuario" modelo="tipoDocumento" ver="Tipo Documento"></app-input-validation>
                                    </div>
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="nummeroDocumento">Numero Documento</label>
                                        <div class="flex items-center gap-x-2">
                                            <input pInputText id="nummeroDocumento" type="text" formControlName="nummeroDocumento" class="w-full" />
                                            <button pButton type="button" class="p-button-rounded bg-red-500 text-white" icon="pi pi-search" (click)="buscar()" [disabled]="formOtroUsuario.get('nummeroDocumento')?.invalid" pTooltip="Buscar"></button>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="nombreCompleto">Nombre completo</label>
                                        <input pInputText id="nombreCompleto" type="text" formControlName="nombreCompleto" />
                                        <app-input-validation [form]="formOtroUsuario" modelo="nombreCompleto" ver="Nombre Completo"></app-input-validation>
                                    </div>
                                </div>
                                <h3 class="mt-4 text-base font-semibold">Detalle de pr&eacute;stamo</h3>
                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="numeroIngreso">N&uacute;mero de ingreso</label>
                                        <input pInputText id="numeroIngreso" type="text" formControlName="numeroIngreso" class="w-full" />
                                        <app-input-validation [form]="formOtroUsuario" modelo="numeroIngreso" ver="Numero Ingreso"></app-input-validation>
                                    </div>
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="tipoMaterial">Tipo de material bibliografico</label>
                                        <p-select appendTo="body" id="tipoMaterial" formControlName="tipoMaterial" [options]="tipoMaterialLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
                                        <app-input-validation [form]="formOtroUsuario" modelo="tipoMaterial" ver="Tipo Material"></app-input-validation>
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="usuario">Fecha de prestamo</label>
                                        <p-datepicker appendTo="body" formControlName="fechaPrestamo" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" dateFormat="dd/mm/yy"> </p-datepicker>
                                        <app-input-validation [form]="formOtroUsuario" modelo="fechaPrestamo" ver="Fecha Prestamo"></app-input-validation>
                                    </div>

                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="horaInicio">Hora inicio de pr&eacute;stamo</label>
                                        <p-datepicker appendTo="body" formControlName="horaInicio" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" timeOnly="true"> </p-datepicker>
                                        <app-input-validation [form]="formOtroUsuario" modelo="horaInicio" ver="Hora Inicio"></app-input-validation>
                                    </div>

                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="horaFin">Hora fin de pr&eacute;stamo</label>
                                        <p-datepicker appendTo="body" formControlName="horaFin" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" timeOnly="true"> </p-datepicker>
                                        <app-input-validation [form]="formOtroUsuario" modelo="horaFin" ver="Hora Fin"></app-input-validation>
                                    </div>
                                </div>

                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="usuarioPrestamo">Usuario de pr&eacute;stamo</label>
                                        <p-select appendTo="body" id="usuarioPrestamo" formControlName="usuarioPrestamo" [options]="usuariosPRLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
                                        <app-input-validation [form]="formOtroUsuario" modelo="usuarioPrestamo" ver="Usuario Prestamo"></app-input-validation>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                                    <div class="flex items-center space-x-3 py-2">
                                        <p-checkbox id="checkDevolver" name="option" value="1" formControlName="devolver" />
                                        <label for="checkDevolver" class="ml-2">¿Desea devolver?</label>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row gap-x-4 gap-y-2" *ngIf="formOtroUsuario.get('devolver')?.value.length > 0">
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="fechaDevolucion">Fecha de devoluci&oacute;n</label>
                                        <p-datepicker appendTo="body" formControlName="fechaDevolucion" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" dateFormat="dd/mm/yy"> </p-datepicker>
                                        <app-input-validation [form]="formOtroUsuario" modelo="fechaDevolucion" ver="Fecha Devolución"></app-input-validation>
                                    </div>
                                    <div class="flex flex-col gap-2 w-full">
                                        <label for="usuarioRecepcion">Usuario de recepci&oacute;n</label>
                                        <p-select appendTo="body" id="usuarioRecepcion" formControlName="usuarioRecepcion" [options]="usuariosPRLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
                                        <small class="text-xs text-gray-500">Para registrar usuario de recepción debe ir al módulo devoluciones</small>
                                    </div>
                                </div>
                            </form>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </ng-template>
            <ng-template pTemplate="footer">
                <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                <button pButton pRipple type="button" icon="pi pi-check" [disabled]="(activeTab === '0' ? form.invalid : formOtroUsuario.invalid) || loading" (click)="guardar()" label="Guardar" class="p-button-success"></button>
            </ng-template>
        </p-dialog>

        <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
        <p-toast></p-toast>`,
    imports: [TemplateModule, InputValidation],
    providers: [MessageService, ConfirmationService]
})
export class ModalRegularizarComponent implements OnInit {
    loading: boolean = false;
    form: FormGroup = new FormGroup({});
    formOtroUsuario: FormGroup = new FormGroup({});
    display: boolean = false;
    uploadedFiles: any[] = [];
    tipoUsuarioLista: any[] = [];
    tipoDocumentoLista: any[] = [];
    usuariosLista: any[] = [];
    tipoMaterialLista: any[] = [];
    usuariosPRLista: any[] = [];
    objeto: any = null;
    maxHoras: number | null = null;
    duracionSeleccionada: number | null = null;
    radioValue: any = null;
    palabraClave: string = '';
    activeTab: string = '0';
    mostrarTablaUsuarios: boolean = false;
    @ViewChild('usuarioSelect') usuarioSelect!: Select;
    @Output() saved = new EventEmitter<DetalleBibliotecaDTO>();

    constructor(
        private fb: FormBuilder,
        private genericoService: GenericoService,
        private materialBibliograficoService: MaterialBibliograficoService,
        private documentoService: DocumentoService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.form = this.fb.group({
            tipoUsuario: ['', [Validators.required]],
            tipoBuscar: [1, [Validators.required]],
            palabraBuscar: [''],
            usuario: ['', [Validators.required]],
            numeroIngreso: ['', [Validators.required]],
            tipoMaterial: ['', [Validators.required]],
            fechaPrestamo: ['', [Validators.required]],
            horaInicio: ['', [Validators.required]],
            horaFin: ['', [Validators.required]],
            fechaDevolucion: ['', [Validators.required]],
            usuarioPrestamo: ['', [Validators.required]],
            usuarioRecepcion: ['']
        });
        // Los campos del detalle de préstamo deben poder editarse,
        // por lo que se eliminan las desactivaciones iniciales.
        this.form.get('tipoUsuario')?.valueChanges.subscribe(() => {
            this.form.patchValue({ palabraBuscar: '', usuario: null });
            this.filtrarUsuarios();
        });
        // El usuario de préstamo debe seleccionarse de manera independiente,
        // por lo que se elimina la asignación automática desde el usuario.
        this.formOtroUsuario = this.fb.group({
            tipoUsuario: ['', [Validators.required]],
            tipoDocumento: [null, [Validators.required]],
            nummeroDocumento: ['', [Validators.required]],
            nombreCompleto: ['', [Validators.required]],
            numeroIngreso: ['', [Validators.required]],
            tipoMaterial: ['', [Validators.required]],
            fechaPrestamo: ['', [Validators.required]],
            horaInicio: ['', [Validators.required]],
            horaFin: ['', [Validators.required]],
            devolver: [false, [Validators.required]],
            fechaDevolucion: ['', [Validators.required]],
            usuarioPrestamo: ['', [Validators.required]],
            usuarioRecepcion: ['']
        });
        // Los campos del detalle de préstamo para otro usuario también
        // deben permanecer habilitados.

        this.form
            .get('numeroIngreso')
            ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
            .subscribe((valor) => this.autocompletarTipoMaterial(valor, this.form));

        this.formOtroUsuario
            .get('numeroIngreso')
            ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
            .subscribe((valor) => this.autocompletarTipoMaterial(valor, this.formOtroUsuario));
        this.registrarValidacionesHoras(this.form);
        this.registrarValidacionesHoras(this.formOtroUsuario);
    }
    async ngOnInit() {
        await this.listarTiposDocumento();
        await this.listarTiposUsuario();
        await this.listarUsuariosPrestamo();
    }

    async listarTiposDocumento() {
        this.loading = true;
        this.tipoDocumentoLista = [];
        this.genericoService.tipodocumento_get('lista-activo').subscribe(
            (result: any) => {
                this.loading = false;
                if (result.status == '0') {
                    this.tipoDocumentoLista = result.data;
                    this.formOtroUsuario.get('tipoDocumento')?.setValue(this.tipoDocumentoLista[0]);
                }
            },
            (error: HttpErrorResponse) => {
                this.loading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo obtener los tipos de documento'
                });
            }
        );
    }

    async listarTiposUsuario() {
        this.genericoService.roles_get('roles/lista-roles').subscribe({
            next: (result: any) => {
                if (result.status === '0') {
                    this.tipoUsuarioLista = result.data.map((rol: any) => ({
                        id: rol.idRol ?? rol.id ?? rol.codigo,
                        descripcion: rol.descripcion
                    }));
                } else {
                    this.tipoUsuarioLista = [];
                }
            },
            error: () => {
                this.tipoUsuarioLista = [];
            }
        });
    }

    async listarUsuariosPrestamo() {
        this.loading = true;
        this.materialBibliograficoService.listarUsuarios().subscribe({
            next: (lista: Usuario[]) => {
                this.loading = false;
                this.usuariosPRLista = lista.map((u) => ({
                    descripcion: `${u.nombres ?? ''} ${u.apellidoPaterno ?? ''} ${u.apellidoMaterno ?? ''}`.trim() || u.email || u.login || u.codigo,
                    codigoUsuario: u.codigo ?? u.login ?? ''
                }));
            },
            error: () => {
                this.loading = false;
                this.usuariosPRLista = [];
            }
        });
    }

    private establecerHorario(destino: FormGroup, inicio: Date, bloquearInicio: boolean) {
        const fin = new Date(inicio.getTime() + 60 * 60 * 1000);
        destino.patchValue(
            {
                fechaPrestamo: inicio,
                fechaDevolucion: fin,
                horaInicio: inicio,
                horaFin: fin
            },
            { emitEvent: false }
        );
        this.validarMaxHoras(destino);
        if (bloquearInicio) {
            destino.get('fechaPrestamo')?.disable({ emitEvent: false });
            destino.get('horaInicio')?.disable({ emitEvent: false });
        } else {
            destino.get('fechaPrestamo')?.enable({ emitEvent: false });
            destino.get('horaInicio')?.enable({ emitEvent: false });
        }
    }

    private formatearFechaHora(fecha: Date): string {
        const fechaParte = fecha.toLocaleDateString('es-PE', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
        const horaParte = fecha.toLocaleTimeString('es-PE', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return `${fechaParte}, ${horaParte}`;
    }

    private aIsoLocal(fecha: Date | null): string | null {
        if (!fecha) {
            return null;
        }
        const offset = fecha.getTimezoneOffset() * 60000;
        return new Date(fecha.getTime() - offset).toISOString().slice(0, 19);
    }

    private registrarValidacionesHoras(destino: FormGroup) {
        ['horaInicio', 'horaFin', 'fechaPrestamo', 'fechaDevolucion'].forEach((control) => destino.get(control)?.valueChanges.subscribe(() => this.validarMaxHoras(destino)));
    }

    private validarMaxHoras(destino: FormGroup) {
        if (this.maxHoras == null) {
            return;
        }
        const fechaPrestamo: Date | null = destino.get('fechaPrestamo')?.value;
        const horaInicio: Date | null = destino.get('horaInicio')?.value;
        const horaFin: Date | null = destino.get('horaFin')?.value;
        if (!fechaPrestamo || !horaInicio || !horaFin) {
            return;
        }
        const inicio = new Date(fechaPrestamo.getFullYear(), fechaPrestamo.getMonth(), fechaPrestamo.getDate(), horaInicio.getHours(), horaInicio.getMinutes());
        const finMismoDia = new Date(fechaPrestamo.getFullYear(), fechaPrestamo.getMonth(), fechaPrestamo.getDate(), horaFin.getHours(), horaFin.getMinutes());
        let fin = finMismoDia;
        let diff = (fin.getTime() - inicio.getTime()) / 3600000;
        if (diff < 0) {
            const finDiaSiguiente = new Date(finMismoDia);
            finDiaSiguiente.setDate(finDiaSiguiente.getDate() + 1);
            const diffDiaSiguiente = (finDiaSiguiente.getTime() - inicio.getTime()) / 3600000;
            if (diffDiaSiguiente <= this.maxHoras) {
                fin = finDiaSiguiente;
                diff = diffDiaSiguiente;
            } else {
                this.messageService.add({ severity: 'warn', detail: 'La hora fin no puede ser menor que la hora de inicio.' });
                destino.patchValue({ horaFin: inicio, fechaDevolucion: inicio }, { emitEvent: false });
                return;
            }
        }
        if (diff <= this.maxHoras) {
            this.duracionSeleccionada = diff;
            destino.patchValue({ fechaDevolucion: fin }, { emitEvent: false });
            return;
        }
        this.messageService.add({ severity: 'warn', detail: `Máximo ${this.maxHoras} horas de préstamo.` });
        const horasPermitidas = Math.min(this.duracionSeleccionada ?? this.maxHoras, this.maxHoras);
        const limite = new Date(inicio.getTime() + horasPermitidas * 3600000);
        destino.patchValue({ fechaDevolucion: limite, horaFin: limite }, { emitEvent: false });
        this.duracionSeleccionada = horasPermitidas;
    }

    private autocompletarTipoMaterial(valor: string, destino: FormGroup) {
        const numero = Number(valor);
        if (!valor || isNaN(numero)) {
            this.tipoMaterialLista = [];
            destino.patchValue(
                {
                    tipoMaterial: null,
                    fechaPrestamo: null,
                    fechaDevolucion: null,
                    horaInicio: null,
                    horaFin: null
                },
                { emitEvent: false }
            );
            destino.get('fechaPrestamo')?.enable({ emitEvent: false });
            destino.get('horaInicio')?.enable({ emitEvent: false });
            this.objeto = null;
            this.maxHoras = null;
            this.duracionSeleccionada = null;
            return;
        }
        this.materialBibliograficoService.getDetalleBibliotecaPorNumeroIngreso(numero).subscribe({
            next: (detalle: DetalleBibliotecaDTO) => {
                this.objeto = detalle;
                this.maxHoras = detalle.maxHoras ?? null;
                this.duracionSeleccionada = this.maxHoras;
                if (detalle?.tipoMaterial) {
                    this.tipoMaterialLista = [detalle.tipoMaterial];
                    destino.get('tipoMaterial')?.setValue(detalle.tipoMaterial);
                } else {
                    this.tipoMaterialLista = [];
                    destino.get('tipoMaterial')?.setValue(null);
                }

                const fechaPrestamo = detalle.fechaPrestamo ? new Date(detalle.fechaPrestamo) : null;
                const fechaDevolucion = detalle.fechaDevolucion ? new Date(detalle.fechaDevolucion) : null;

                destino.patchValue(
                    {
                        fechaPrestamo,
                        fechaDevolucion,
                        horaInicio: fechaPrestamo,
                        horaFin: fechaDevolucion
                    },
                    { emitEvent: false }
                );

                const estado = (detalle.estadoDescripcion ?? '').toUpperCase();
                const prestado = detalle.idEstado === 4 || estado.includes('PRESTADO') || (fechaDevolucion != null && fechaDevolucion.getTime() > Date.now());
                if (prestado) {
                    const disponible = fechaDevolucion ? this.formatearFechaHora(fechaDevolucion) : '';
                    this.confirmationService.confirm({
                        header: 'Material no disponible',
                        message: disponible ? `Material prestado a otro usuario.<br/>El material se encuentra disponible en este horario:<br/><strong>${disponible}</strong><br/>¿Desea pre-registrar?` : 'Material prestado a otro usuario.',
                        icon: 'pi pi-exclamation-triangle',
                        acceptLabel: 'Aceptar',
                        rejectLabel: 'Cancelar',
                        closeOnEscape: false,
                        accept: () => this.establecerHorario(destino, fechaDevolucion || new Date(), true),
                        reject: () => destino.get('numeroIngreso')?.reset()
                    });
                } else {
                    this.establecerHorario(destino, new Date(), false);
                }
            },
            error: () => {
                this.tipoMaterialLista = [];
                destino.get('tipoMaterial')?.setValue(null);
                this.objeto = null;
                this.maxHoras = null;
                this.duracionSeleccionada = null;
                this.messageService.add({
                    severity: 'warn',
                    summary: 'No encontrado',
                    detail: 'No se encontró material para el número ingresado'
                });
            }
        });
    }
    openModal(detalle: DetalleBibliotecaDTO | null = null) {
        this.objeto = detalle;
        this.maxHoras = null;
        this.duracionSeleccionada = null;
        this.form.reset({ tipoBuscar: 1, horaInicio: null, horaFin: null });
        this.formOtroUsuario.reset({ devolver: false, horaInicio: null, horaFin: null });
        this.form.get('fechaPrestamo')?.enable({ emitEvent: false });
        this.form.get('horaInicio')?.enable({ emitEvent: false });
        this.formOtroUsuario.get('fechaPrestamo')?.enable({ emitEvent: false });
        this.formOtroUsuario.get('horaInicio')?.enable({ emitEvent: false });
        if (detalle) {
            const fechaPrestamo = detalle.fechaPrestamo ? new Date(detalle.fechaPrestamo) : null;
            const fechaDevolucion = detalle.fechaDevolucion ? new Date(detalle.fechaDevolucion) : fechaPrestamo ? new Date(fechaPrestamo.getTime() + 7 * 24 * 60 * 60 * 1000) : null;
            if (fechaPrestamo && fechaDevolucion) {
                this.maxHoras = (fechaDevolucion.getTime() - fechaPrestamo.getTime()) / 3600000;
            } else {
                this.maxHoras = detalle?.maxHoras ?? null;
            }
            this.duracionSeleccionada = this.maxHoras;
            if (detalle.tipoMaterial) {
                this.tipoMaterialLista = [detalle.tipoMaterial];
            }
            const usuarioPrestamo = detalle.usuarioPrestamo ? this.usuariosPRLista.find((u) => u.descripcion === detalle.usuarioPrestamo) || { descripcion: detalle.usuarioPrestamo } : null;
            if (usuarioPrestamo && !this.usuariosPRLista.some((u) => u.descripcion === usuarioPrestamo.descripcion)) {
                this.usuariosPRLista = [usuarioPrestamo, ...this.usuariosPRLista];
            }
            this.form.patchValue(
                {
                    numeroIngreso: detalle.numeroIngreso ?? '',
                    tipoMaterial: detalle.tipoMaterial ?? null,
                    fechaPrestamo,
                    fechaDevolucion,
                    horaInicio: fechaPrestamo,
                    horaFin: fechaDevolucion,
                    usuarioPrestamo
                },
                { emitEvent: false }
            );
        }
        this.cargarUsuarios(detalle?.codigoUsuario ?? '');
        this.display = true;
    }

    closeModal() {
        this.display = false;
    }
    guardar() {
        this.loading = true;
        const datosRaw = this.activeTab === '0' ? this.form.getRawValue() : this.formOtroUsuario.getRawValue();
        const datos =
            this.activeTab === '0'
                ? datosRaw
                : {
                      ...datosRaw,
                      tipoDocumento: this.obtenerCodigoDocumento(datosRaw.tipoDocumento)
                  };
        const payload = {
            ...datos,
            numeroIngreso: Number(datos.numeroIngreso),
            fechaPrestamo: this.aIsoLocal(datos.fechaPrestamo),
            fechaDevolucion: this.aIsoLocal(datos.fechaDevolucion),
            horaInicio: this.aIsoLocal(datos.horaInicio),
            horaFin: this.aIsoLocal(datos.horaFin)
        };
        this.materialBibliograficoService.regularizarPrestamo(payload).subscribe({
            next: (resp: any) => {
                this.loading = false;
                this.display = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Listo',
                    detail: 'Préstamo regularizado.'
                });
                this.saved.emit(resp?.data);
            },
            error: (e: HttpErrorResponse) => {
                this.loading = false;
                const detail = e.status === 403 ? 'No tiene permisos para regularizar el préstamo' : 'No se pudo regularizar el préstamo';
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail
                });
            }
        });
    }
    buscar() {
        if (this.activeTab === '0') {
            this.filtrarUsuarios();
        } else {
            this.buscarPorDocumento();
        }
    }

    private buscarPorDocumento() {
        const doc = this.formOtroUsuario.get('tipoDocumento')?.value;
        const tipo = this.obtenerCodigoDocumento(doc);
        const numero = (this.formOtroUsuario.get('nummeroDocumento')?.value || '').trim();
        if (!tipo || !numero) {
            return;
        }
        this.loading = true;
        this.documentoService.consultar(tipo, numero).subscribe((data: any) => {
            this.loading = false;
            if (data) {
                let nombre = data.NombreCompleto || data.NAME || `${data.Nombres ?? ''} ${data.ApellidoPaterno ?? ''} ${data.ApellidoMaterno ?? ''}`.trim();
                if (typeof nombre === 'string') {
                    nombre = nombre.replace(',', ' ').trim();
                }
                this.formOtroUsuario.get('nombreCompleto')?.setValue(nombre);
            } else {
                this.formOtroUsuario.get('nombreCompleto')?.setValue('');
                this.messageService.add({
                    severity: 'warn',
                    summary: 'No encontrado',
                    detail: 'No se encontró el documento'
                });
            }
        });
    }

    private obtenerCodigoDocumento(doc: any): string | null {
        const tipo = doc?.codigo ?? doc?.code ?? doc?.idTipoDocumento ?? doc?.id;
        return tipo != null ? String(tipo).padStart(2, '0') : null;
    }

    private cargarUsuarios(codigoSeleccionado: string) {
        const tipoInicial = this.tipoUsuarioLista[0];
        if (codigoSeleccionado) {
            this.loading = true;
            this.materialBibliograficoService.listarUsuarios(codigoSeleccionado).subscribe({
                next: (usuarios: Usuario[]) => {
                    this.loading = false;
                    const uSel = usuarios.find((u) => u.codigo === codigoSeleccionado || u.login === codigoSeleccionado);
                    const tipoSel = uSel ? this.tipoUsuarioLista.find((t) => String(t.id) === String(uSel.tipoUsuarioCodigo) || t.descripcion === uSel.tipoUsuario) : tipoInicial;
                    this.form.get('tipoUsuario')?.setValue(tipoSel || tipoInicial);
                    this.filtrarUsuarios(codigoSeleccionado);
                },
                error: () => {
                    this.loading = false;
                    this.form.get('tipoUsuario')?.setValue(tipoInicial);
                    this.filtrarUsuarios();
                }
            });
        } else {
            this.form.get('tipoUsuario')?.setValue(tipoInicial);
            this.filtrarUsuarios();
        }
    }

    private filtrarUsuarios(codigoSeleccionado: string = '') {
        const tipoId = String(this.form.get('tipoUsuario')?.value?.id ?? '');
        const termino = (this.form.get('palabraBuscar')?.value || '').trim();
        const tipoFiltro = String(this.form.get('tipoBuscar')?.value ?? '');
        this.loading = true;
        this.materialBibliograficoService.listarUsuarios(termino, tipoId, tipoFiltro).subscribe({
            next: (lista: Usuario[]) => {
                this.loading = false;
                this.usuariosLista = lista.map((u) => ({
                    descripcion: `${u.nombres ?? ''} ${u.apellidoPaterno ?? ''} ${u.apellidoMaterno ?? ''}`.trim() || u.email || u.login || u.codigo,
                    codigoUsuario: u.codigo ?? u.login ?? ''
                }));
                if (codigoSeleccionado) {
                    const u = this.usuariosLista.find((us) => us.codigoUsuario === codigoSeleccionado);
                    if (u) {
                        this.form.get('usuario')?.setValue(u);
                    }
                } else {
                    this.form.get('usuario')?.setValue(null);
                }
            },
            error: () => {
                this.loading = false;
                this.usuariosLista = [];
                this.form.get('usuario')?.setValue(null);
            }
        });
    }

    toggleTablaUsuarios(estado: boolean) {
        this.mostrarTablaUsuarios = estado;
        if (estado) {
            this.usuarioSelect?.hide();
        }
    }

    seleccionarUsuario(u: Usuario) {
        this.form.get('usuario')?.setValue(u);
        this.mostrarTablaUsuarios = false;
    }
}
