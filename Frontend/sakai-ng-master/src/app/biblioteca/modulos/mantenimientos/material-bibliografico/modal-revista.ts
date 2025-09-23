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
import { Editorial } from '../../../interfaces/material-bibliografico/editorial';
import { Especialidad } from '../../../interfaces/material-bibliografico/especialidad';
import { Periodicidad } from '../../../interfaces/material-bibliografico/periodicidad';
import { TipoAdquisicion } from '../../../interfaces/material-bibliografico/tipo-adquisicion';
import { TipoMaterial } from '../../../interfaces/material-bibliografico/tipo-material';
import { Sedes } from '../../../interfaces/sedes';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
import { Material } from '../../../interfaces/material-bibliografico/material';

import { BibliotecaDTO, DetalleBibliotecaDTO, DetalleInput, DetalleDisplay } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { Pais } from '../../../interfaces/material-bibliografico/pais';
import { Ciudad } from '../../../interfaces/material-bibliografico/ciudad';
import { Idioma } from '../../../interfaces/material-bibliografico/idioma';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../../environments/environment';
@Component({
    selector: 'app-modal-revista',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{ width: '95%' }" header="Información de Revista" [modal]="true" [closable]="true" styleClass="p-fluid">
            <ng-template pTemplate="content">
                <form [formGroup]="formRevista">
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full md:w-1/4">
                            <label for="codigo">Codigo</label>
                            <input pInputText id="codigo" type="text" formControlName="codigo" />
                            <app-input-validation [form]="formRevista" modelo="codigo" ver="codigo"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="director">Director</label>
                            <input pInputText id="director" type="text" formControlName="director" />
                            <app-input-validation [form]="formRevista" modelo="director" ver="director"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="institucion">Instituci&oacute;n</label>
                            <input pInputText id="institucion" type="text" formControlName="institucion" />
                            <app-input-validation [form]="formRevista" modelo="institucion" ver="institucion"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="especialidad">Especialidad</label>
                            <div class="flex items-center gap-x-2">
                                <p-select appendTo="body" id="state" formControlName="especialidad" [options]="especialidadLista" optionLabel="descripcion" optionValue="idEspecialidad" placeholder="Seleccionar" class="w-full"></p-select>
                                <button pButton type="button" class="p-button-rounded flex-none" icon="pi pi-plus" (click)="abrirModalEspecialidad()" [disabled]="loading" pTooltip="Agregar" tooltipPosition="bottom"></button>
                            </div>

                            <app-input-validation [form]="formRevista" modelo="especialidad" ver="especialidad"></app-input-validation>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="titulo">Titulo de revista</label>
                            <input pInputText id="titulo" type="text" formControlName="titulo" />
                            <app-input-validation [form]="formRevista" modelo="titulo" ver="titulo"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="editorialPublicacion">Editorial</label>
                            <input pInputText id="editorialPublicacion" type="text" formControlName="editorialPublicacion" />
                            <app-input-validation [form]="formRevista" modelo="editorialPublicacion" ver="editorialPublicacion"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="periodicidad">Periodicidad</label>
                            <p-select appendTo="body" formControlName="periodicidad" [options]="periodicidadLista" optionLabel="descripcion" optionValue="id" placeholder="Seleccionar" />
                            <app-input-validation [form]="formRevista" modelo="periodicidad" ver="periodicidad"></app-input-validation>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="pais">País</label>
                            <p-select appendTo="body" formControlName="pais" [options]="paisLista" optionLabel="nombrePais" optionValue="paisId" placeholder="Seleccionar" />
                            <app-input-validation [form]="formRevista" modelo="pais" ver="pais"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="ciudad">Ciudad</label>
                            <p-select appendTo="body" formControlName="ciudad" [options]="ciudadLista" optionLabel="nombreCiudad" optionValue="ciudadCodigo" placeholder="Seleccionar" />
                            <app-input-validation [form]="formRevista" modelo="ciudad" ver="ciudad"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 min-w-[100px]">
                            <label for="cantidad">Cantidad</label>
                            <input pInputText id="cantidad" type="text" formControlName="cantidad" />
                            <app-input-validation [form]="formRevista" modelo="cantidad" ver="cantidad"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2 min-w-[100px]">
                            <label for="anioPublicacion">Año de publicación</label>
                            <input pInputText id="anioPublicacion" type="text" formControlName="anioPublicacion" />
                            <app-input-validation [form]="formRevista" modelo="anioPublicacion" ver="anioPublicacion"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 min-w-[100px]">
                            <label for="issn">ISSN</label>
                            <input pInputText id="issn" type="text" formControlName="issn" />
                            <app-input-validation [form]="formRevista" modelo="issn" ver="issn"></app-input-validation>
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
                        <div class="flex flex-col gap-2 w-full" *ngIf="formRevista.get('formatoDigital')?.value != null && formRevista.get('formatoDigital')?.value.length > 0">
                            <label for="urlPublicacion">Link de Publicaci&oacute;n</label>
                            <input pInputText id="urlPublicacion" type="text" formControlName="urlPublicacion" />
                            <app-input-validation [form]="formRevista" modelo="urlPublicacion" ver="urlPublicacion"></app-input-validation>
                        </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="descriptores">Descriptores</label>
                            <textarea pTextarea id="descriptores" rows="8" formControlName="descriptores"></textarea>

                            <app-input-validation [form]="formRevista" modelo="descriptores" ver="descriptores"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 w-full">
                            <label for="notaGeneral">Notas General</label>
                            <textarea pTextarea id="notaGeneral" rows="8" formControlName="notaGeneral"></textarea>

                            <app-input-validation [form]="formRevista" modelo="notaGeneral" ver="notaGeneral"></app-input-validation>
                        </div>
                    </div>
                </form>
            </ng-template>
            <ng-template pTemplate="footer">
                <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                <button pButton pRipple type="button" icon="pi pi-check" (click)="nextStepToDetalle()" [disabled]="formRevista.invalid || loading" label="Siguiente" class="p-button-success"></button>
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
                    [globalFilterFields]="['id', 'codigoBarra', 'existencias', 'sede.descripcion', 'tipoMaterial.descripcion', 'fechaIngreso', 'tipoAdquisicion.descripcion', 'costo', 'numeroFactura']"
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
                            <th style="width: 8rem" spSortableColumn="existencias">Existencia <p-sortIcon field="existencias"></p-sortIcon></th>
                            <th pSortableColumn="tipoAdquisicion.descripcion" style="min-width:200px">Tipo Adquisici&oacute;n<p-sortIcon field="tipoAdquisicion.descripcion"></p-sortIcon></th>
                            <th pSortableColumn="codigoBarra">Código Barra <p-sortIcon field="codigoBarra"></p-sortIcon></th>
                            <th style="width: 8rem" pSortableColumn="costo">Costo <p-sortIcon field="costo"></p-sortIcon></th>
                            <th pSortableColumn="numeroFactura">Nro Factura <p-sortIcon field="numeroFactura"></p-sortIcon></th>
                            <th pSortableColumn="fechaIngreso">Fecha Ingreso <p-sortIcon field="fechaIngreso"></p-sortIcon></th>
                            <th style="width: 4rem">Opciones</th>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-detalle let-rowIndex="rowIndex">
                        <tr>
                            <td>
                                {{ idToSede(detalle.codigoSede)?.descripcion }}
                            </td>
                            <td>
                                {{ detalle.existencias }}
                            </td>
                            <td>
                                {{ idToTipo(detalle.tipoAdquisicionId)?.descripcion }}
                            </td>
                            <td>
                                {{ detalle.codigoBarra }}
                            </td>
                            <td>
                                {{ detalle.costo }}
                            </td>
                            <td>
                                {{ detalle.numeroFactura }}
                            </td>
                            <td>
                                {{ detalle.fechaIngreso | date: 'dd-MM-yyyy' }}
                            </td>
                            <td class="text-center">
                                <div style="position: relative;">
                                    <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="showMenu($event, detalle, rowIndex)"></button>
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
                <button pButton pRipple type="button" icon="pi pi-check" (click)="finalizar()" [disabled]="formRevista.invalid || formPortada.invalid || loading" label="Guardar" class="p-button-success"></button>
            </ng-template>
        </p-dialog>
        <p-dialog [(visible)]="displayEjemplar" [style]="{ width: '75%' }" header="Detalle" [modal]="true" [closable]="true" styleClass="p-fluid" [contentStyle]="{ overflow: 'visible' }">
            <ng-template pTemplate="content">
                <form [formGroup]="formDetalle">
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="existencias">Existencia</label>
                            <input pInputText id="existencias" type="text" formControlName="existencias" />
                            <app-input-validation [form]="formDetalle" modelo="existencias" ver="existencia"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="sede">Local/Filial</label>
                            <p-select appendTo="body" formControlName="sede" [options]="sedesLista" optionLabel="descripcion" optionValue="id" placeholder="Seleccionar" />
                            <app-input-validation [form]="formDetalle" modelo="sede" ver="Sede"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="tipoAdquisicion">Tipo Adquisicion</label>
                            <p-select appendTo="body" formControlName="tipoAdquisicion" [options]="tipoAdquisicionLista" optionLabel="descripcion" optionValue="id" placeholder="Seleccionar" />
                            <app-input-validation [form]="formDetalle" modelo="tipoAdquisicion" ver="Tipo Adquisicion"></app-input-validation>
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

                        <div class="flex flex-col gap-2 md:w-1/2">
                            <label for="Costo">Costo</label>
                            <input pInputText id="costo" type="text" formControlName="costo" />
                            <app-input-validation [form]="formDetalle" modelo="costo" ver="costo"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="nroFactura">Nro Factura</label>
                            <input pInputText id="nroFactura" type="text" formControlName="nroFactura" />
                            <app-input-validation [form]="formDetalle" modelo="nroFactura" ver="Nro Factura"></app-input-validation>
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
export class ModalRevistaComponent implements OnInit {
    loading: boolean = false;
    formRevista: FormGroup = new FormGroup({});
    formDetalle: FormGroup = new FormGroup({});
    formPortada: FormGroup = new FormGroup({});
    formEspecialidad: FormGroup = new FormGroup({});
    display: boolean = false;
    displayEditorial: boolean = false;
    displayDetalle: boolean = false;
    displayEjemplar: boolean = false;
    objetoRevista: Material = new Material();
    objetoEditorial: Editorial = new Editorial();
    objetoDetalle: Detalle = new Detalle();
    detalles: DetalleDisplay[] = [];
    @ViewChild('filter') filter!: ElementRef;
    selectedItem: any;
    @ViewChild('menu') menu!: Menu;
    especialidadLista: Especialidad[] = [];
    idiomaLista: Idioma[] = [];
    paisLista: Pais[] = [];
    ciudadLista: Ciudad[] = [];
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
    editingIndex: number | null = null;
    selectedIndex!: number;
    private id?: number;
    @Input() tipoMaterialId!: number | null;
    @Output() saved = new EventEmitter<void>();

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private genericoService: GenericoService,
        private materialBibliograficoService: MaterialBibliograficoService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {
        this.formEspecialidad = this.fb.group({
            descripcion: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]]
        });
        this.formPortada = this.fb.group({
            portada: [this.objetoRevista.portada],
            adjunto: ['']
        });
        this.formRevista = this.fb.group({
            id: [this.objetoRevista.id],
            codigo: [
                this.objetoRevista.codigo,
                [
                    Validators.required,
                    Validators.maxLength(20),
                    Validators.pattern('^[a-zA-Z0-9./]+$') // Permite letras, números, puntos y slash
                ]
            ],
            director: [
                this.objetoRevista.director,
                [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ],
            institucion: [
                this.objetoRevista.institucion,
                [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ],
            especialidad: [this.objetoRevista.especialidad, Validators.required],
            tipoMaterialId: [null],
            titulo: [
                this.objetoRevista.titulo,
                [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ],
            editorialPublicacion: [
                this.objetoRevista.editorialPublicacion,
                [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ],
            periodicidad: [this.objetoRevista.periodicidad, Validators.required],
            pais: [this.objetoRevista?.editorial?.pais, [Validators.required]],
            ciudad: [this.objetoRevista?.editorial?.ciudad, [Validators.required]],
            cantidad: [this.objetoRevista?.editorial?.cantidad, [Validators.required, Validators.maxLength(100), Validators.pattern('^[0-9]+$')]],
            anioPublicacion: [this.objetoRevista?.editorial?.anioPublicacion, [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+$')]],
            issn: [this.objetoRevista?.editorial?.issn, [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$')]],
            formatoDigital: [this.objetoRevista.formatoDigital],
            urlPublicacion: [this.objetoRevista.urlPublicacion],
            descriptores: [
                this.objetoRevista.descriptores,
                [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ],
            notaGeneral: [
                this.objetoRevista.notaGeneral,
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
                command: (event) => this.deleteRegistro(this.selectedItem)
            }
        ];
        this.formValidarDetalle();
    }
    formValidarDetalle() {
        this.formDetalle = this.fb.group({
            existencias: [this.objetoDetalle?.existencias, [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+$')]],
            sede: [this.objetoDetalle?.codigoSede ?? this.objetoDetalle?.sede?.id ?? null, [Validators.required]],
            fechaIngreso: [this.objetoDetalle?.fechaIngreso ? new Date(this.objetoDetalle.fechaIngreso) : null, [Validators.required]],
            tipoAdquisicion: [this.objetoDetalle?.tipoAdquisicionId ?? this.objetoDetalle?.tipoAdquisicion?.id ?? null, [Validators.required]],
            codigoBarra: [this.objetoDetalle?.codigoBarra, [Validators.required, Validators.maxLength(50), Validators.pattern('^[0-9]+$')]],
            horaInicio: [this.objetoDetalle?.horaInicio ? this.stringToDate(this.objetoDetalle.horaInicio) : null, [Validators.required]],
            horaFin: [this.objetoDetalle?.horaFin ? this.stringToDate(this.objetoDetalle.horaFin) : null, [Validators.required]],
            maxHoras: [this.objetoDetalle?.maxHoras ?? null, [Validators.required, Validators.min(1)]],
            costo: [this.objetoDetalle?.costo, [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+$')]],
            nroFactura: [
                this.objetoDetalle?.numeroFactura ?? this.objetoDetalle?.nroFactura ?? null,
                [
                    Validators.required,
                    Validators.maxLength(15),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s.-/-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
            ]
        });
    }

    async ngOnInit() {
        this.formRevista.get('pais')!.valueChanges.subscribe((paisId) => {
            this.formRevista.patchValue({ ciudad: null }, { emitEvent: false });
            if (paisId) {
                this.ListaCiudad(paisId);
            } else {
                this.ciudadLista = [];
            }
        });
        await this.ListaPais();
        await this.ListaEspecialidad();
        await this.ListaPeriodicidad();
        await this.ListaDescripcionFisica();
        await this.ListaAnioPublicacion();
        await this.ListaSede();
        await this.ListaTipoMaterial();
        await this.ListaTipoAdquisicion();
        await this.ListaDetalle();
    }
    //     openModal() {
    //         this.objetoRevista=new Material();
    //         this.detalles=[];
    //         this.objetoDetalle=new Detalle();
    //         this.formRevista.reset();        // ← aquí
    //         this.display = true;
    //     }
    openModal(tipoId?: number | null) {
        this.objetoRevista = new Material();
        this.objetoDetalle = new Detalle();

        // Reinicia los formularios (aquí puedes establecer valores por defecto si lo requieres)
        this.formRevista.reset();
        this.formDetalle.reset();

        this.detalles = [];

        this.selectedFile = null;
        this.portadaUrl = null;
        this.rutaImagen = null;
        this.nombreImagen = null;
        this.formPortada.reset({ portada: false, adjunto: '' });

        const id = tipoId ?? this.tipoMaterialId ?? null;
        this.formRevista.patchValue({ tipoMaterialId: id });

        this.display = true;
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
    finalizar(): void {
        [this.formRevista, this.formDetalle].forEach((fg) => {
            Object.entries(fg.controls).forEach(([name, ctrl]) => {
                if (ctrl.invalid) {
                    console.warn('❌ control inválido:', name, ctrl.errors);
                }
            });
        });

        if (this.formRevista.invalid || this.detalles.length === 0) {
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
                console.log('dentro');
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
            if (result.status === 0) {
                this.paisLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }
    }
    async ListaCiudad(paisId: string, selected?: string) {
        try {
            const resp: any = await this.materialBibliograficoService.lista_ciudad(`material-bibliografico/ciudad-by-pais/${paisId}`).toPromise();
            console.table(resp.data.map((c: any) => c.ciudadCodigo));
            if (resp.status === 0) {
                this.ciudadLista = resp.data;

                /* esperamos a que el template pinte el combo
             y luego colocamos EXACTAMENTE el mismo string */
                Promise.resolve().then(() => {
                    if (selected) {
                        this.formRevista.get('ciudad')!.setValue(selected); // "BUE"
                        console.log(
                            'Valor en el control  ➜',
                            this.formRevista.get('ciudad')!.value,
                            '\nOpciones cargadas  ➜',
                            this.ciudadLista.map((c) => c.ciudadCodigo)
                        );
                        this.formRevista.get('ciudad')!.markAsUntouched();
                    }
                });
            }
        } catch {
            this.messageService.add({ severity: 'error', detail: 'No se pudo cargar ciudades' });
        }
    }
    async ListaIdioma() {
        try {
            const result: any = await this.materialBibliograficoService.lista_idioma('material-bibliografico/idioma').toPromise();
            if (result.status === 0) {
                this.idiomaLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }
    }
    async ListaPeriodicidad() {
        try {
            const result: any = await this.materialBibliograficoService
                .lista_periodicidad('material-bibliografico/periodicidad')
                .toPromise();
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
            if (result.status === 0) {
                this.sedesLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
        }
    }
    async ListaTipoMaterial() {
        try {
            const result: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
            if (result.status == 0) {
                this.tipoMaterialLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar Sede' });
        }
    }
    async ListaTipoAdquisicion() {
        try {
            const resp: any = await this.materialBibliograficoService.lista_tipo_adquisicion('material-bibliografico/adquisicion').toPromise();

            if (resp.status === 0) {
                // ← usa directamente la respuesta, no la remapees
                this.tipoAdquisicionLista = resp.data;
                // Opcional: log para verificar
                console.table(this.tipoAdquisicionLista);
            }
        } catch {
            this.messageService.add({
                severity: 'error',
                detail: 'No se pudo cargar Tipo Adquisición'
            });
        }
    }
    async ListaDetalle() {
        const idBib = this.objetoRevista?.id;
        if (!idBib) {
            return;
        }
        try {
            const data = await this.materialBibliograficoService.listarDetallesPorBiblioteca(idBib, false).toPromise();

            this.detalles = (data ?? []).map((d) => {
                const sedeId = d.codigoSede ?? (d as any).sedeId ?? (d as any).sede?.id ?? d.biblioteca?.sedeId ?? null;
                const tipoMat = d.tipoMaterialId ?? d.tipoMaterial?.id ?? d.biblioteca?.tipoMaterialId ?? null;
                const tipoAdq = d.tipoAdquisicionId ?? d.tipoAdquisicion?.id ?? d.biblioteca?.tipoAdquisicionId ?? null;

                const sedeObj = this.sedesLista.find((s) => s.id === sedeId) ?? null;
                const tipoMatObj = this.tipoMaterialLista.find((t) => t.id === tipoMat) ?? null;
                const tipoAdqObj = this.tipoAdquisicionLista.find((t) => t.id === tipoAdq) ?? null;

                const nroExist = (d as any).nroExistencia ?? (d as any).existencias ?? null;

                return {
                    idDetalleBiblioteca: d.idDetalleBiblioteca,
                    codigoSede: sedeId,
                    tipoMaterialId: tipoMat,
                    tipoAdquisicionId: tipoAdq,
                    horaInicio: d.horaInicio ?? null,
                    horaFin: d.horaFin ?? null,
                    maxHoras: d.maxHoras ?? null,
                    costo: d.costo ?? null,
                    numeroFactura: d.numeroFactura ?? d.nroFactura ?? null,
                    fechaIngreso: d.fechaIngreso ?? (d as any).fecha_ingreso ?? null,
                    codigoBarra: d.codigoBarra ?? null,
                    existencias: nroExist != null ? String(nroExist) : null,
                    nroExistencia: nroExist != null ? Number(nroExist) : null,
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
    showMenu(event: MouseEvent, selectedItem: any, idx: number) {
        this.selectedItem = selectedItem;
        this.selectedIndex = idx;
        this.menu.toggle(event);
    }

    editarDetalle(det: DetalleDisplay, idx: number) {
        this.editingIndex = idx;
        this.objetoDetalle = JSON.parse(JSON.stringify(det));
        this.formDetalle.reset();
        this.formDetalle.enable();
        this.formValidarDetalle();
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
        this.displayEjemplar = true;
    }
    editarBiblioteca(mat: BibliotecaDTO, tipoId?: number | null) {
        const id = tipoId ?? this.tipoMaterialId ?? null;
        this.formRevista.reset();
        this.objetoRevista.id = mat.id ?? 0;
        this.rutaImagen = mat.rutaImagen ?? null;
        this.nombreImagen = mat.nombreImagen ?? null;
        this.portadaUrl = this.buildImageUrl(mat.rutaImagen, mat.nombreImagen);
        this.selectedFile = null;
        this.formPortada.patchValue({ portada: !!this.portadaUrl, adjunto: '' });
        this.formRevista.patchValue({
            id: mat.id ?? null,
            tipoMaterialId: id,
            codigo: mat.codigoLocalizacion,
            titulo: mat.titulo,
            institucion: mat.autorInstitucional,
            director: mat.director,
            editorialPublicacion: mat.editorialPublicacion,
            periodicidad: mat.periodicidadId,
            pais: mat.paisId,
            ciudad: mat.ciudadCodigo,
            especialidad: mat.idEspecialidad,
            cantidad: mat.numeroPaginas,
            anioPublicacion: mat.anioPublicacion,
            issn: mat.issn,
            descriptores: mat.descriptor,
            notaGeneral: mat.notaGeneral,
            formatoDigital: mat.fladigitalizado,
            urlPublicacion: mat.linkPublicacion
        });
        this.tipoMaterialId = id;
        this.display = true;
        this.ListaDetalle();
    }

    guardarEjemplar() {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres registrar?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                const tipoAdqId = this.formDetalle.value.tipoAdquisicion;
                const sedeId = this.formDetalle.value.sede;
                let tipoMaterialId = this.formDetalle.value.tipoMaterial as number;

                const detDisplay: DetalleDisplay = {
                    codigoSede: sedeId,
                    tipoAdquisicionId: tipoAdqId,
                    tipoMaterialId: tipoMaterialId, // ← añade esta línea
                    existencias: this.formDetalle.value.existencias,
                    codigoBarra: this.formDetalle.value.codigoBarra,
                    horaInicio: this.timeToString(this.formDetalle.value.horaInicio ?? null),
                    horaFin: this.timeToString(this.formDetalle.value.horaFin ?? null),
                    maxHoras: this.formDetalle.value.maxHoras,
                    costo: this.formDetalle.value.costo,
                    numeroFactura: this.formDetalle.value.nroFactura,
                    fechaIngreso: this.formatDateTime(this.formDetalle.value.fechaIngreso),
                    portadaLibroImg: null,
                    // extras para la vista
                    sede: this.sedesLista.find((s) => s.id === sedeId) ?? null,
                    tipoAdquisicion: this.tipoAdquisicionLista.find((t) => t.id === tipoAdqId) ?? null,
                    tipoMaterial: this.tipoMaterialLista.find((t) => t.idTipoMaterial === tipoMaterialId) ?? null
                };

                if (this.editingIndex == null) {
                    this.detalles = [...this.detalles, detDisplay];
                } else {
                    this.detalles[this.editingIndex] = detDisplay;
                    //  forzar detección de cambios (Angular CDK / PrimeNG)
                    this.detalles = [...this.detalles];
                }

                // limpiar / cerrar
                this.formDetalle.reset();
                this.formDetalle.disable();
                this.displayEjemplar = false;
            }
        });
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

    private buildDto(): BibliotecaDTO {
        const revista = this.formRevista.value;
        const decoded = this.authService.getUser();
        const keepPortada = this.formPortada.get('portada')?.value;

        const detalles: DetalleBibliotecaDTO[] = this.detalles.map((d) => {
            return {
                // aquí coaccionamos `null` → `undefined`
                idDetalleBiblioteca: d.idDetalleBiblioteca ?? undefined,
                codigoSede: d.codigoSede ?? null,
                tipoAdquisicionId:
                    typeof d.tipoAdquisicionId === 'object'
                        ? (d.tipoAdquisicionId?.id ?? null) // ‹– sólo number | null
                        : (d.tipoAdquisicionId ?? null),
                tipoMaterialId: d.tipoMaterialId!,
                horaInicio: this.timeToString(d.horaInicio ?? null),
                horaFin: this.timeToString(d.horaFin ?? null),
                maxHoras: d.maxHoras ?? null,
                costo: d.costo ?? null,
                numeroFactura: d.numeroFactura ?? null,
                fechaIngreso: d.fechaIngreso ?? null,
                portadaLibroImg: d.portadaLibroImg ?? null,
                codigoBarra: d.codigoBarra ?? null,
                nroExistencia: d.nroExistencia ?? (d.existencias != null ? Number(d.existencias) : undefined),
                idEstado: 1
            };
        });

        const fechaIngreso = this.detalles[0]?.fechaIngreso ?? undefined;

        return {
            /* ------ claves y datos propios de Biblioteca ------ */
            id: revista.id > 0 ? revista.id : null,
            idEspecialidad: revista.especialidad,
            paisId: revista.pais,
            ciudadCodigo: revista.ciudad,
            tipoMaterialId: revista.tipoMaterialId ?? this.tipoMaterialId ?? null,
            estadoId: 1,
            codigoLocalizacion: revista.codigo,
            titulo: revista.titulo,
            autorInstitucional: revista.institucion,
            director: revista.director,
            editorialPublicacion: revista.editorialPublicacion,
            anioPublicacion: revista.anioPublicacion,
            issn: revista.issn,
            descriptor: revista.descriptores,
            notaGeneral: revista.notaGeneral,
            numeroPaginas: revista.cantidad,
            rutaImagen: keepPortada ? (this.selectedFile ? undefined : (this.rutaImagen ?? undefined)) : null,
            nombreImagen: keepPortada ? (this.selectedFile ? undefined : (this.nombreImagen ?? undefined)) : null,
            linkPublicacion: revista.urlPublicacion,
            periodicidadId: revista.periodicidad != null ? Number(revista.periodicidad) : undefined,
            fechaIngreso,
            existencias: this.detalles.length,
            usuarioCreacion: decoded.sub,
            fechaCreacion: new Date().toISOString(),

            detalles
        };
    }
    private formatDateTime(d: Date | string | null): string | null {
        if (!d) {
            return null;
        }

        /* Si el valor ya viene como string ISO completo lo dejamos pasar */
        if (typeof d === 'string' && d.length > 10) {
            return d;
        }

        /* Convertimos Date → ‘yyyy-MM-ddTHH:mm:ss’  (sin milisegundos / sin Z) */
        const dt = typeof d === 'string' ? new Date(d) : d;
        return dt.toISOString().split('.')[0]; // ej. “2025-05-07T00:00:00”
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

    public nextStepToDetalle(): void {
        this.formRevista.markAllAsTouched();
        if (this.formRevista.valid) {
            this.display = false;
            this.displayDetalle = true;
        }
    }
}
