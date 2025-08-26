import { Component, ElementRef, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
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
@Component({
    selector: 'app-modal-otros',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '95%'}"  header="Información de Artículos" [modal]="true" [closable]="true" styleClass="p-fluid">
    <ng-template pTemplate="content">
    <form [formGroup]="formOtro">
    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">

            <div class="flex flex-col gap-2 w-full md:w-1/2">
                      <label for="autorPrincipal">Autor</label>
                                <input pInputText id="autorPrincipal" type="text" formControlName="autorPrincipal"  />
                                <app-input-validation
                  [form]="formOtro"
                  modelo="autorPrincipal"
                  ver="autorPrincipal"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full">
                      <label for="tituloArticulo">Titulo de articulo</label>
                                <input pInputText id="tituloArticulo" type="text" formControlName="tituloArticulo"  />
                                <app-input-validation
                  [form]="formOtro"
                  modelo="tituloArticulo"
                  ver="tituloArticulo"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full">
                      <label for="tituloRevista">Titulo de revista fuente</label>
                                <input pInputText id="tituloRevista" type="text" formControlName="tituloRevista"  />
                                <app-input-validation
                  [form]="formOtro"
                  modelo="tituloRevista"
                  ver="tituloRevista"></app-input-validation>
</div>
        </div>
    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
    <div class="flex flex-col gap-2 w-full">
                      <label for="descripcionRevista">Descripcion de la revista fuente</label>
                                <input pInputText id="descripcionRevista" type="text" formControlName="descripcionRevista"  />
                                <app-input-validation
                  [form]="formOtro"
                  modelo="descripcionRevista"
                  ver="descripcionRevista"></app-input-validation>
</div>
    </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">


      <div class="flex flex-col gap-2">
        <label for="descripcionFisica">Descripción Física</label>
        <p-select appendTo="body" formControlName="descripcionFisica" [options]="descripcionFisicaLista" optionLabel="descripcion" placeholder="Seleccionar" />
        <app-input-validation [form]="formOtro" modelo="descripcionFisica" ver="descripcionFisica"></app-input-validation>
      </div>
      <div class="flex flex-col gap-2 min-w-[100px] ">
        <label for="cantidad">Cantidad</label>
        <input pInputText id="cantidad" type="text" formControlName="cantidad" />
        <app-input-validation [form]="formOtro" modelo="cantidad" ver="cantidad"></app-input-validation>
      </div>


    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 gap-4">

</div>
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
    <div class="flex flex-col gap-4 w-full">
    <div class="flex items-center space-x-3 py-2">
                            <p-checkbox id="checkFormatoDigital" name="option" value="1" formControlName="formatoDigital"/>
                            <label for="checkFormatoDigital" class="ml-2">¿Tiene formato digital?</label>
                        </div>
</div>
</div>
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
<div class="flex flex-col gap-2 w-full" *ngIf="formOtro.get('formatoDigital')?.value.length>0">
                      <label for="urlPublicacion">Link de Publicaci&oacute;n</label>
                                <input pInputText id="urlPublicacion" type="text" formControlName="urlPublicacion"  />
                                <app-input-validation
                  [form]="formOtro"
                  modelo="urlPublicacion"
                  ver="urlPublicacion"></app-input-validation>
</div>
</div>
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="descriptores">Descriptores</label>
                      <textarea pTextarea id="descriptores" rows="8" formControlName="descriptores"></textarea>

                                <app-input-validation
                  [form]="formOtro"
                  modelo="descriptores"
                  ver="descriptores"></app-input-validation>
                      </div>

                      <div class="flex flex-col gap-2 w-full">
                      <label for="notasGeneral">Nota General</label>
                      <textarea pTextarea id="notasGeneral" rows="8" formControlName="notasGeneral"></textarea>

                                <app-input-validation
                  [form]="formOtro"
                  modelo="notasGeneral"
                  ver="notasGeneral"></app-input-validation>
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
<p-dialog [(visible)]="mostrarModalEspecialidad" header="Nueva Especialidad" [modal]="true" [closable]="true" [resizable]="false" [draggable]="false" [style]="{width: '400px'}">
<ng-template pTemplate="content">
<form [formGroup]="formEspecialidad">
<div class="flex flex-col gap-4">
    <label for="nuevaEspecialidad">Especialidad</label>
    <input pInputText id="nuevaEspecialidad" type="text"  formControlName="descripcion" placeholder="Ingrese nueva especialidad" />
    <app-input-validation [form]="formEspecialidad" modelo="descripcion" ver="descripcion"></app-input-validation>
</div>
  </form>
  </ng-template>
  <ng-template pTemplate="footer">
    <button pButton type="button" label="Cancelar" class="p-button-text" [disabled]="loading" (click)="cerrarModalEspecialidad()"></button>
    <button pButton type="button" label="Guardar" class="p-button-success" [disabled]="formEspecialidad.invalid || loading"  (click)="guardarEspecialidad()"></button>
  </ng-template>
</p-dialog>



  <!--MODAL DETALLE-->
<p-dialog [(visible)]="displayDetalle" [style]="{width: '95%'}"  header="Detalle" [modal]="true" [closable]="true" styleClass="p-fluid">
<ng-template pTemplate="content">
<p-toolbar styleClass="mb-6">
<ng-template #start>
<form [formGroup]="formPortada">
        <div class="flex flex-col md:flex-row gap-x-2 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <div class="flex items-center space-x-3 py-2">
                            <p-checkbox id="checkPortada" name="option" value="1" formControlName="portada"/>
                            <label for="checkPortada" class="ml-2">¿Desea adjuntar portada de libro?</label>
                        </div>
                                <app-input-validation
                  [form]="formPortada"
                  modelo="portada"
                  ver="portada"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full" *ngIf="formPortada.get('portada')?.value.length>0">
      <label for="adjunto">Portada</label>
      <p-fileupload
        #fu
        mode="basic"
        chooseLabel="Seleccionar"
        chooseIcon="pi pi-upload"
        name="adjunto"
        accept="image/*"
        maxFileSize="1000000"
        (onSelect)="onFileSelect($event)">

  <ng-template pTemplate="empty">
    Ningún archivo seleccionado
  </ng-template>
      </p-fileupload>

      <app-input-validation [form]="formPortada" modelo="adjunto" ver="adjunto"></app-input-validation>
    </div>
</div>

                        </form>

</ng-template>
            <ng-template #end>
                 <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoEjemplar()"
                                pTooltip="Nuevo registro" tooltipPosition="bottom"></button>


            </ng-template>
        </p-toolbar>

<p-table #dt1 [value]="detalles" dataKey="id" [rows]="10"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                [globalFilterFields]="['id','existencia','sede.descripcion','tipoMaterial.descripcion','fechaIngreso','tipoAdquisicion.descripcion','costo','nroFactura']" responsiveLayout="scroll">
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
                            <th spSortableColumn="sede.descripcion" >Local/Filial <p-sortIcon field="sede.descripcion"></p-sortIcon></th>
                             <th pSortableColumn="fechaIngreso" >Fecha Ingreso <p-sortIcon field="fechaIngreso"></p-sortIcon></th>
                            <th style="width: 4rem" >Opciones</th>

                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-objeto>
                        <tr>
                            <td>
                                {{objeto.sede?.descripcion}}
                            </td>
                            <td>
                                {{objeto.fechaIngreso}}
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
                <button pButton pRipple type="button" icon="pi pi-check" (click)="finalizar()" [disabled]="formOtro.invalid  || formPortada.invalid || loading" label="Guardar" class="p-button-success"></button>
            </ng-template>
</p-dialog>
<p-dialog [(visible)]="displayEjemplar" [style]="{width: '75%'}"  header="Registro" [modal]="true" [closable]="true" styleClass="p-fluid">
<ng-template pTemplate="content">
    <form [formGroup]="formDetalle">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">

    <div class="flex flex-col gap-2">
        <label for="sede">Local/Filial</label>
        <p-select appendTo="body" formControlName="sede" [options]="sedesLista" optionLabel="descripcion" placeholder="Seleccionar"/>
        <app-input-validation [form]="formDetalle" modelo="sede" ver="Sede"></app-input-validation>
      </div>




      <div class="flex flex-col gap-2 w-full">
  <label for="fechaIngreso">Fecha Ingreso</label>
  <p-datepicker
      appendTo="body"
      formControlName="fechaIngreso"
      [ngClass]="'w-full'"
      [style]="{ width: '100%' }"
      [readonlyInput]="true"
      dateFormat="dd/mm/yy">
</p-datepicker>

  <app-input-validation [form]="formDetalle" modelo="fechaIngreso" ver="Fecha Ingreso"></app-input-validation>
</div>

    </div>
    </form>
</ng-template>
<ng-template pTemplate="footer">
                <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModalEjemplar()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                <button pButton pRipple type="button" icon="pi pi-check" (click)="guardarEjemplar()" [disabled]="formDetalle.invalid || loading" label="Guardar" class="p-button-success"></button>
            </ng-template>
</p-dialog>
  <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
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
    @Output() saved = new EventEmitter<void>();
    constructor(private fb: FormBuilder,
                private genericoService: GenericoService,
                private materialBibliograficoService: MaterialBibliograficoService,
                private confirmationService: ConfirmationService,
                private messageService: MessageService,
                private authService: AuthService) {

        this.formEspecialidad = this.fb.group({
            descripcion: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]]
        });
        this.formPortada = this.fb.group({
            portada: [this.objetoOtro.portada],
            adjunto: ['']
        });
        this.formOtro = this.fb.group({

            id: [this.objetoOtro.id],

            tituloArticulo: [this.objetoOtro.tituloArticulo,
                [
                    Validators.required,
                    Validators.maxLength(100),
                    Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
                ]
                ],
            tituloRevista: [this.objetoOtro.tituloRevista,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
            autorPrincipal: [this.objetoOtro.autorPrincipal,
            [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],
            descripcionRevista: [this.objetoOtro.descripcionRevista,
            [
                Validators.required,
                Validators.maxLength(250),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]
            ],

          descripcionFisica: [this.objetoOtro?.descripcionFisica,
              [
                  Validators.required
              ]
              ],
              cantidad: [this.objetoOtro?.cantidad,
              [
                  Validators.required,
                  Validators.maxLength(100),
                  Validators.pattern('^[0-9]+$')
              ]
              ],
            formatoDigital: [this.objetoOtro.formatoDigital],
            urlPublicacion: [this.objetoOtro.urlPublicacion],
            descriptores: [this.objetoOtro.descriptores, [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]],
            notasGeneral: [this.objetoOtro.notasGeneral, [
                Validators.required,
                Validators.maxLength(100),
                Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s./()-]+$') // Permite letras, números, espacios, punto, guion, slash y paréntesis
            ]]
        });

      this.items = [
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
      ];
      this.formValidarDetalle();
    }
    formValidarDetalle(){
        this.formDetalle = this.fb.group({

            sede: [this.objetoDetalle?.sede,
            [
                Validators.required
            ]
            ],
            fechaIngreso: [this.objetoDetalle?.fechaIngreso,
            [
                Validators.required
            ]
            ]
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
    openModal() {
        this.objetoOtro=new Otro();
        this.detalles=[];
        this.objetoDetalle=new Detalle();
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
        this.loading=false;
        this.display = false;
        this.displayDetalle = true;
    }
    private buildDto(): BibliotecaDTO {
        const otro = this.formOtro.value;
        const decoded = this.authService.getUser();

        const detalles: DetalleBibliotecaDTO[] = this.detalles.map(d => ({
            idDetalleBiblioteca: d.idDetalleBiblioteca ?? undefined,
            codigoSede: d.codigoSede ?? null,
            tipoAdquisicionId: (d.tipoAdquisicion as any)?.id ?? d.tipoAdquisicionId ?? null,
            tipoMaterialId: (d.tipoMaterial as any)?.id ?? d.tipoMaterialId ?? null,
            costo: d.costo ?? null,
            numeroFactura: d.numeroFactura ?? null,
            fechaIngreso: d.fechaIngreso ?? null,
            idEstado: d.idEstado ?? 1,
        }));

        return {
            id: otro.id > 0 ? otro.id : null,
            codigoLocalizacion: '',
            titulo: otro.tituloArticulo,
            autorPersonal: otro.autorPrincipal,
            editorialPublicacion: otro.tituloRevista,
            descriptor: otro.descriptores,
            notaGeneral: otro.notasGeneral,
            fladigitalizado: !!otro.formatoDigital?.length,
            linkPublicacion: otro.urlPublicacion,
            numeroPaginas: otro.cantidad,
            estadoId: 1,
            usuarioCreacion: decoded.sub,
            fechaCreacion: new Date().toISOString(),
            detalles,
        };
    }

    finalizar() {
        if (this.formOtro.invalid || this.detalles.length === 0) {
            this.messageService.add({severity:'warn', summary:'Campos obligatorios', detail:'Revisa los formularios'});
            return;
        }
        const dto = this.buildDto();
        this.loading = true;
        const req$ = dto.id ? this.materialBibliograficoService.update(dto.id, dto) : this.materialBibliograficoService.create(dto);
        req$.subscribe({
            next: ({status}) => {
                this.loading = false;
                if (status === 0) {
                    const detail = dto.id
                        ? 'Guardado correctamente'
                        : 'Material bibliográfico pendiente de aprobación. Revise el módulo Aceptaciones MB.';
                    this.messageService.add({severity:'success', summary:'Éxito', detail});
                    this.displayDetalle = false;
                    this.saved.emit();
                }
            },
            error: () => {
                this.loading = false;
                this.messageService.add({severity:'error', summary:'Error', detail:'No se pudo guardar la biblioteca'});
            }
        });
    }


    async ListaEspecialidad() {
        try {
            const result: any = await this.materialBibliograficoService.lista_especialidad('material-bibliografico/especialidad').toPromise();
            if (result.status === "0") {
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
            if (result.status === "0") {
                this.paisLista = result.data;
            }
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar especialidad' });
        }

    }
    async ListaCiudad() {
        const paisId = this.formOtro.get('pais')?.value;
        if (!paisId) { return; }
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
            const result: any = await this.materialBibliograficoService.lista_periodicidad('material-bibliografico/ciudad').toPromise();
            if (result.status === "0") {
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
            if (result.status === "0") {
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
            if (result.status === "0") {
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
        if (!idBib) { return; }
        try {
            const data = await this.materialBibliograficoService
                .listarDetallesPorBiblioteca(idBib, false)
                .toPromise();

            this.detalles = (data ?? []).map(d => {
                const sedeId  = d.codigoSede ?? d.biblioteca?.sedeId ?? null;
                const tipoMat = d.tipoMaterialId ?? d.biblioteca?.tipoMaterialId ?? null;
                const tipoAdq = d.tipoAdquisicionId ?? d.biblioteca?.tipoAdquisicionId ?? null;

                const sedeObj      = this.sedesLista.find(s => s.id === sedeId) ?? null;
                const tipoMatObj   = this.tipoMaterialLista.find(t => t.id === tipoMat) ?? null;
                const tipoAdqObj   = this.tipoAdquisicionLista.find(t => t.id === tipoAdq) ?? null;

                return {
                    idDetalleBiblioteca: d.idDetalleBiblioteca,
                    codigoSede: sedeId,
                    tipoMaterialId: tipoMat,
                    tipoAdquisicionId: tipoAdq,
                    costo: d.costo ?? null,
                    numeroFactura: d.numeroFactura ?? null,
                    fechaIngreso: d.fechaIngreso ?? null,
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
        showMenu(event: MouseEvent, selectedItem: any) {
          this.selectedItem = selectedItem;
          this.menu.toggle(event);
        }

          editarRegistro(objeto:Detalle){
            this.objetoDetalle = JSON.parse(JSON.stringify(objeto));
            this.formValidarDetalle();
            this.displayDetalle = true;
          }


            deleteRegistro(objeto: Detalle) {
                this.confirmationService.confirm({
                    message: '¿Estás seguro(a) de que quieres eliminar?',
                    header: 'Confirmar',
                    icon: 'pi pi-exclamation-triangle',
                    acceptLabel: 'SI',
                    rejectLabel: 'NO',
                    accept: () => {
                      this.loading=true;
                      const data = { id: objeto.id};
                      this.materialBibliograficoService.conf_event_delete(data,'/eliminar')
                      .subscribe(result => {
                        if (result.p_status == 0) {
                          this.messageService.add({severity:'success', summary: 'Satisfactorio', detail: 'Registro eliminado.'});

                        } else {
                          this.messageService.add({severity:'error', summary: 'Error', detail: 'No se puedo realizar el proceso.'});
                        }
                        this.loading=false;
                      }
                        , (error: HttpErrorResponse) => {
                          this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde'});
                          this.loading=false;
                        });
                    }
                });
            }
            nuevoEjemplar(){
                this.formValidarDetalle();
                this.displayEjemplar = true;
            }
            guardarEjemplar(){
            this.confirmationService.confirm({
                message: '¿Estás seguro(a) de que quieres registrar?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'SI',
                rejectLabel: 'NO',
                accept: () => {
                  const sedeVal  = this.formDetalle.value.sede;
                  const tipoMatVal = this.formDetalle.value.tipoMaterial;
                  const tipoAdqVal = this.formDetalle.value.tipoAdquisicion;

                  const sedeId  = typeof sedeVal === 'object' ? sedeVal?.id : sedeVal;
                  const tipoMat =
                    typeof tipoMatVal === 'object' ? tipoMatVal?.id : (tipoMatVal ?? null);
                  const tipoAdq =
                    typeof tipoAdqVal === 'object' ? tipoAdqVal?.id : (tipoAdqVal ?? null);

                  const detalle: DetalleDisplay = {
                    codigoSede:        sedeId,
                    tipoMaterialId:    tipoMat ?? null,
                    tipoAdquisicionId: tipoAdq ?? null,
                    costo:             null,
                    numeroFactura:     null,
                    fechaIngreso:      this.formatDateTime(this.formDetalle.value.fechaIngreso),

                    sede: this.sedesLista.find(s => s.id === sedeId) ?? null,
                    tipoMaterial: tipoMat ? this.tipoMaterialLista.find(t => t.id === tipoMat) ?? null : null,
                    tipoAdquisicion: tipoAdq ? this.tipoAdquisicionLista.find(t => t.id === tipoAdq) ?? null : null,
                    idEstado: 1
                  };

                  this.detalles = [...this.detalles, detalle];

                  this.formDetalle.reset();
                  this.displayEjemplar = false;
                }
            });

            }
            private formatDateTime(d: Date | string | null): string | null {
              if (!d) { return null; }
              if (typeof d === 'string' && d.length > 10) { return d; }
              const dt = typeof d === 'string' ? new Date(d) : d;
              return dt.toISOString().split('.')[0];
            }

            idToSede(id: number | null) {
              return this.sedesLista.find(s => s.id === id);
            }

            idToTipo(id: number | null) {
              return this.tipoAdquisicionLista.find(t => t.id === id);
            }
            onFileSelect(event: any) {
                const file = event.files[0]; // Obtiene el primer archivo seleccionado
                if (file) {
                    this.formPortada.patchValue({ adjunto: file });
                }
                this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Se adjunto archivo' });
            }
}
