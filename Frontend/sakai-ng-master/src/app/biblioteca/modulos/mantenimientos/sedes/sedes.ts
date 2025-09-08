import { Component, OnInit } from '@angular/core';
import { TemplateModule } from '../../../template.module';
import { Sedes } from '../../../interfaces/sedes';
import { SedeService } from '../../../services/sede.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-sedes',
  standalone: true,
  imports: [TemplateModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toolbar styleClass="mb-4">
      <ng-template #start>
        <p-button label="Nueva Sede" icon="pi pi-plus" (onClick)="openNew()" />
      </ng-template>
    </p-toolbar>
    <p-table [value]="sedes" dataKey="id" [tableStyle]="{ 'min-width': '50rem' }">
      <ng-template #header>
        <tr>
          <th>Descripción</th>
          <th>Activo</th>
          <th style="width:8rem">Acciones</th>
        </tr>
      </ng-template>
      <ng-template #body let-sede>
        <tr>
          <td>{{ sede.descripcion }}</td>
          <td>
            <p-tag [value]="sede.activo ? 'Sí' : 'No'" [severity]="sede.activo ? 'success' : 'danger'"></p-tag>
          </td>
          <td>
            <p-button icon="pi pi-pencil" rounded outlined class="mr-2" (click)="editSede(sede)"></p-button>
            <p-button icon="pi pi-trash" severity="danger" rounded outlined (click)="confirmDelete(sede)"></p-button>
          </td>
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
  `
})
export class SedesComponent implements OnInit {
  sedes: Sedes[] = [];
  sedeDialog = false;
  sede: Sedes = new Sedes();

  constructor(
    private sedeService: SedeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.sedeService.list().subscribe(data => (this.sedes = data));
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
      this.load();
      this.messageService.add({severity:'success', summary:'Eliminado'});
    });
  }

  hideDialog() {
    this.sedeDialog = false;
  }
}
