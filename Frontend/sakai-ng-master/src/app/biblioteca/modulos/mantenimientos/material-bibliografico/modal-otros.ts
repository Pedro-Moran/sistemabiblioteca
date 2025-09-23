import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { Table } from 'primeng/table';
import { Menu } from 'primeng/menu';
import { InputValidation } from '../../../input-validation';
import { AnioPublicacion } from '../../../interfaces/material-bibliografico/anio-publicacion';
import { DescripcionFisica } from '../../../interfaces/material-bibliografico/descripcion-fisica';
import { Detalle } from '../../../interfaces/material-bibliografico/detalle';
import { DetalleDisplay } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { Editorial } from '../../../interfaces/material-bibliografico/editorial';
import { Especialidad } from '../../../interfaces/material-bibliografico/especialidad';
import { Otro } from '../../../interfaces/material-bibliografico/otro';
import { Periodicidad } from '../../../interfaces/material-bibliografico/periodicidad';
import { TipoAdquisicion } from '../../../interfaces/material-bibliografico/tipo-adquisicion';
import { TipoMaterial } from '../../../interfaces/material-bibliografico/tipo-material';
import { Sedes } from '../../../interfaces/sedes';
import { BibliotecaDTO, DetalleBibliotecaDTO } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../../environments/environment';
@Component({
    selector: 'app-modal-otros',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{ width: '95%' }" header="Información de Artículos" [modal]="true" [closable]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <form [formGroup]="formOtro">
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full md:w-1/4">
                            <label for="codigo">Codigo</label>
                            <input pInputText id="codigo" type="text" formControlName="codigo" />
                            <app-input-validation [form]="formOtro" modelo="codigo" ver="codigo"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 w-full md:w-1/2">
                            <label for="autorPrincipal">Autor</label>
                            <input pInputText id="autorPrincipal" type="text" formControlName="autorPrincipal" />
                            <app-input-validation [form]="formOtro" modelo="autorPrincipal" ver="autorPrincipal"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="tituloArticulo">Titulo de articulo</label>
                            <input pInputText id="tituloArticulo" type="text" formControlName="tituloArticulo" />
                            <app-input-validation [form]="formOtro" modelo="tituloArticulo" ver="tituloArticulo"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="tituloRevista">Titulo de revista fuente</label>
                            <input pInputText id="tituloRevista" type="text" formControlName="tituloRevista" />
                            <app-input-validation [form]="formOtro" modelo="tituloRevista" ver="tituloRevista"></app-input-validation>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="descripcionRevista">Descripcion de la revista fuente</label>
                            <input pInputText id="descripcionRevista" type="text" formControlName="descripcionRevista" />
                            <app-input-validation [form]="formOtro" modelo="descripcionRevista" ver="descripcionRevista"></app-input-validation>
                        </div>
                    </div>

                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="cantidad">Cantidad</label>
                            <input pInputText id="cantidad" type="text" formControlName="cantidad" />
                            <app-input-validation [form]="formOtro" modelo="cantidad" ver="cantidad"></app-input-validation>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-4 w-full">
                            <div class="flex items-center space-x-3 py-2">
                                <p-checkbox id="checkFormatoDigital" name="option" value="1" formControlName="formatoDigital" />
                                <label for="checkFormatoDigital" class="ml-2">¿Tiene formato digital?</label>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full" *ngIf="formOtro.get('formatoDigital')?.value">
                            <label for="urlPublicacion">Link de Publicaci&oacute;n</label>
                            <input pInputText id="urlPublicacion" type="text" formControlName="urlPublicacion" />
                            <app-input-validation [form]="formOtro" modelo="urlPublicacion" ver="urlPublicacion"></app-input-validation>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="descriptores">Descriptores</label>
                            <textarea pTextarea id="descriptores" rows="8" formControlName="descriptores"></textarea>

                            <app-input-validation [form]="formOtro" modelo="descriptores" ver="descriptores"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="notasGeneral">Nota General</label>
                            <textarea pTextarea id="notasGeneral" rows="8" formControlName="notasGeneral"></textarea>

                            <app-input-validation [form]="formOtro" modelo="notasGeneral" ver="notasGeneral"></app-input-validation>
                        </div>
                    </div>
                </form>
            </ng-template>
            <ng-template pTemplate="footer">
                <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                <button pButton pRipple type="button" icon="pi pi-check" (click)="guardarLibro()" [disabled]="formOtro.invalid || loading" label="Siguiente" class="p-button-success"></button>
            </ng-template>
        </p-dialog>
        <!-- MODAL PARA AGREGAR ESPECIALIDAD -->
        <p-dialog [(visible)]="mostrarModalEspecialidad" header="Nueva Especialidad" [modal]="true" [closable]="true" [resizable]="false" [draggable]="false" [style]="{ width: '400px' }">
            <ng-template pTemplate="content">
                <form [formGroup]="formEspecialidad">
                    <div class="flex flex-col gap-4">
                        <label for="nuevaEspecialidad">Especialidad</label>
                        <input pInputText id="nuevaEspecialidad" type="text" formControlName="descripcion" placeholder="Ingrese nueva especialidad" />
                        <app-input-validation [form]="formEspecialidad" modelo="descripcion" ver="descripcion"></app-input-validation>
                    </div>
                </form>
            </ng-template>
            <ng-template pTemplate="footer">
                <button pButton type="button" label="Cancelar" class="p-button-text" [disabled]="loading" (click)="cerrarModalEspecialidad()"></button>
                <button pButton type="button" label="Guardar" class="p-button-success" [disabled]="formEspecialidad.invalid || loading" (click)="guardarEspecialidad()"></button>
            </ng-template>
        </p-dialog>

        <!--MODAL DETALLE-->
        <p-dialog [(visible)]="displayDetalle" [style]="{ width: '95%' }" header="Detalle" [modal]="true" [closable]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <p-toolbar styleClass="mb-6">
                    <ng-template #start>
                        <form [formGroup]="formPortada">
                            <div class="flex flex-col md:flex-row gap-x-2 gap-y-2">
                                <div class="flex flex-col gap-2 w-full">
                                    <div class="flex items-center space-x-3 py-2">
                                        <p-checkbox id="checkPortada" name="option" value="1" formControlName="portada" />
                                        <label for="checkPortada" class="ml-2">¿Desea adjuntar portada de libro?</label>
                                    </div>
                                    <app-input-validation [form]="formPortada" modelo="portada" ver="portada"></app-input-validation>
                                </div>
                                <div class="flex flex-col gap-2 w-full" *ngIf="formPortada.get('portada')?.value">
                                    <label for="adjunto">Portada</label>
                                    <p-fileupload #fu mode="basic" chooseLabel="Seleccionar" chooseIcon="pi pi-upload" name="adjunto" accept="image/*" maxFileSize="1000000" (onSelect)="onFileSelect($event)">
                                        <ng-template pTemplate="empty"> Ningún archivo seleccionado </ng-template>
                                    </p-fileupload>
                                    <img *ngIf="portadaUrl" [src]="portadaUrl" alt="Portada" class="h-48 w-auto object-contain mt-2" />
                                    <app-input-validation [form]="formPortada" modelo="adjunto" ver="adjunto"></app-input-validation>
                                </div>
                            </div>
                        </form>
                    </ng-template>
                    <ng-template #end>
                        <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoEjemplar()" pTooltip="Nuevo registro" tooltipPosition="bottom"></button>
                    </ng-template>
                </p-toolbar>

                <p-table
                    #dt1
                    [value]="detalles"
                    dataKey="id"
                    [rows]="10"
                    [showCurrentPageReport]="true"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                    [rowsPerPageOptions]="[10, 25, 50]"
                    [loading]="loading"
                    [rowHover]="true"
                    styleClass="p-datatable-gridlines"
                    [paginator]="true"
                    [globalFilterFields]="['id', 'codigoBarra', 'existencia', 'sede.descripcion', 'tipoMaterial.descripcion', 'fechaIngreso', 'tipoAdquisicion.descripcion', 'costo', 'nroFactura']"
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
                            <th spSortableColumn="sede.descripcion">Local/Filial <p-sortIcon field="sede.descripcion"></p-sortIcon></th>
                            <th pSortableColumn="codigoBarra">Código Barra <p-sortIcon field="codigoBarra"></p-sortIcon></th>
                            <th pSortableColumn="fechaIngreso">Fecha Ingreso <p-sortIcon field="fechaIngreso"></p-sortIcon></th>
                            <th style="width: 4rem">Opciones</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-objeto let-rowIndex="rowIndex">
                        <tr>
                            <td>
                                {{ objeto.sede?.descripcion }}
                            </td>
                            <td>
                                {{ objeto.codigoBarra }}
                            </td>
                            <td>
                                {{ objeto.fechaIngreso | date: 'dd-MM-yyyy' }}
                            </td>
                            <td class="text-center">
                                <div style="position: relative;">
                                    <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="showMenu($event, objeto, rowIndex)"></button>
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
            </ng-template>
            <ng-template pTemplate="footer">
                <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModalDetalle()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                <button pButton pRipple type="button" icon="pi pi-check" (click)="finalizar()" [disabled]="formOtro.invalid || formPortada.invalid || loading" label="Guardar" class="p-button-success"></button>
            </ng-template>
        </p-dialog>
        <p-dialog [(visible)]="displayEjemplar" [style]="{ width: '75%' }" header="Registro" [modal]="true" [closable]="true" styleClass="p-fluid" [contentStyle]="{ overflow: 'visible' }">
            <ng-template pTemplate="content">
                <form [formGroup]="formDetalle">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="sede">Local/Filial</label>
                            <p-select appendTo="body" formControlName="sede" [options]="sedesLista" optionLabel="descripcion" placeholder="Seleccionar" />
                            <app-input-validation [form]="formDetalle" modelo="sede" ver="Sede"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="codigoBarra">Código de barras</label>
                            <input pInputText id="codigoBarra" type="text" formControlName="codigoBarra" />
                            <app-input-validation [form]="formDetalle" modelo="codigoBarra" ver="Código de barras"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 w-full">
                            <label for="fechaIngreso">Fecha Ingreso</label>
                            <p-datepicker appendTo="body" formControlName="fechaIngreso" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" dateFormat="dd/mm/yy"> </p-datepicker>

                            <app-input-validation [form]="formDetalle" modelo="fechaIngreso" ver="Fecha Ingreso"></app-input-validation>
                            <label for="horaInicio">Hora Inicio</label>
                            <p-calendar id="horaInicio" formControlName="horaInicio" timeOnly="true" hourFormat="24" appendTo="body" class="w-full"></p-calendar>
                            <app-input-validation [form]="formDetalle" modelo="horaInicio" ver="Hora Inicio"></app-input-validation>
                            <label for="horaFin">Hora Fin</label>
                            <p-calendar id="horaFin" formControlName="horaFin" timeOnly="true" hourFormat="24" appendTo="body" class="w-full"></p-calendar>
                            <app-input-validation [form]="formDetalle" modelo="horaFin" ver="Hora Fin"></app-input-validation>
                            <label for="maxHoras">Máx Horas</label>
                            <input pInputText id="maxHoras" type="number" formControlName="maxHoras" />
                            <app-input-validation [form]="formDetalle" modelo="maxHoras" ver="Máx Horas"></app-input-validation>
                        </div>
                    </div>
                </form>
            </ng-template>
            <ng-template pTemplate="footer">
                <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModalEjemplar()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                <button pButton pRipple type="button" icon="pi pi-check" (click)="guardarEjemplar()" [disabled]="formDetalle.invalid || loading" label="Guardar" class="p-button-success"></button>
            </ng-template>
        </p-dialog>
        <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
        <p-toast></p-toast>`,
    styles: [
        `
            :host ::ng-deep label {
                white-space: normal !important;
                overflow: visible !important;
                text-overflow: initial !important;
            }
        `
    ],
    imports: [TemplateModule, InputValidation],
    providers: [MessageService, ConfirmationService]
})
export class ModalOtrosComponent implements OnInit {
    loading: boolean = false;
    formOtro: FormGroup = new FormGroup({});
    formDetalle: FormGroup = new FormGroup({});
    formPortada: FormGroup = new FormGroup({});
    formEspecialidad: FormGroup = new FormGroup({});
    display: boolean = false;
    displayEditorial: boolean = false;
    displayDetalle: boolean = false;
    displayEjemplar: boolean = false;
    objetoOtro: Otro = new Otro();
    objetoEditorial: Editorial = new Editorial();
    objetoDetalle: Detalle = new Detalle();
    detalles: DetalleDisplay[] = [];
    @ViewChild('filter') filter!: ElementRef;
    selectedItem: any;
    selectedIndex!: number;
    editingIndex: number | null = null;
    @ViewChild('menu') menu!: Menu;
    especialidadLista: Especialidad[] = [];
    paisLista: Especialidad[] = [];
    ciudadLista: Especialidad[] = [];
    periodicidadLista: Periodicidad[] = [];
    descripcionFisicaLista: DescripcionFisica[] = [];
    anioPublicacionLista: AnioPublicacion[] = [];
    sedesLista: Sedes[] = [];
    tipoMaterialLista: TipoMaterial[] = [];
    tipoAdquisicionLista: TipoAdquisicion[] = [];
    mostrarModalEspecialidad: boolean = false;
    nuevaEspecialidad: string = '';
    items!: MenuItem[];
    uploadedFiles: any[] = [];
    selectedFile: File | null = null;
    portadaUrl: string | null = null;
    rutaImagen: string | null = null;
    nombreImagen: string | null = null;
    @Input() tipoMaterialId!: number | null;
    @Output() saved = new EventEmitter<void>();
    constructor(
        private fb: FormBuilder,
        private genericoService: GenericoService,
        private materialBibliograficoService: MaterialBibliograficoService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private authService: AuthService
    ) {
        this.formEspecialidad = this.fb.group({
            descripcion: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]]
        });
        this.formPortada = this.fb.group({
            portada: [this.objetoOtro.portada],
            adjunto: ['']
        });
        this.formOtro = this.fb.group({
            id: [this.objetoOtro.id],
            tipoMaterialId: [null],
            codigo: [this.objetoOtro.codigo, [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9./]+$')]],
            tituloArticulo: [
                this.objetoOtro.tituloArticulo,
                [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ],
            tituloRevista: [
                this.objetoOtro.tituloRevista,
                [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ],
            autorPrincipal: [
                this.objetoOtro.autorPrincipal,
                [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ],
            descripcionRevista: [
                this.objetoOtro.descripcionRevista,
                [
                    Validators.required,
                    Validators.maxLength(250),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ],
            cantidad: [this.objetoOtro?.cantidad, [Validators.required, Validators.maxLength(100), Validators.pattern('^[0-9]+$')]],
            formatoDigital: [this.objetoOtro.formatoDigital],
            urlPublicacion: [this.objetoOtro.urlPublicacion],
            descriptores: [
                this.objetoOtro.descriptores,
                [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ],
            notasGeneral: [
                this.objetoOtro.notasGeneral,
                [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ]
        });

        this.items = [
            {
                label: 'Actualizar',
                icon: 'pi pi-pencil',
                command: () => this.editarDetalle(this.selectedItem, this.selectedIndex)
            },
            {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () => this.deleteRegistro(this.selectedItem)
            }
        ];
        this.formValidarDetalle();
    }
    formValidarDetalle() {
        this.formDetalle = this.fb.group({
            sede: [this.objetoDetalle?.sede, [Validators.required]],
            tipoMaterial: [this.objetoDetalle?.tipoMaterial],
            codigoBarra: [this.objetoDetalle?.codigoBarra, [Validators.required, Validators.maxLength(50), Validators.pattern('^[0-9]+$')]],
            fechaIngreso: [this.objetoDetalle?.fechaIngreso, [Validators.required]],
            horaInicio: [this.objetoDetalle?.horaInicio ? this.stringToDate(this.objetoDetalle.horaInicio) : null, [Validators.required]],
            horaFin: [this.objetoDetalle?.horaFin ? this.stringToDate(this.objetoDetalle.horaFin) : null, [Validators.required]],
            maxHoras: [this.objetoDetalle?.maxHoras ?? null, [Validators.required, Validators.min(1)]],
            tipoAdquisicion: [this.objetoDetalle?.tipoAdquisicion]
        });
    }

    async ngOnInit() {
        await this.ListaEspecialidad();
        await this.ListaPais();
        await this.ListaCiudad();
        await this.ListaPeriodicidad();
        await this.ListaDescripcionFisica();
        await this.ListaAnioPublicacion();
        await this.ListaSede();
        await this.ListaTipoMaterial();
        await this.ListaTipoAdquisicion();
        await this.ListaDetalle();
    }

    openModal(tipoId?: number | null) {
        this.objetoOtro = new Otro();
        this.objetoDetalle = new Detalle();
        this.detalles = [];
        this.selectedFile = null;
        this.portadaUrl = null;
        this.rutaImagen = null;
        this.nombreImagen = null;

        this.formOtro.reset();
        this.formDetalle.reset();
        this.formPortada.reset({ portada: false, adjunto: '' });

        const id = tipoId ?? this.tipoMaterialId ?? null;
        this.formOtro.patchValue({ tipoMaterialId: id });
        this.tipoMaterialId = id;
        this.display = true;
    }
    editarBiblioteca(mat: BibliotecaDTO, tipoId?: number | null) {
        const id = tipoId ?? this.tipoMaterialId ?? null;
        this.formOtro.reset();
        this.objetoOtro.id = mat.id ?? 0;
        this.objetoOtro.codigo = mat.codigoLocalizacion ?? '';
        this.rutaImagen = mat.rutaImagen ?? null;
        this.nombreImagen = mat.nombreImagen ?? null;
        this.portadaUrl = this.buildImageUrl(mat.rutaImagen, mat.nombreImagen);
        this.selectedFile = null;
        this.formPortada.patchValue({ portada: !!this.portadaUrl, adjunto: '' });
        this.formOtro.patchValue({
            id: mat.id ?? null,
            tipoMaterialId: id,
            codigo: mat.codigoLocalizacion,
            tituloArticulo: mat.titulo,
            tituloRevista: mat.editorialPublicacion,
            autorPrincipal: mat.autorPersonal,
            descripcionRevista: (mat as any).descripcionRevista ?? mat.descriptor ?? '',
            cantidad: mat.numeroPaginas,
            formatoDigital: mat.fladigitalizado,
            urlPublicacion: mat.linkPublicacion,
            descriptores: mat.descriptor,
            notasGeneral: mat.notaGeneral
        });
        this.tipoMaterialId = id;
        this.display = true;
        this.ListaDetalle();
    }

    closeModal() {
        this.display = false;
    }
    closeModalDetalle() {
        this.displayDetalle = false;
    }
    closeModalEjemplar() {
        this.displayEjemplar = false;
    }
    guardarLibro() {
        this.loading = false;
        this.display = false;
        this.displayDetalle = true;
    }
    private buildDto(): BibliotecaDTO {
        const otro = this.formOtro.value;
        const decoded = this.authService.getUser();
        const parentTipo = otro.tipoMaterialId ?? this.tipoMaterialId ?? null;
        const keepPortada = this.formPortada.get('portada')?.value;

        const detalles: DetalleBibliotecaDTO[] = this.detalles.map((d) => ({
            idDetalleBiblioteca: d.idDetalleBiblioteca ?? undefined,
            codigoSede: d.codigoSede ?? null,
            tipoAdquisicionId: (d.tipoAdquisicion as any)?.id ?? d.tipoAdquisicionId ?? null,
            tipoMaterialId: (d.tipoMaterial as any)?.id ?? d.tipoMaterialId ?? parentTipo,
            horaInicio: this.timeToString(d.horaInicio ?? null),
            horaFin: this.timeToString(d.horaFin ?? null),
            maxHoras: d.maxHoras ?? null,
            costo: d.costo ?? null,
            numeroFactura: d.numeroFactura ?? null,
            fechaIngreso: d.fechaIngreso ?? null,
            codigoBarra: d.codigoBarra ?? null,
            idEstado: 1
        }));

        return {
            id: otro.id > 0 ? otro.id : null,
            codigoLocalizacion: otro.codigo,
            titulo: otro.tituloArticulo,
            autorPersonal: otro.autorPrincipal,
            tipoMaterialId: otro.tipoMaterialId ?? this.tipoMaterialId ?? null,
            editorialPublicacion: otro.tituloRevista,
            descripcionRevista: otro.descripcionRevista,
            descriptor: otro.descriptores,
            notaGeneral: otro.notasGeneral,
            fladigitalizado: !!otro.formatoDigital,
            linkPublicacion: otro.urlPublicacion,
            numeroPaginas: otro.cantidad,
            rutaImagen: keepPortada ? (this.selectedFile ? undefined : (this.rutaImagen ?? undefined)) : null,
            nombreImagen: keepPortada ? (this.selectedFile ? undefined : (this.nombreImagen ?? undefined)) : null,
            estadoId: 1,
            usuarioCreacion: decoded.sub,
            fechaCreacion: new Date().toISOString(),
            detalles
        };
    }

    finalizar() {
        if (this.formOtro.invalid || this.detalles.length === 0) {
            this.messageService.add({ severity: 'warn', summary: 'Campos obligatorios', detail: 'Revisa los formularios' });
            return;
        }
        const dto = this.buildDto();
        this.loading = true;
        const req$ = dto.id ? this.materialBibliograficoService.update(dto.id, dto, this.selectedFile ?? undefined) : this.materialBibliograficoService.create(dto, this.selectedFile ?? undefined);
        req$.subscribe({
            next: ({ status }) => {
                this.loading = false;
                if (status === 0) {
                    const detail = dto.id ? 'Guardado correctamente' : 'Material bibliográfico pendiente de aprobación. Revise el módulo Aceptaciones MB.';
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail });
                    this.displayDetalle = false;
                    this.saved.emit();
                }
            },
            error: () => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la biblioteca' });
            }
        });
    }

    async ListaEspecialidad() {
        try {
            const result: any = await this.materialBibliograficoService.lista_especialidad('material-bibliografico/especialidad').toPromise();
            if (result.status == 0) {
                this.especialidadLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }
    }
    async ListaPais() {
        try {
            const result: any = await this.materialBibliograficoService.lista_pais('material-bibliografico/pais').toPromise();
            if (result.status == 0) {
                this.paisLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }
    }
    async ListaCiudad() {
        const paisId = this.formOtro.get('pais')?.value;
        if (!paisId) {
            return;
        }
        try {
            const result: any = await this.materialBibliograficoService.lista_ciudad(`material-bibliografico/ciudad-by-pais/${paisId}`).toPromise();
            if (result.status === 0) {
                this.ciudadLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }
    }
    async ListaPeriodicidad() {
        try {
            const result: any = await this.materialBibliograficoService.lista_periodicidad('material-bibliografico/periodicidad').toPromise();
            if (result.status == 0) {
                this.periodicidadLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }
    }
    async ListaDescripcionFisica() {
        try {
            const result: any = await this.materialBibliograficoService.lista_descripcion_fisica('material-bibliografico/ciudad').toPromise();
            if (result.status == 0) {
                this.descripcionFisicaLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }
    }
    async ListaAnioPublicacion() {
        try {
            const result: any = await this.materialBibliograficoService.lista_anio_publicacion('material-bibliografico/ciudad').toPromise();
            if (result.status == 0) {
                this.anioPublicacionLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }
    }

    async ListaSede() {
        try {
            const result: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
            if (result.status == 0) {
                this.sedesLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
        }
    }
    async ListaTipoMaterial() {
        try {
            const result: any = await this.genericoService.sedes_get('material-bibliografico/list').toPromise();
            if (result.status === 0) {
                this.tipoMaterialLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
        }
    }
    async ListaTipoAdquisicion() {
        try {
            const result: any = await this.materialBibliograficoService.lista_tipo_adquisicion('material-bibliografico/adquisicion').toPromise();
            if (result.status === 0) {
                this.tipoAdquisicionLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
        }
    }
    async ListaDetalle() {
        const idBib = this.objetoOtro?.id;
        if (!idBib) {
            return;
        }
        try {
            const data = await this.materialBibliograficoService.listarDetallesPorBiblioteca(idBib, false).toPromise();

            this.detalles = (data ?? []).map((d) => {
                const sedeId = d.codigoSede ?? d.biblioteca?.sedeId ?? null;
                const tipoMat = d.tipoMaterialId ?? d.biblioteca?.tipoMaterialId ?? null;
                const tipoAdq = d.tipoAdquisicionId ?? d.biblioteca?.tipoAdquisicionId ?? null;

                const sedeObj = this.sedesLista.find((s) => s.id === sedeId) ?? null;
                const tipoMatObj = this.tipoMaterialLista.find((t) => t.id === tipoMat) ?? null;
                const tipoAdqObj = this.tipoAdquisicionLista.find((t) => t.id === tipoAdq) ?? null;

                return {
                    idDetalleBiblioteca: d.idDetalleBiblioteca,
                    codigoSede: sedeId,
                    tipoMaterialId: tipoMat,
                    tipoAdquisicionId: tipoAdq,
                    horaInicio: d.horaInicio ?? null,
                    horaFin: d.horaFin ?? null,
                    maxHoras: d.maxHoras ?? null,
                    costo: d.costo ?? null,
                    numeroFactura: d.numeroFactura ?? null,
                    fechaIngreso: d.fechaIngreso ?? null,
                    codigoBarra: d.codigoBarra ?? null,
                    sede: sedeObj,
                    tipoMaterial: tipoMatObj,
                    tipoAdquisicion: tipoAdqObj,
                    idEstado: d.idEstado
                } as DetalleDisplay;
            });
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }
    }
    abrirModalEspecialidad() {
        this.mostrarModalEspecialidad = true;
    }

    cerrarModalEspecialidad() {
        this.mostrarModalEspecialidad = false;
    }
    guardarEspecialidad() {
        if (this.formEspecialidad.valid) {
            const desc = this.formEspecialidad.value.descripcion.trim().toLowerCase();
            const existe = this.especialidadLista.some((e) => (e.descripcion || '').trim().toLowerCase() === desc);
            if (existe) {
                this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'La especialidad ya se encuentra registrada' });
                return;
            }

            this.confirmationService.confirm({
                message: '¿Estás seguro(a) de que quieres registrar?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'SI',
                rejectLabel: 'NO',
                accept: () => {
                    this.loading = true;
                    //registrar nueva especiadad
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro satisfactorio.' });

                    this.ListaEspecialidad();
                    this.loading = false;
                    this.cerrarModalEspecialidad();
                }
            });
        }
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    showMenu(ev: MouseEvent, det: DetalleDisplay, idx: number) {
        this.selectedItem = det;
        this.selectedIndex = idx;
        this.menu.toggle(ev);
    }

    editarDetalle(det: DetalleDisplay, idx: number) {
        this.editingIndex = idx;
        this.formDetalle.reset();
        this.formDetalle.patchValue({
            sede: det.sede ?? this.sedesLista.find((s) => s.id === det.codigoSede) ?? null,
            tipoMaterial: det.tipoMaterialId ?? this.tipoMaterialId,
            codigoBarra: det.codigoBarra ?? null,
            fechaIngreso: det.fechaIngreso ? new Date(det.fechaIngreso) : null,
            horaInicio: det.horaInicio ? this.stringToDate(det.horaInicio) : null,
            horaFin: det.horaFin ? this.stringToDate(det.horaFin) : null,
            maxHoras: det.maxHoras ?? null,
            tipoAdquisicion: det.tipoAdquisicionId ?? null
        });
        this.displayEjemplar = true;
    }

    deleteRegistro(objeto: DetalleDisplay) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres eliminar?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                const id = objeto.idDetalleBiblioteca ?? (objeto as any).id;
                if (!id) {
                    this.detalles = this.detalles.filter((d) => d !== objeto);
                    return;
                }
                this.loading = true;
                this.materialBibliograficoService.delete(id).subscribe({
                    next: () => {
                        this.detalles = this.detalles.filter((d) => (d.idDetalleBiblioteca ?? (d as any).id) !== id);
                        this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro eliminado.' });
                        this.loading = false;
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. Intentelo más tarde' });
                        this.loading = false;
                    }
                });
            }
        });
    }
    nuevoEjemplar() {
        this.editingIndex = null;
        this.formValidarDetalle();
        if (this.tipoMaterialId) {
            const tipoObj = this.tipoMaterialLista.find((t) => t.id === this.tipoMaterialId) ?? null;
            this.formDetalle.patchValue({ tipoMaterial: tipoObj });
        }
        this.displayEjemplar = true;
    }
    guardarEjemplar() {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres registrar?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                const sedeVal = this.formDetalle.value.sede;
                const tipoMatVal = this.tipoMaterialId ?? this.formDetalle.value.tipoMaterial;
                const tipoAdqVal = this.formDetalle.value.tipoAdquisicion;

                const sedeId = typeof sedeVal === 'object' ? sedeVal?.id : sedeVal;
                const tipoMat = typeof tipoMatVal === 'object' ? tipoMatVal?.id : (tipoMatVal ?? null);
                const tipoAdq = typeof tipoAdqVal === 'object' ? tipoAdqVal?.id : (tipoAdqVal ?? null);

                const oldDet = this.editingIndex != null ? this.detalles[this.editingIndex] : null;
                const detalle: DetalleDisplay = {
                    idDetalleBiblioteca: oldDet?.idDetalleBiblioteca ?? null,
                    codigoSede: sedeId,
                    tipoMaterialId: tipoMat ?? null,
                    tipoAdquisicionId: tipoAdq ?? null,
                    codigoBarra: this.formDetalle.value.codigoBarra,
                    horaInicio: this.timeToString(this.formDetalle.value.horaInicio ?? null),
                    horaFin: this.timeToString(this.formDetalle.value.horaFin ?? null),
                    maxHoras: this.formDetalle.value.maxHoras,
                    costo: null,
                    numeroFactura: null,
                    fechaIngreso: this.formatDateTime(this.formDetalle.value.fechaIngreso),

                    sede: this.sedesLista.find((s) => s.id === sedeId) ?? null,
                    tipoMaterial: tipoMat ? (this.tipoMaterialLista.find((t) => t.id === tipoMat) ?? null) : null,
                    tipoAdquisicion: tipoAdq ? (this.tipoAdquisicionLista.find((t) => t.id === tipoAdq) ?? null) : null,
                    idEstado: 1
                };

                if (this.editingIndex == null) {
                    this.detalles = [...this.detalles, detalle];
                } else {
                    this.detalles[this.editingIndex] = detalle;
                    this.detalles = [...this.detalles];
                }

                this.formDetalle.reset();
                this.displayEjemplar = false;
                this.editingIndex = null;
            }
        });
    }

    private formatDateTime(d: Date | string | null): string | null {
        if (!d) {
            return null;
        }
        if (typeof d === 'string' && d.length > 10) {
            return d;
        }
        const dt = typeof d === 'string' ? new Date(d) : d;
        return dt.toISOString().split('.')[0];
    }

    private timeToString(t: Date | string | null): string | null {
        if (!t) {
            return null;
        }
        if (typeof t === 'string') {
            return t.length > 5 ? t.slice(11, 16) : t;
        }
        const h = t.getHours().toString().padStart(2, '0');
        const m = t.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    }

    /** Convierte "HH:mm" o "yyyy-MM-ddTHH:mm" a Date */
    private stringToDate(hhmm: string): Date {
        const parts = hhmm.includes('T') ? hhmm.split('T')[1].split(':') : hhmm.split(':');
        const d = new Date();
        d.setHours(+parts[0], +parts[1], 0, 0);
        return d;
    }

    idToSede(id: number | null) {
        return this.sedesLista.find((s) => s.id === id);
    }

    idToTipo(id: number | null) {
        return this.tipoAdquisicionLista.find((t) => t.id === id);
    }
    onFileSelect(event: any) {
        const file = event.files[0]; // Obtiene el primer archivo seleccionado
        if (file) {
            this.selectedFile = file;
            this.formPortada.patchValue({ adjunto: file });
            this.portadaUrl = URL.createObjectURL(file);
            this.rutaImagen = null;
            this.nombreImagen = null;
        }
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Se adjunto archivo' });
    }

    private buildImageUrl(path?: string | null, name?: string | null): string | null {
        if (!path) {
            return null;
        }
        const base = path.startsWith('http') ? path : `${environment.filesUrl}${path.startsWith('/') ? '' : '/'}${path}`;
        if (name) {
            if (base.endsWith(name)) {
                return base;
            }
            const sep = base.endsWith('/') ? '' : '/';
            return base + sep + name;
        }
        return base;
    }
}
