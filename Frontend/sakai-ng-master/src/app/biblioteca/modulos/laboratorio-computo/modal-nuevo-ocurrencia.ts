import { Component, ElementRef, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
import { GenericoService } from '../../services/generico.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { ModalInvolucrado } from './modal-involucrado';
import { ModalMaterial } from './modal-material';
import { AuthService } from '../../services/auth.service';
import { Sedes } from '../../interfaces/sedes';
import { OcurrenciaDTO } from '../../interfaces/ocurrenciaDTO';
import { Usuario } from '../../interfaces/usuario';
import { Equipo } from '../../interfaces/biblioteca-virtual/equipo';
import { OcurrenciaUsuario } from '../../interfaces/OcurrenciaUsuario';
import { OcurrenciaMaterial } from '../../interfaces/OcurrenciaMaterial';
import { OcurrenciaMaterialDTO } from '../../interfaces/OcurrenciaMaterialDTO';
import { OcurrenciaEventService } from '../../services/ocurrencia-event.service';
@Component({
    selector: 'app-modal-nuevo-ocurrencia',
    standalone: true,
    template: `<p-dialog [(visible)]="display" [style]="{width: '75%'}"  header="Mantenimiento de materiales en deuda" [modal]="true" [closable]="true" styleClass="p-fluid" [contentStyle]="{overflow: 'visible'}">
     <ng-template pTemplate="content">
        <form [formGroup]="form">
        <div class="grid grid-cols-12 gap-4">
                    <div class="flex flex-col gap-2 col-span-12 sm:col-span-6 md:col-span-3">
                    <label for="codigo">Código de la ocurrencia</label>
                    <input pInputText id="codigo" type="text" formControlName="id" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-12 sm:col-span-6 md:col-span-3">
                    <label for="fecha">Fecha</label>
                    <p-datepicker
                          appendTo="body"
                          [ngClass]="'w-full'"
                          [style]="{ width: '100%' }"
                          [readonlyInput]="true"
                          dateFormat="dd/mm/yy"
                          formControlName="fechaCreacion">
                    </p-datepicker>
                    </div>

                    <div class="flex flex-col gap-2 col-span-12 sm:col-span-6 md:col-span-3">
                    <label for="semestre">Semestre</label>
                    <p-select appendTo="body"
                     [options]="semestreLista" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>

                    <div class="flex flex-col gap-2 col-span-12 sm:col-span-6 md:col-span-3">
                    <label for="sede">Local/Filial</label>
                    <p-select appendTo="body" formControlName="sedePrestamo"  [options]="sedesLista" optionLabel="descripcion" optionValue="id" placeholder="Seleccionar" />
                    </div>

                    <div class="flex flex-col gap-2 col-span-12 sm:col-span-6 md:col-span-4">
                    <label for="ambiente">Ambiente</label>
                    <p-select appendTo="body" [options]="ambienteLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>

                    <div class="flex flex-col gap-2 col-span-12 sm:col-span-6 md:col-span-8">
                    <label for="personal">Personal</label>
                    <input pInputText id="personal" type="text" formControlName="usuarioCreacion" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-12">
                    <label for="auditoria">Auditoria</label>
                    <textarea pTextarea id="auditoria" rows="4" formControlName="descripcion"></textarea>
                    </div>

                </div>
<div class="grid grid-cols-8 gap-4 mt-4 flex justify-end">
    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()"
        [disabled]="loading || guardado || actualizar" label="Cancelar" class="p-button-outlined p-button-danger"></button>
    <button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()"
        [disabled]="form.invalid || loading || guardado || actualizar" label="Guardar" class="p-button-success"></button>
</div>
@if(guardado || actualizar){

                <div class="grid grid-cols-8 gap-4 items-center py-4">
    <span class="col-span-5 font-bold">ESTUDIANTES INVOLUCRADOS</span>
    <div class="col-span-3 flex justify-end">
        <button pButton type="button" label="Agregar" icon="pi pi-plus" class="p-button-success"
            [disabled]="loading" (click)="modalInvolucrado.openModal()"
            pTooltip="Agregar" tooltipPosition="bottom"></button>
    </div>
</div>
<div class="py-4">
        <p-table
    [value]="involucrados"
    showGridlines
    [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template pTemplate="body" let-u>
            <tr>
                <td>{{ u.idUsuario ?? u.codigoUsuario }}</td>
                <td>{{ nombreCompleto(u) }}</td>
                <td>
                <p-button icon="pi pi-trash" rounded outlined (click)="eliminarInvolucrado(u)" pTooltip="Eliminar" tooltipPosition="bottom"/>
                </td>
            </tr>
        </ng-template>
</p-table>
    </div>
<div class="grid grid-cols-8 gap-4 items-center py-4">
    <span class="col-span-5 font-bold">MATERIALES INVOLUCRADOS</span>
    <div class="col-span-3 flex justify-end">
        <button pButton type="button" label="Agregar" icon="pi pi-plus" class="p-button-success"
            [disabled]="loading" (click)="modalMaterial.openModal()"
            pTooltip="Agregar" tooltipPosition="bottom"></button>
    </div>
</div>
<div class="py-4">
        <p-table
    [value]="materiales"
    showGridlines
    [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template #header>
            <tr>
                <th>Codigo</th>
                <th>Material</th>
                <th>Cant.</th>
                <th></th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-m>
            <tr>
                <td>{{ m.codigoLocalizacion || m.codigoEquipo }}</td>
                <td>{{ m.nombre }}</td>
                <td>{{ m.cantidad }}</td>
                <td>
                <p-button icon="pi pi-trash" rounded outlined (click)="eliminarInvolucrado(m)" pTooltip="Eliminar" tooltipPosition="bottom"/>
                </td>
            </tr>
        </ng-template>
</p-table>
    </div>

}
        </form>

     </ng-template>

  </p-dialog>

  <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>

<app-modal-involucrado #modalInvolucrado
                      (select)="onUsuarioSelected($event)">
</app-modal-involucrado>

<app-modal-material   #modalMaterial
                      (select)="onEquipoSelected($event)">
</app-modal-material>
`
  ,
    imports: [TemplateModule,ModalMaterial,ModalInvolucrado],
    providers: [MessageService, ConfirmationService],
    styles: [`:host ::ng-deep label{white-space:normal !important;overflow:visible !important;text-overflow:initial !important;}`]
})
export class ModalNuevoOcurencia implements OnInit {
    @Output() saved = new EventEmitter<void>();
    loading: boolean = false;
    objeto: any = {};
    display: boolean = false;
    actualizar: boolean = false;
    form: FormGroup = new FormGroup({});
    sedesLista: Sedes[] = [];
    semestreLista: ClaseGeneral[] = [];
    ambienteLista: ClaseGeneral[] = [];
    especialidadLista: ClaseGeneral[] = [];
    programaLista: ClaseGeneral[] = [];
    cicloLista: ClaseGeneral[] = [];
    docenteLista: ClaseGeneral[] = [];
    cursoLista: ClaseGeneral[] = [];
    turnoLista: ClaseGeneral[] = [];
  involucrados: OcurrenciaUsuario[] = [];
  materiales:   any[] = [];
    guardado:boolean=false;
    nuevoInvolucrado:boolean=false;
    nuevoMaterial:boolean=false;
    detallePrestamoId!: number;
    detalle!: OcurrenciaDTO;
        @ViewChild('modalMaterial') modalMaterial!: ModalMaterial;
        @ViewChild('modalInvolucrado') modalInvolucrado!: ModalInvolucrado;
  /** ID usado al crear la ocurrencia (detalle de equipo o biblioteca) */
  idNormalizado: number = 0;
  /** Guarda el ID de detalle de biblioteca cuando aplique */
  idDetalleBiblioteca: number | null = null;
  /** Guarda el ID de detalle de préstamo de equipo cuando aplique */
  idDetallePrestamo: number | null = null;
  /** Guarda el objeto original enviado al abrir el modal */
  sourceItem: any = null;
  codigoUsuario: string | null = null;

constructor(private fb: FormBuilder,
        private auth: AuthService,
        private genericoService: GenericoService,
        private materialBibliograficoService: MaterialBibliograficoService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private events: OcurrenciaEventService) {
}
    ngOnInit() {
        this.guardado=false;
    this.form = this.fb.group({
      // — campos de sólo lectura (inician vacíos, deshabilitados) —
      id               : [{ value: null, disabled: true }, Validators.required],
      fechaCreacion    : [null, Validators.required],
      sedePrestamo     : [null, Validators.required],
      usuarioCreacion  : [null, Validators.required],

      // — auditoría (editable) —
      descripcion      : ['', [ Validators.required, Validators.maxLength(500) ]]
    });
        this.ListaSede();
    }
  openModal(objeto: any) {
    this.sourceItem          = objeto;
    this.idDetallePrestamo   = objeto.idDetallePrestamo ?? null;
    this.idDetalleBiblioteca = objeto.idDetalleBiblioteca ?? null;
    this.codigoUsuario       = objeto.codigoUsuario ?? null;
    const idDetectado =
      this.idDetallePrestamo != null
        ? this.idDetallePrestamo
        : objeto.idEquipo != null
          ? objeto.idEquipo
          : this.idDetalleBiblioteca ?? 0;
    this.idNormalizado = idDetectado;

    const decoded = this.auth.getUser();
    const fullName = (
      ((decoded?.givenname ?? '') + ' ' + (decoded?.surname ?? '')).trim() ||
      decoded?.displayname ||
      decoded?.name ||
      decoded?.sub ||
      ''
    );

    // Inicializamos el formulario y obtenemos el siguiente ID desde el servidor
    this.form.patchValue({
      id: null,
      fechaCreacion: new Date(),
      sedePrestamo: objeto.sedePrestamo ?? objeto.sede?.id ?? null,
      usuarioCreacion: fullName,
      descripcion: ''
    });

    this.materialBibliograficoService
      .obtenerSiguienteIdOcurrencia()
      .subscribe(id => this.form.patchValue({ id }));

    this.involucrados = [];
    this.materiales = [];
    if (objeto.nombreEquipo) {
      this.materiales.push({
        codigoEquipo: objeto.idEquipo ?? objeto.numeroEquipo,
        codigoLocalizacion: objeto.codigoLocalizacion ?? '',
        nombre: objeto.nombreEquipo,
        cantidad: 1
      });
    } else if (objeto.idDetalleBiblioteca) {
      this.materiales.push({
        codigoEquipo: objeto.numeroIngreso ?? objeto.idDetalleBiblioteca,
        codigoLocalizacion: objeto.biblioteca?.codigoLocalizacion ?? '',
        nombre:
          objeto.biblioteca?.titulo ||
          objeto.tipoMaterial?.descripcion ||
          'Material',
        cantidad: 1
      });
    }
    this.guardado = false;
    this.actualizar = false;
    this.display = true;
  }
        openEditarModal() {
            this.objeto={};
            this.display = true;
            this.actualizar=true;
        }

        closeModal() {
            this.display = false;
        }
  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto: OcurrenciaDTO = {
      sedePrestamo:    this.form.value.sedePrestamo,
      descripcion:     this.form.value.descripcion,
      usuarioCreacion: this.form.value.usuarioCreacion,
      codigoUsuario:   this.codigoUsuario ?? undefined
    };
    if (this.idDetallePrestamo != null) {
      dto.idDetallePrestamo = this.idDetallePrestamo;
    }
    if (this.idDetalleBiblioteca != null) {
      dto.idDetalleBiblioteca = this.idDetalleBiblioteca;
    }

    this.materialBibliograficoService.crearOcurrencia(dto).subscribe({
      next: (created: OcurrenciaDTO) => {
        // Aquí aplicamos el “non-null assertion” para quitar el warning:
        this.idNormalizado = created.id!;
        this.form.patchValue({ id: created.id });

        this.messageService.add({ severity: 'success', detail: 'Ocurrencia guardada.' });
        this.guardado = true;
        if (this.sourceItem) {
          const id = this.sourceItem.id ?? this.sourceItem.idEquipo;
          if (id) {
            this.events.addEquipo(id);
          }
        }
        this.saved.emit();

        if (!this.idDetallePrestamo && !this.idDetalleBiblioteca && this.sourceItem?.idEquipo) {
          this.materialBibliograficoService
            .addMaterial(this.idNormalizado, { idEquipo: this.sourceItem.idEquipo, cantidad: 1, esBiblioteca: false })
            .subscribe(() => this.loadMateriales());
        } else {
          this.loadMateriales();
        }

        this.loadInvolucrados();
        this.loadMateriales();
      },
      error: () => {
        this.messageService.add({ severity: 'error', detail: 'Error al registrar.' });
      }
    });
  }
        agregarInvolucrados(){
            this.modalInvolucrado.openModal();
        }
        agregarMaterial(){
            this.modalMaterial.openModal();
        }
        eliminarInvolucrado(objeto:any){}
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
openForEdit(ocurrencia: OcurrenciaDTO) {
  this.actualizar = true;
  this.detalle = ocurrencia;
  this.guardado = true;
  this.display = true;
  this.idNormalizado = ocurrencia.id!;
  this.idDetallePrestamo   = ocurrencia.idDetallePrestamo ?? null;
  this.idDetalleBiblioteca = ocurrencia.idDetalleBiblioteca ?? null;
  this.codigoUsuario       = ocurrencia.codigoUsuario ?? null;
  this.form.patchValue({
    id:                ocurrencia.id,
    fechaCreacion:     ocurrencia.fechaCreacion ? new Date(ocurrencia.fechaCreacion) : null,
    sedePrestamo:      ocurrencia.sedePrestamo,
    usuarioCreacion:   ocurrencia.usuarioCreacion,
    descripcion:       ocurrencia.descripcion,
    // … el resto …
  });
  if (ocurrencia.idDetallePrestamo) {
    this.materialBibliograficoService
      .getDetallePrestamo(ocurrencia.idDetallePrestamo)
      .subscribe(dp => {
        // Tabla de estudiantes:
        this.codigoUsuario = dp.codigoUsuario;
        this.involucrados = [{
          codigoUsuario: dp.codigoUsuario,
          tipoUsuario:   (dp as any).tipoUsuario
        }];

        // Tabla de materiales:
        this.materiales = [{
          codigoEquipo: dp.equipo!.idEquipo!,
          codigoLocalizacion: (dp.equipo as any)?.codigoLocalizacion ?? '',
          nombre: dp.equipo!.nombreEquipo!,
          cantidad: 1,
          ip: dp.equipo!.ip!
        }];
      });
  } else if (ocurrencia.idDetalleBiblioteca) {
    this.materialBibliograficoService
      .getDetalleBiblioteca(ocurrencia.idDetalleBiblioteca)
      .subscribe(det => {
        this.sourceItem = det;
        this.materiales = [{
          codigoEquipo: det.numeroIngreso ?? det.idDetalleBiblioteca,
          codigoLocalizacion: det.biblioteca?.codigoLocalizacion ?? '',
          nombre: det.biblioteca?.titulo || det.tipoMaterial?.descripcion || 'Material',
          cantidad: 1
        }];
      });
  }
  this.loadInvolucrados();
  this.loadMateriales();
}
  loadInvolucrados() {
    this.materialBibliograficoService
      .listarUsuariosOcurrencia(this.idNormalizado)
      .subscribe((list) => {
        this.involucrados = list;
        if (!this.codigoUsuario && list.length > 0) {
          this.codigoUsuario = list[0].codigoUsuario;
        }
      });
  }

  loadMateriales() {
    this.materialBibliograficoService
      .listarMaterialesOcurrencia(this.idNormalizado)
      .subscribe((dtos: OcurrenciaMaterialDTO[]) => {
        if (dtos.length > 0) {
          this.materiales = dtos.map((dto) => ({
            codigoEquipo: dto.codigoEquipo,
            codigoLocalizacion: dto.codigoEquipo,
            nombre: dto.nombreEquipo,
            cantidad: dto.cantidad,
            costo: dto.costo ?? 0,
            subTotal: (dto.costo ?? 0) * dto.cantidad,
            esBiblioteca: dto.esBiblioteca ?? false
          }));
        } else if (this.idDetalleBiblioteca != null && this.sourceItem) {
          this.materiales = [{
            codigoEquipo: this.sourceItem.numeroIngreso ?? this.sourceItem.idDetalleBiblioteca,
            codigoLocalizacion: this.sourceItem.biblioteca?.codigoLocalizacion ?? '',
            nombre:
              this.sourceItem.biblioteca?.titulo ||
              this.sourceItem.tipoMaterial?.descripcion ||
              'Material',
            cantidad: 1,
            esBiblioteca: true
          }];
        } else {
          this.materiales = [];
        }
      });
  }

  onUsuarioSelected(u: { codigoUsuario: string; tipoUsuario: number }) {
    this.materialBibliograficoService
      .addInvolucrado(this.idNormalizado, {
        codigoUsuario: u.codigoUsuario,
        tipoUsuario: u.tipoUsuario
      })
      .subscribe(() => {
        this.codigoUsuario = this.codigoUsuario ?? u.codigoUsuario;
        this.loadInvolucrados();
      });
  }

      /** Y aquí defines el shape del equipo seleccionado */
  onEquipoSelected(e: { idEquipo: number; nombreEquipo: string; ip: string }) {
    this.materialBibliograficoService
      .addMaterial(this.idNormalizado, { idEquipo: e.idEquipo, cantidad: 1, esBiblioteca: false })
      .subscribe(() => this.loadMateriales());
  }

  nombreCompleto(u: OcurrenciaUsuario): string {
    return [u.nombres, u.apellidoPaterno, u.apellidoMaterno]
      .filter(Boolean)
      .join(' ');
  }

    }
