import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TemplateModule } from '../../../template.module';
import { MotivoAccion } from '../../../interfaces/motivo-accion';
import { MotivoAccionService } from '../../../services/motivo-accion.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-motivo-accion',
  standalone: true,
  imports: [TemplateModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toolbar styleClass="mb-6">
      <ng-template #start>
        <p-button label="Nuevo Motivo" icon="pi pi-plus" (onClick)="openNew()" />
      </ng-template>
    </p-toolbar>
    <p-table
      #dt1
      [value]="motivos"
      dataKey="id"
      [rows]="10"
      [paginator]="true"
      [rowsPerPageOptions]="[10, 25, 50]"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
      [rowHover]="true"
      styleClass="p-datatable-gridlines"
      [globalFilterFields]="['descripcion','estado']"
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
          <th pSortableColumn="estado" style="width:8rem">Activo<p-sortIcon field="estado"></p-sortIcon></th>
          <th style="width:8rem">Acciones</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-motivo>
        <tr>
          <td>{{ motivo.descripcion }}</td>
          <td>
            <p-tag [value]="motivo.estado ? 'Sí' : 'No'" [severity]="motivo.estado ? 'success' : 'danger'"></p-tag>
          </td>
          <td>
            <p-button icon="pi pi-pencil" rounded outlined class="mr-2" (onClick)="edit(motivo)"></p-button>
            <p-button icon="pi pi-trash" severity="danger" rounded outlined (onClick)="confirmDelete(motivo)"></p-button>
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

    <p-dialog [(visible)]="dialog" header="Motivo" [modal]="true" [style]="{width: '400px'}" (onHide)="hideDialog()">
      <div class="flex flex-col gap-3">
        <div>
          <label class="font-bold">Descripción</label>
          <input pInputText [(ngModel)]="motivo.descripcion" placeholder="Descripción del motivo" />
        </div>
        <div>
          <p-checkbox [(ngModel)]="motivo.estado" binary="true" label="Activo"></p-checkbox>
        </div>
      </div>
      <ng-template #footer>
        <p-button label="Guardar" (onClick)="save()" />
      </ng-template>
    </p-dialog>
    <p-confirmDialog></p-confirmDialog>
  `
})
export class MotivoAccionComponent implements OnInit {
  motivos: MotivoAccion[] = [];
  dialog = false;
  motivo: MotivoAccion = new MotivoAccion();
  loading = false;
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private motivoService: MotivoAccionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.motivoService.list().subscribe(data => {
      this.motivos = data;
      this.loading = false;
    });
  }

  openNew() {
    this.motivo = new MotivoAccion();
    this.dialog = true;
  }

  edit(m: MotivoAccion) {
    this.motivo = { ...m };
    this.dialog = true;
  }

  save() {
    const request = this.motivo.id
      ? this.motivoService.update(this.motivo.id, this.motivo)
      : this.motivoService.create(this.motivo);

    request.subscribe(() => {
      this.load();
      this.dialog = false;
      this.messageService.add({severity:'success', summary:'Éxito', detail:'Registro guardado'});
    });
  }

  confirmDelete(m: MotivoAccion) {
    this.confirmationService.confirm({
      message: '¿Eliminar registro?',
      accept: () => this.delete(m)
    });
  }

  delete(m: MotivoAccion) {
    this.motivoService.delete(m.id).subscribe(() => {
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
