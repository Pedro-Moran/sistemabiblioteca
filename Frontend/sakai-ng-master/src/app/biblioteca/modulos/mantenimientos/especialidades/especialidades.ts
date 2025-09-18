import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TemplateModule } from '../../../template.module';
import { Especialidad } from '../../../interfaces/especialidad';
import { EspecialidadService } from '../../../services/especialidad.service';
import { ProgramaService } from '../../../services/programa.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [TemplateModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-toolbar styleClass="mb-6">
      <ng-template #start>
        <p-button label="Nueva Especialidad" icon="pi pi-plus" (onClick)="openNew()" />
      </ng-template>
    </p-toolbar>
    <p-table
      #dt1
      [value]="especialidades"
      dataKey="id"
      [rows]="10"
      [paginator]="true"
      [rowsPerPageOptions]="[10, 25, 50]"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
      [rowHover]="true"
      styleClass="p-datatable-gridlines"
      [globalFilterFields]="['codigo','descripcion','programaCodigo','programaDescripcion','activo']"
      [loading]="loading"
      responsiveLayout="scroll"
    >
      <ng-template pTemplate="caption">
        <div class="flex items-center justify-between">
          <p-button [outlined]="true" icon="pi pi-filter-slash" label="Limpiar" (click)="clear(dt1)" />
          <p-iconfield>
            <input pInputText #filter type="text" placeholder="Filtrar" (input)="onGlobalFilter(dt1,$event)" />
          </p-iconfield>
        </div>
      </ng-template>
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="codigo" style="width:8rem">Código<p-sortIcon field="codigo"></p-sortIcon></th>
          <th pSortableColumn="programaDescripcion">Programa<p-sortIcon field="programaDescripcion"></p-sortIcon></th>
          <th pSortableColumn="descripcion">Descripción<p-sortIcon field="descripcion"></p-sortIcon></th>
          <th pSortableColumn="activo" style="width:8rem">Activo<p-sortIcon field="activo"></p-sortIcon></th>
          <th style="width:8rem">Acciones</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-esp>
        <tr>
          <td>{{ esp.codigo || '-' }}</td>
          <td>
            <div class="flex flex-column">
              <span class="font-semibold">{{ esp.programaCodigo || '-' }}</span>
              <small class="text-color-secondary">{{ esp.programaDescripcion || '' }}</small>
            </div>
          </td>
          <td>{{ esp.descripcion }}</td>
          <td>
            <p-tag [value]="esp.activo ? 'Sí' : 'No'" [severity]="esp.activo ? 'success' : 'danger'"></p-tag>
          </td>
          <td>
            <p-button icon="pi pi-pencil" rounded outlined class="mr-2" (onClick)="edit(esp)"></p-button>
            <p-button icon="pi pi-trash" severity="danger" rounded outlined (onClick)="confirmDelete(esp)"></p-button>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="5">No se encontraron registros.</td>
        </tr>
      </ng-template>
      <ng-template pTemplate="loadingbody">
        <tr>
          <td colspan="5">Cargando datos. Espere por favor.</td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog
      [(visible)]="dialog"
      header="Especialidad"
      [modal]="true"
      [style]="{ width: '640px', maxWidth: '95vw' }"
      (onHide)="hideDialog()"
    >
      <div class="grid formgrid p-fluid">
        <div class="field col-12 md:col-6">
          <label for="codigo" class="font-bold block mb-2">Código</label>
          <input
            pInputText
            id="codigo"
            [(ngModel)]="especialidad.codigo"
            placeholder="Código de la especialidad"
          />
        </div>
        <div class="field col-12 md:col-6">
          <label for="programa" class="font-bold block mb-2">Programa</label>
          <p-dropdown
            inputId="programa"
            [options]="programas"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione un programa"
            [filter]="true"
            filterBy="label"
            [showClear]="true"
            [(ngModel)]="especialidad.programaId"
          ></p-dropdown>
        </div>
        <div class="field col-12">
          <label for="descripcion" class="font-bold block mb-2">Descripción</label>
          <input
            pInputText
            id="descripcion"
            [(ngModel)]="especialidad.descripcion"
            placeholder="Nombre de la especialidad"
          />
        </div>
        <div class="field-checkbox col-12 md:col-6 flex align-items-center">
          <p-checkbox
            inputId="activo"
            [(ngModel)]="especialidad.activo"
            binary="true"
            label="Activo"
          ></p-checkbox>
        </div>
      </div>
      <ng-template #footer>
        <p-button label="Guardar" (onClick)="save()" [disabled]="saving" />
      </ng-template>
    </p-dialog>
    <p-confirmDialog></p-confirmDialog>
  `
})
export class EspecialidadesComponent implements OnInit {
  especialidades: Especialidad[] = [];
  dialog = false;
  especialidad: Especialidad = new Especialidad();
  loading = false;
  saving = false;
  programas: { label: string; value: number; codigo: string; descripcion: string }[] = [];
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private especialidadService: EspecialidadService,
    private programaService: ProgramaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadProgramas();
    this.load();
  }

  load() {
    this.loading = true;
    this.especialidadService.list().subscribe({
      next: data => {
        this.especialidades = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las especialidades' });
      }
    });
  }

  loadProgramas() {
    this.programaService.list().subscribe({
      next: programas => {
        this.programas = programas
          .filter(p => p.activo)
          .map(p => ({
            value: p.id,
            label: `${p.programa} - ${p.descripcionPrograma}`,
            codigo: p.programa,
            descripcion: p.descripcionPrograma
          }));
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los programas' });
      }
    });
  }

  openNew() {
    this.especialidad = new Especialidad();
    this.saving = false;
    this.dialog = true;
  }

  edit(e: Especialidad) {
    this.especialidad = new Especialidad({ ...e });
    this.saving = false;
    this.dialog = true;
  }

  save() {
    const codigo = this.especialidad.codigo?.trim().toUpperCase();
    const descripcion = this.especialidad.descripcion?.trim();

    if (!codigo) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'El código de la especialidad es obligatorio' });
      return;
    }

    if (!this.especialidad.programaId) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Seleccione un programa' });
      return;
    }

    if (!descripcion) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'La descripción es obligatoria' });
      return;
    }

    this.especialidad.codigo = codigo;
    this.especialidad.descripcion = descripcion;
    this.especialidad.activo = this.especialidad.activo ?? true;

    this.saving = true;
    const request = this.especialidad.id
      ? this.especialidadService.update(this.especialidad.id, this.especialidad)
      : this.especialidadService.create(this.especialidad);

    request.subscribe({
      next: () => {
        this.load();
        this.dialog = false;
        this.saving = false;
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado' });
      },
      error: err => {
        this.saving = false;
        const detail = err?.error?.message ?? 'No se pudo guardar la especialidad';
        this.messageService.add({ severity: 'error', summary: 'Error', detail });
      }
    });
  }

  confirmDelete(e: Especialidad) {
    this.confirmationService.confirm({
      message: '¿Eliminar registro?',
      accept: () => this.delete(e)
    });
  }

  delete(e: Especialidad) {
    this.especialidadService.delete(e.id).subscribe({
      next: () => {
        this.load();
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Registro eliminado' });
      },
      error: err => {
        const detail = err?.error?.message ?? 'No se pudo eliminar la especialidad';
        this.messageService.add({ severity: 'error', summary: 'Error', detail });
      }
    });
  }

  hideDialog() {
    this.dialog = false;
    this.saving = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}
