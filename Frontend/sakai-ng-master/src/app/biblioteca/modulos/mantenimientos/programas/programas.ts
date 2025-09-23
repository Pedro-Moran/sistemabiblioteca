import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TemplateModule } from '../../../template.module';
import { Programa } from '../../../interfaces/programa';
import { ProgramaService } from '../../../services/programa.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-programas',
  standalone: true,
  imports: [TemplateModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-toolbar styleClass="mb-6">
      <ng-template #start>
        <p-button label="Nuevo Programa" icon="pi pi-plus" (onClick)="openNew()" />
      </ng-template>
    </p-toolbar>
    <p-table
      #dt1
      [value]="programas"
      dataKey="id"
      [rows]="10"
      [paginator]="true"
      [rowsPerPageOptions]="[10, 25, 50]"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
      [rowHover]="true"
      styleClass="p-datatable-gridlines"
      [globalFilterFields]="['programa','descripcionPrograma','activo']"
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
          <th pSortableColumn="programa">Código<p-sortIcon field="programa"></p-sortIcon></th>
          <th pSortableColumn="descripcionPrograma">Descripción<p-sortIcon field="descripcionPrograma"></p-sortIcon></th>
          <th pSortableColumn="activo" style="width:8rem">Activo<p-sortIcon field="activo"></p-sortIcon></th>
          <th style="width:8rem">Acciones</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-programa>
        <tr>
          <td>{{ programa.programa }}</td>
          <td>{{ programa.descripcionPrograma }}</td>
          <td>
            <p-tag [value]="programa.activo ? 'Sí' : 'No'" [severity]="programa.activo ? 'success' : 'danger'"></p-tag>
          </td>
          <td>
            <p-button icon="pi pi-pencil" rounded outlined class="mr-2" (onClick)="edit(programa)"></p-button>
            <p-button icon="pi pi-trash" severity="danger" rounded outlined (onClick)="confirmDelete(programa)"></p-button>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="4">No se encontraron registros.</td>
        </tr>
      </ng-template>
      <ng-template pTemplate="loadingbody">
        <tr>
          <td colspan="4">Cargando datos. Espere por favor.</td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="dialog" header="Programa" [modal]="true" [style]="{width: '400px'}" (onHide)="hideDialog()">
      <div class="flex flex-col gap-3">
        <div>
          <label class="font-bold">Código</label>
          <input pInputText [(ngModel)]="programa.programa" placeholder="Código del programa" />
        </div>
        <div>
          <label class="font-bold">Descripción</label>
          <input pInputText [(ngModel)]="programa.descripcionPrograma" placeholder="Nombre del programa" />
        </div>
        <div>
          <p-checkbox [(ngModel)]="programa.activo" binary="true" label="Activo"></p-checkbox>
        </div>
      </div>
      <ng-template #footer>
        <p-button label="Guardar" (onClick)="save()" />
      </ng-template>
    </p-dialog>
    <p-confirmDialog></p-confirmDialog>
  `
})
export class ProgramasComponent implements OnInit {
  programas: Programa[] = [];
  dialog = false;
  programa: Programa = new Programa({ activo: true });
  loading = false;
  @ViewChild('filter') filter!: ElementRef;

  constructor(
    private programaService: ProgramaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this.programaService.list().subscribe({
      next: data => {
        this.programas = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.programas = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los programas' });
      }
    });
  }

  openNew() {
    this.programa = new Programa({ activo: true });
    this.dialog = true;
  }

  edit(p: Programa) {
    this.programa = new Programa(p);
    this.dialog = true;
  }

  save() {
    const request = this.programa.id
      ? this.programaService.update(this.programa.id, this.programa)
      : this.programaService.create(this.programa);

    request.subscribe({
      next: () => {
        this.load();
        this.dialog = false;
        this.programa = new Programa({ activo: true });
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado' });
      },
      error: err => {
        const detail = err?.error?.message ?? 'No se pudo guardar el programa';
        this.messageService.add({ severity: 'error', summary: 'Error', detail });
      }
    });
  }

  confirmDelete(p: Programa) {
    this.confirmationService.confirm({
      message: '¿Eliminar registro?',
      accept: () => this.delete(p)
    });
  }

  delete(p: Programa) {
    this.programaService.delete(p.id).subscribe({
      next: () => {
        this.load();
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Registro eliminado' });
      },
      error: err => {
        const detail = err?.error?.message ?? 'No se pudo eliminar el programa';
        this.messageService.add({ severity: 'error', summary: 'Error', detail });
      }
    });
  }

  hideDialog() {
    this.dialog = false;
    this.programa = new Programa({ activo: true });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}
