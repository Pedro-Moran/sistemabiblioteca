import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TemplateModule } from '../../../template.module';
import { Sedes } from '../../../interfaces/sedes';
import { SedeService } from '../../../services/sede.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-sedes',
  standalone: true,
  imports: [TemplateModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toolbar styleClass="mb-6">
      <ng-template #start>
        <p-button label="Nueva Sede" icon="pi pi-plus" (onClick)="openNew()" />
      </ng-template>
    </p-toolbar>
    <p-table
      #dt1
      [value]="sedes"
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
      <ng-template pTemplate="body" let-sede>
        <tr>
          <td>{{ sede.descripcion }}</td>
          <td>
            <p-tag [value]="sede.activo ? 'Sí' : 'No'" [severity]="sede.activo ? 'success' : 'danger'"></p-tag>
          </td>
          <td>
            <p-button icon="pi pi-pencil" rounded outlined class="mr-2" (onClick)="editSede(sede)"></p-button>
            <p-button icon="pi pi-trash" severity="danger" rounded outlined (onClick)="confirmDelete(sede)"></p-button>
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

    <p-dialog [(visible)]="sedeDialog" header="Sede" [modal]="true" [style]="{width: '400px'}" (onHide)="hideDialog()">
      <div class="flex flex-col gap-3">
        <div>
          <label class="font-bold">Descripción</label>
          <input pInputText [(ngModel)]="sede.descripcion" placeholder="Nombre de la sede" />
        </div>
        <div>
          <p-checkbox [(ngModel)]="sede.activo" binary="true" label="Activo"></p-checkbox>
        </div>
      </div>
      <ng-template #footer>
        <p-button label="Guardar" (onClick)="save()" />
      </ng-template>
    </p-dialog>
    <p-confirmDialog></p-confirmDialog>
  `
})
export class SedesComponent implements OnInit {
  sedes: Sedes[] = [];
  sedeDialog = false;
  sede: Sedes = new Sedes();
  loading = false;
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private sedeService: SedeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.sedeService.list().subscribe(data => {
      this.sedes = data;
      this.loading = false;
    });
  }

  openNew() {
    this.sede = new Sedes();
    this.sedeDialog = true;
  }

  editSede(s: Sedes) {
    this.sede = { ...s };
    this.sedeDialog = true;
  }

  save() {
    const request = this.sede.id ?
      this.sedeService.update(this.sede.id, this.sede) :
      this.sedeService.create(this.sede);

    request.subscribe(() => {
      this.load();
      this.sedeDialog = false;
      this.messageService.add({severity:'success', summary:'Éxito', detail:'Registro guardado'});
    });
  }

  confirmDelete(s: Sedes) {
    this.confirmationService.confirm({
      message: '¿Eliminar registro?',
      accept: () => this.delete(s)
    });
  }

  delete(s: Sedes) {
    this.sedeService.delete(s.id).subscribe(() => {
      this.sedes = this.sedes.filter(item => item.id !== s.id);
      this.messageService.add({severity:'success', summary:'Eliminado'});
    });
  }

  hideDialog() {
    this.sedeDialog = false;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}
