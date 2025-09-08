import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { InputValidation } from '../../../input-validation';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { DocumentoService } from '../../../services/documento.service';
import { BibliotecaVirtualService } from '../../../services/biblioteca-virtual.service';
import { TemplateModule } from '../../../template.module';
@Component({
    selector: 'app-modal-regularizar',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '80vw'}"  header="Regularizar" [modal]="true" [closable]="true" styleClass="p-fluid">
    <ng-template pTemplate="content">
    <p-tabs [(value)]="activeTab">
                            <p-tablist>
                                <p-tab value="0">Datos de Usuario</p-tab>
                                <p-tab value="1">Otros Usuarios</p-tab>
                            </p-tablist>
                            <p-tabpanels>
                                <p-tabpanel value="0">
                                <form [formGroup]="form">

    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="tipoUsuario">Tipo de usuario</label>
    <p-select appendTo="body" id="tipoUsuario" formControlName="tipoUsuario" [options]="tipoUsuarioLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="form" modelo="tipoUsuario" ver="Tipo Usuario"></app-input-validation>
</div><div class="flex flex-col gap-2 w-full">
                      <label for="titulo">Buscar por</label>
                      <div class="col-span-2 flex items-center gap-2">
                      <div class="col-span-2 flex items-center gap-2">
    <p-radiobutton id="option1" name="tipoBuscar" value="1" formControlName="tipoBuscar" />
    <label for="option1">Código</label>
    <p-radiobutton id="option2" name="tipoBuscar" value="2" formControlName="tipoBuscar" />
    <label for="option2">Apellidos y nombres</label>
  </div>
                      </div>
</div>
<div class="flex flex-col gap-2 w-full">
                      <label for="especialidad">Buscar</label>
                      <div class="flex items-center gap-x-2">
                      <input pInputText id="palabra-clave" type="text" formControlName="palabraBuscar" class="w-full" />
                      <button
      pButton
      type="button"
      class="p-button-rounded bg-red-500 text-white"
      icon="pi pi-search"
      (click)="buscar()"
      [disabled]="form.get('palabraBuscar')?.invalid"
      pTooltip="Buscar">
    </button>
                      </div>


</div>
    </div>
    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="usuario">Seleccine usuario</label>
    <p-select appendTo="body" id="usuario" formControlName="usuario" [options]="usuariosLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="form" modelo="usuario" ver="usuario"></app-input-validation>
</div>
</div>
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
<div class="flex flex-col gap-2 w-full">
                      <label for="numeroIngreso">Sede</label>
                      <p-select appendTo="body" id="sede" formControlName="sede" [options]="sedeLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="formOtroUsuario" modelo="sede" ver="Sede"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full">
                      <label for="numeroEquipo">N&uacute;mero de equipo</label>
    <p-select appendTo="body" id="numeroEquipo" formControlName="numeroEquipo" [options]="numeroEquipoLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="formOtroUsuario" modelo="numeroEquipo" ver="Numero Equipo"></app-input-validation>
</div>
</div>

<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="usuario">Fecha de prestamo</label>
                      <p-datepicker
      appendTo="body"
      formControlName="fechaPrestamo"
      [ngClass]="'w-full'"
      [style]="{ width: '100%' }"
      [readonlyInput]="true"
      dateFormat="dd/mm/yy">
</p-datepicker>
    <app-input-validation [form]="form" modelo="fechaPrestamo" ver="Fecha Prestamo"></app-input-validation>
</div>

<div class="flex flex-col gap-2 w-full">
                      <label for="usuarioPrestamo">Usuario de pr&eacute;stamo</label>
    <p-select appendTo="body" id="usuarioPrestamo" formControlName="usuarioPrestamo" [options]="usuariosPRLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="form" modelo="usuarioPrestamo" ver="Usuario Prestamo"></app-input-validation>
</div>

<div class="flex flex-col gap-2 w-full">
                      <label for="fechaDevolucion">Fecha de devoluci&oacute;n</label>
                      <p-datepicker
      appendTo="body"
      formControlName="fechaDevolucion"
      [ngClass]="'w-full'"
      [style]="{ width: '100%' }"
      [readonlyInput]="true"
      dateFormat="dd/mm/yy">
</p-datepicker>
    <app-input-validation [form]="form" modelo="fechaDevolucion" ver="Fecha Devolución"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full">
                      <label for="usuarioRecepcion">Usuario de recepci&oacute;n</label>
    <p-select appendTo="body" id="usuarioRecepcion" formControlName="usuarioRecepcion" [options]="usuariosPRLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="form" modelo="usuarioRecepcion" ver="Usuario Recepcion"></app-input-validation>
</div>
</div>

                                </form>

                                </p-tabpanel>
                                <p-tabpanel value="1">
                                <form [formGroup]="formOtroUsuario">

    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="tipoUsuario">Tipo de usuario</label>
    <p-select appendTo="body" id="tipoUsuario" formControlName="tipoUsuario" [options]="tipoUsuarioLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="formOtroUsuario" modelo="tipoUsuario" ver="Tipo Usuario"></app-input-validation>
</div><div class="flex flex-col gap-2 w-full">
                      <label for="tipoDocumento">Tipo de documento</label>
    <p-select appendTo="body" id="tipoDocumento" formControlName="tipoDocumento" [options]="tipoDocumentoLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="formOtroUsuario" modelo="tipoDocumento" ver="Tipo Documento"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full">
                      <label for="nummeroDocumento">Numero Documento</label>
                      <div class="flex items-center gap-x-2">
                      <input pInputText id="nummeroDocumento" type="text" formControlName="nummeroDocumento" class="w-full" />
                      <button
      pButton
      type="button"
      class="p-button-rounded bg-red-500 text-white"
      icon="pi pi-search"
      (click)="buscar()"
      [disabled]="formOtroUsuario.get('nummeroDocumento')?.invalid"
      pTooltip="Buscar">
    </button>
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
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="numeroIngreso">Sede</label>
                      <p-select appendTo="body" id="sede" formControlName="sede" [options]="sedeLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="formOtroUsuario" modelo="sede" ver="Sede"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full">
                      <label for="numeroEquipo">N&uacute;mero de equipo</label>
    <p-select appendTo="body" id="numeroEquipo" formControlName="numeroEquipo" [options]="numeroEquipoLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="formOtroUsuario" modelo="numeroEquipo" ver="Numero Equipo"></app-input-validation>
</div>
</div>

<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="usuario">Fecha de prestamo</label>
                      <p-datepicker
      appendTo="body"
      formControlName="fechaPrestamo"
      [ngClass]="'w-full'"
      [style]="{ width: '100%' }"
      [readonlyInput]="true"
      dateFormat="dd/mm/yy">
</p-datepicker>
    <app-input-validation [form]="formOtroUsuario" modelo="fechaPrestamo" ver="Fecha Prestamo"></app-input-validation>
</div>

<div class="flex flex-col gap-2 w-full">
                      <label for="usuarioPrestamo">Usuario de pr&eacute;stamo</label>
    <p-select appendTo="body" id="usuarioPrestamo" formControlName="usuarioPrestamo" [options]="usuariosPRLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="formOtroUsuario" modelo="usuarioPrestamo" ver="Usuario Prestamo"></app-input-validation>
</div>
</div>
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2">

    <div class="flex items-center space-x-3 py-2">
                            <p-checkbox id="checkDevolver" name="option" value="1" formControlName="devolver"/>
                            <label for="checkDevolver" class="ml-2">¿Desea devolver?</label>
                        </div>
</div>
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2" *ngIf="formOtroUsuario.get('devolver')?.value">

<div class="flex flex-col gap-2 w-full">
                      <label for="fechaDevolucion">Fecha de devoluci&oacute;n</label>
                      <p-datepicker
      appendTo="body"
      formControlName="fechaDevolucion"
      [ngClass]="'w-full'"
      [style]="{ width: '100%' }"
      [readonlyInput]="true"
      dateFormat="dd/mm/yy">
</p-datepicker>
    <app-input-validation [form]="formOtroUsuario" modelo="fechaDevolucion" ver="Fecha Devolución"></app-input-validation>
</div>
<div class="flex flex-col gap-2 w-full">
                      <label for="usuarioRecepcion">Usuario de recepci&oacute;n</label>
    <p-select appendTo="body" id="usuarioRecepcion" formControlName="usuarioRecepcion" [options]="usuariosPRLista" optionLabel="descripcion" placeholder="Seleccionar" class="w-full"></p-select>
    <app-input-validation [form]="formOtroUsuario" modelo="usuarioRecepcion" ver="Usuario Recepcion"></app-input-validation>
</div>
</div>

                                </form>
                                </p-tabpanel>
                            </p-tabpanels>
                        </p-tabs>
    </ng-template>
    <ng-template pTemplate="footer">
                    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                    <button pButton pRipple type="button" icon="pi pi-check"
                            [disabled]="(activeTab === '0' ? form.invalid : formOtroUsuario.invalid) || loading"
                            (click)="guardar()"
                            label="Guardar" class="p-button-success"></button>
                </ng-template>
  </p-dialog>

  <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
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
    sedeLista: any[] = [];
    numeroEquipoLista: any[] = [];
    tipoUsuarioLista: any[] = [];
    tipoDocumentoLista: any[] = [];
    usuariosLista: any[] = [];
    tipoMaterialLista: any[] = [];
    usuariosPRLista: any[] = [];
    objeto: any = null;
    radioValue: any = null;
    palabraClave: string = '';
    activeTab: string = '0';
    @Output() saved = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        private genericoService: GenericoService,
        private materialBibliograficoService: MaterialBibliograficoService,
        private documentoService: DocumentoService,
        private bibliotecaVirtualService: BibliotecaVirtualService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {

        this.form = this.fb.group({
            tipoUsuario: ['', [Validators.required]],
            tipoBuscar: [1, [Validators.required]],
            palabraBuscar: ['', [Validators.required]],
            usuario: ['', [Validators.required]],
            sede: ['', [Validators.required]],
            numeroEquipo: ['', [Validators.required]],
            fechaPrestamo: ['', [Validators.required]],
            fechaDevolucion: ['', [Validators.required]],
            usuarioPrestamo: ['', [Validators.required]],
            usuarioRecepcion: ['', [Validators.required]]
        });
        this.formOtroUsuario = this.fb.group({
            tipoUsuario: ['', [Validators.required]],
            tipoDocumento: ['', [Validators.required]],
            nummeroDocumento: ['', [Validators.required]],
            nombreCompleto: ['', [Validators.required]],
            sede: ['', [Validators.required]],
            numeroEquipo: ['', [Validators.required]],
            fechaPrestamo: ['', [Validators.required]],
            devolver: [[], [Validators.required]],
            fechaDevolucion: ['', [Validators.required]],
            usuarioPrestamo: ['', [Validators.required]],
            usuarioRecepcion: ['', [Validators.required]]
        });

        this.form.get('tipoUsuario')?.valueChanges.subscribe(() => {
            this.form.patchValue({ palabraBuscar: '', usuario: null });
            this.filtrarUsuarios();
        });
        this.form.get('sede')?.valueChanges.subscribe(s => this.cargarEquipos(s));
        this.formOtroUsuario.get('sede')?.valueChanges.subscribe(s => this.cargarEquipos(s));
    }
    async ngOnInit() {
        await this.listarTiposDocumento();
        await this.listarTiposUsuario();
        await this.listarUsuariosPrestamo();
        await this.listarSedes();
    }

  async listarTiposDocumento() {
    this.loading = true;
    this.tipoDocumentoLista = [];
    this.genericoService.tipodocumento_get('lista-activo')
      .subscribe(
        (result: any) => {
          this.loading = false;
          if (result.status == "0") {
            this.tipoDocumentoLista = result.data;
            this.formOtroUsuario.get('tipoDocumento')?.setValue(this.tipoDocumentoLista[0]);
          }
        }
        , (error: HttpErrorResponse) => {
          this.loading = false;
        }
      );
  }
    openModal() {
        this.form.reset({ tipoBuscar: 1 });
        this.formOtroUsuario.reset({ devolver: [] });
        this.objeto = {};
        this.display = true;
        this.filtrarUsuarios();
    }

    closeModal() {
        this.display = false;
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
        this.documentoService.consultar(tipo, numero).subscribe(data => {
            this.loading = false;
            if (data) {
                let nombre =
                    data.NombreCompleto ||
                    data.NAME ||
                    `${data.Nombres ?? ''} ${data.ApellidoPaterno ?? ''} ${data.ApellidoMaterno ?? ''}`.trim();
                if (typeof nombre === 'string') {
                    nombre = nombre.replace(',', ' ').trim();
                }
                this.formOtroUsuario.get('nombreCompleto')?.setValue(nombre);
            } else {
                this.formOtroUsuario.get('nombreCompleto')?.setValue('');
                this.messageService.add({ severity: 'warn', summary: 'No encontrado', detail: 'No se encontró el documento' });
            }
        });
    }

    private obtenerCodigoDocumento(doc: any): string | null {
        const tipo = doc?.codigo ?? doc?.code ?? doc?.idTipoDocumento ?? doc?.id;
        return tipo != null ? String(tipo).padStart(2, '0') : null;
    }

    private cargarEquipos(sede: any) {
        if (!sede?.id) {
            this.numeroEquipoLista = [];
            return;
        }
        this.bibliotecaVirtualService.filtrarPorSede(sede.id).subscribe({
            next: resp => {
                this.numeroEquipoLista = (resp?.data || []).map((e: any) => ({
                    descripcion: e.numeroEquipo,
                    id: e.idEquipo ?? e.id
                }));
            },
            error: () => {
                this.numeroEquipoLista = [];
            }
        });
    }

    private cargarUsuarios(codigoSeleccionado: string) {
        const tipoInicial = this.tipoUsuarioLista[0];
        if (codigoSeleccionado) {
            this.loading = true;
            this.materialBibliograficoService.listarUsuarios(codigoSeleccionado).subscribe({
                next: (usuarios: any[]) => {
                    this.loading = false;
                    const uSel = usuarios.find(u => u.codigo === codigoSeleccionado || u.login === codigoSeleccionado);
                    const tipoSel = uSel
                        ? this.tipoUsuarioLista.find((t: any) => String(t.id) === String(uSel.tipoUsuarioCodigo) || t.descripcion === uSel.tipoUsuario)
                        : tipoInicial;
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
            next: (lista: any[]) => {
                this.loading = false;
                this.usuariosLista = lista.map(u => ({
                    descripcion: `${u.nombres ?? ''} ${u.apellidoPaterno ?? ''} ${u.apellidoMaterno ?? ''}`.trim() || u.email || u.login || u.codigo,
                    codigoUsuario: u.codigo ?? u.login ?? ''
                }));
                if (codigoSeleccionado) {
                    const u = this.usuariosLista.find(us => us.codigoUsuario === codigoSeleccionado);
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
            error: () => (this.tipoUsuarioLista = [])
        });
    }

    async listarUsuariosPrestamo() {
        this.loading = true;
        this.materialBibliograficoService.listarUsuarios().subscribe({
            next: (lista: any[]) => {
                this.loading = false;
                this.usuariosPRLista = lista.map(u => ({
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

    async listarSedes() {
        this.loading = true;
        this.genericoService.sedes_get('api/equipos/sedes').subscribe({
            next: (result: any) => {
                this.loading = false;
                if (result.status === 0) {
                    this.sedeLista = result.data;
                }
            },
            error: () => {
                this.loading = false;
                this.sedeLista = [];
            }
        });
    }

    guardar() {
        this.loading = true;
        const datosRaw = this.activeTab === '0' ? this.form.getRawValue() : this.formOtroUsuario.getRawValue();
        const datos = this.activeTab === '0'
            ? datosRaw
            : { ...datosRaw, tipoDocumento: this.obtenerCodigoDocumento(datosRaw.tipoDocumento) };
        const payload: any = {
            ...datos,
            sedeId: datos.sede?.id,
            idEquipo: datos.numeroEquipo?.id,
            numeroEquipo: datos.numeroEquipo?.descripcion,
            fechaPrestamo: this.aIsoLocal(datos.fechaPrestamo),
            fechaDevolucion: this.aIsoLocal(datos.fechaDevolucion)
        };
        this.materialBibliograficoService.regularizarPrestamo(payload).subscribe({
            next: (resp: any) => {
                this.loading = false;
                this.display = false;
                this.messageService.add({ severity: 'success', summary: 'Listo', detail: 'Préstamo regularizado.' });
                this.saved.emit(resp?.data);
            },
            error: (e: HttpErrorResponse) => {
                this.loading = false;
                const detail = e.status === 403
                    ? 'No tiene permisos para regularizar el préstamo'
                    : 'No se pudo regularizar el préstamo';
                this.messageService.add({ severity: 'error', summary: 'Error', detail });
            }
        });
    }

    private aIsoLocal(fecha: Date | null): string | null {
        if (!fecha) {
            return null;
        }
        const offset = fecha.getTimezoneOffset() * 60000;
        return new Date(fecha.getTime() - offset).toISOString().slice(0, 19);
    }
}
