import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TemplateModule } from '../../../template.module';
import { Especialidad } from '../../../interfaces/especialidad';
import { EspecialidadService } from '../../../services/especialidad.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [TemplateModule],
  providers: [MessageService, ConfirmationService],
  template: `
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
      [globalFilterFields]="['descripcion','activo']"
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
          <th pSortableColumn="descripcion">Descripción<p-sortIcon field="descripcion"></p-sortIcon></th>
          <th pSortableColumn="activo" style="width:8rem">Activo<p-sortIcon field="activo"></p-sortIcon></th>
          <th style="width:8rem">Acciones</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-esp>
        <tr>
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
          <td colspan="3">No se encontraron registros.</td>
        </tr>
      </ng-template>
      <ng-template pTemplate="loadingbody">
        <tr>
          <td colspan="3">Cargando datos. Espere por favor.</td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="dialog" header="Especialidad" [modal]="true" [style]="{width: '400px'}" (onHide)="hideDialog()">
      <div class="flex flex-col gap-3">
        <div>
          <label class="font-bold">Descripción</label>
          <input pInputText [(ngModel)]="especialidad.descripcion" placeholder="Nombre de la especialidad" />
        </div>
        <div>
          <p-checkbox [(ngModel)]="especialidad.activo" binary="true" label="Activo"></p-checkbox>
        </div>
      </div>
      <ng-template #footer>
        <p-button label="Guardar" (onClick)="save()" />
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
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private especialidadService: EspecialidadService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.especialidadService.list().subscribe(data => {
      this.especialidades = data;
      this.loading = false;
    });
  }

  openNew() {
    this.especialidad = new Especialidad();
    this.dialog = true;
  }

  edit(e: Especialidad) {
    this.especialidad = { ...e };
    this.dialog = true;
  }

  save() {
    const request = this.especialidad.id ?
      this.especialidadService.update(this.especialidad.id, this.especialidad) :
      this.especialidadService.create(this.especialidad);

    request.subscribe(() => {
      this.load();
      this.dialog = false;
      this.messageService.add({severity:'success', summary:'Éxito', detail:'Registro guardado'});
    });
  }

  confirmDelete(e: Especialidad) {
    this.confirmationService.confirm({
      message: '¿Eliminar registro?',
      accept: () => this.delete(e)
    });
  }

  delete(e: Especialidad) {
    this.especialidadService.delete(e.id).subscribe(() => {
      this.load();
      this.messageService.add({severity:'success', summary:'Eliminado'});
    });
  }

  hideDialog() {
    this.dialog = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}
