import { Component, OnInit } from '@angular/core';
import { TemplateModule } from '../../../template.module';
import { Especialidad } from '../../../interfaces/especialidad';
import { EspecialidadService } from '../../../services/especialidad.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [TemplateModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toolbar styleClass="mb-4">
      <ng-template #start>
        <p-button label="Nueva Especialidad" icon="pi pi-plus" (onClick)="openNew()" />
      </ng-template>
    </p-toolbar>
    <p-table [value]="especialidades" dataKey="id" [tableStyle]="{ 'min-width': '50rem' }">
      <ng-template #header>
        <tr>
          <th>Descripción</th>
          <th>Activo</th>
          <th style="width:8rem">Acciones</th>
        </tr>
      </ng-template>
      <ng-template #body let-esp>
        <tr>
          <td>{{ esp.descripcion }}</td>
          <td>
            <p-tag [value]="esp.activo ? 'Sí' : 'No'" [severity]="esp.activo ? 'success' : 'danger'"></p-tag>
          </td>
          <td>
            <p-button icon="pi pi-pencil" rounded outlined class="mr-2" (click)="edit(esp)"></p-button>
            <p-button icon="pi pi-trash" severity="danger" rounded outlined (click)="confirmDelete(esp)"></p-button>
          </td>
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
  `
})
export class EspecialidadesComponent implements OnInit {
  especialidades: Especialidad[] = [];
  dialog = false;
  especialidad: Especialidad = new Especialidad();

  constructor(
    private especialidadService: EspecialidadService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.especialidadService.list().subscribe(data => (this.especialidades = data));
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
}
