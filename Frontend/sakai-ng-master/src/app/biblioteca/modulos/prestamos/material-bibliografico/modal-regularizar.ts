import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { DetalleBibliotecaDTO } from '../../../interfaces/material-bibliografico/DetalleBibliotecaDTO';
import { Usuario } from '../../../interfaces/usuario';
import { InputValidation } from '../../../input-validation';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
@Component({
    selector: 'app-modal-regularizar',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '80vw'}"  header="Regularizar" [modal]="true" [closable]="true" styleClass="p-fluid">
    <ng-template pTemplate="content">            
    <p-tabs value="0">
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
</div><div class="flex flex-col gap-2 w-full">
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
    <h3 class="text-base font-semibold">Datos del usuario</h3>
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
<div class="flex flex-col md:flex-row gap-x-4 gap-y-2" *ngIf="formOtroUsuario.get('devolver')?.value.length>0">

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
                    <button pButton pRipple type="button" icon="pi pi-check" [disabled]="form.invalid || loading" label="Guardar" class="p-button-success"></button>
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
    tipoUsuarioLista: any[] = [];
    tipoDocumentoLista: any[] = [];
    usuariosLista: any[] = [];
    tipoMaterialLista: any[] = [];
    usuariosPRLista: any[] = [];
    usuariosTodos: Usuario[] = [];
    objeto: any = null;
    radioValue: any = null;
    palabraClave: string = "";

    constructor(private fb: FormBuilder, private genericoService: GenericoService, private materialBibliograficoService: MaterialBibliograficoService, private confirmationService: ConfirmationService, private messageService: MessageService) {

        this.form = this.fb.group({
            tipoUsuario: ['', [Validators.required]],
            tipoBuscar: [1, [Validators.required]],
            palabraBuscar: ['', [Validators.required]],
            usuario: ['', [Validators.required]],
            numeroIngreso: ['', [Validators.required]],
            tipoMaterial: ['', [Validators.required]],
            fechaPrestamo: ['', [Validators.required]],
            fechaDevolucion: ['', [Validators.required]],
            usuarioPrestamo: ['', [Validators.required]],
            usuarioRecepcion: ['', [Validators.required]]
        });
        this.form.get('tipoUsuario')?.valueChanges.subscribe(() => this.filtrarUsuarios());
        this.formOtroUsuario = this.fb.group({
            
            tipoUsuario: ['', [Validators.required]],
            tipoDocumento: ['', [Validators.required]],
            nummeroDocumento: ['', [Validators.required]],
            nombreCompleto: ['', [Validators.required]],
            numeroIngreso: ['', [Validators.required]],
            tipoMaterial: ['', [Validators.required]],
            fechaPrestamo: ['', [Validators.required]],
            devolver: [false, [Validators.required]],
            fechaDevolucion: ['', [Validators.required]],
            usuarioPrestamo: ['', [Validators.required]],
            usuarioRecepcion: ['', [Validators.required]]
        });
    }
    async ngOnInit() {

        await this.listarTiposDocumento();
        await this.listarTiposUsuario();
    }
    
  async listarTiposDocumento() {
    this.loading = true;
    this.tipoDocumentoLista = [];
    this.genericoService.tipodocumento_get('')
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
    openModal(detalle: DetalleBibliotecaDTO) {
        this.objeto = detalle;
        if (detalle) {
            const fechaPrestamo = detalle.fechaReserva ? new Date(detalle.fechaReserva) : null;
            const fechaDevolucion = fechaPrestamo
                ? new Date(fechaPrestamo.getTime() + 7 * 24 * 60 * 60 * 1000)
                : null;
            if (detalle.tipoMaterial) {
                this.tipoMaterialLista = [detalle.tipoMaterial];
            }
            if (detalle.usuarioPrestamo) {
                this.usuariosPRLista = [{ descripcion: detalle.usuarioPrestamo }];
            }
            this.form.patchValue({
                numeroIngreso: detalle.numeroIngreso ?? '',
                tipoMaterial: detalle.tipoMaterial ?? null,
                fechaPrestamo,
                fechaDevolucion,
                usuarioPrestamo: detalle.usuarioPrestamo ? { descripcion: detalle.usuarioPrestamo } : null
            });
        }
        this.cargarUsuarios(detalle?.codigoUsuario ?? '');
        this.display = true;
    }

    closeModal() {
        this.display = false;
    }
    guardar() {
        this.loading = false;
        this.display = false;
    }
    buscar() {
        this.filtrarUsuarios();
    }

    private cargarUsuarios(codigoSeleccionado: string) {
        this.loading = true;
        this.materialBibliograficoService.listarUsuarios().subscribe({
            next: (usuarios: Usuario[]) => {
                this.loading = false;
                this.usuariosTodos = usuarios;
                let tipoInicial = this.tipoUsuarioLista[0];
                if (codigoSeleccionado) {
                    const uSel = usuarios.find(
                        u => u.codigo === codigoSeleccionado || u.login === codigoSeleccionado
                    );
                    if (uSel) {
                        tipoInicial = this.tipoUsuarioLista.find(t => t.descripcion === uSel.tipoUsuario) || tipoInicial;
                    }
                }
                if (tipoInicial) {
                    this.form.get('tipoUsuario')?.setValue(tipoInicial);
                    this.filtrarUsuarios(codigoSeleccionado);
                }
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    private filtrarUsuarios(codigoSeleccionado: string = '') {
        const tipoId = String(this.form.get('tipoUsuario')?.value?.id ?? '');
        const termino = (this.form.get('palabraBuscar')?.value || '').toLowerCase();
        const tipoBuscar = this.form.get('tipoBuscar')?.value;
        let lista = this.usuariosTodos.filter(u => String(u.tipoUsuarioCodigo ?? '') === tipoId);
        if (termino) {
            lista = lista.filter(u => {
                const documento = (u.numeroDocumento || u.numerodocumento || u.login || '').toLowerCase();
                const nombre = `${u.nombres ?? ''} ${u.apellidoPaterno ?? ''} ${u.apellidoMaterno ?? ''}`.toLowerCase();
                const correo = (u.email || '').toLowerCase();
                switch (tipoBuscar) {
                    case 1: return documento.includes(termino);
                    case 2: return nombre.includes(termino);
                    case 3: return correo.includes(termino);
                    default: return false;
                }
            });
        }
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
    }

}
