import { Component, OnInit } from '@angular/core';
import { TemplateModule } from '../../../template.module';
import { Programa } from '../../../interfaces/programa';
import { ProgramaService } from '../../../services/programa.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-programas',
  standalone: true,
  imports: [TemplateModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toolbar styleClass="mb-4">
      <ng-template #start>
        <p-button label="Nuevo Programa" icon="pi pi-plus" (onClick)="openNew()" />
      </ng-template>
    </p-toolbar>
    <p-table [value]="programas" dataKey="id" [tableStyle]="{ 'min-width': '50rem' }">
      <ng-template #header>
        <tr>
          <th>Descripción</th>
          <th>Activo</th>
          <th style="width:8rem">Acciones</th>
        </tr>
      </ng-template>
      <ng-template #body let-programa>
        <tr>
          <td>{{ programa.descripcion }}</td>
          <td>
            <p-tag [value]="programa.activo ? 'Sí' : 'No'" [severity]="programa.activo ? 'success' : 'danger'"></p-tag>
          </td>
          <td>
            <p-button icon="pi pi-pencil" rounded outlined class="mr-2" (click)="edit(programa)"></p-button>
            <p-button icon="pi pi-trash" severity="danger" rounded outlined (click)="confirmDelete(programa)"></p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="dialog" header="Programa" [modal]="true" [style]="{width: '400px'}" (onHide)="hideDialog()">
      <div class="flex flex-col gap-3">
        <div>
          <label class="font-bold">Descripción</label>
          <input pInputText [(ngModel)]="programa.descripcion" placeholder="Nombre del programa" />
        </div>
        <div>
          <p-checkbox [(ngModel)]="programa.activo" binary="true" label="Activo"></p-checkbox>
        </div>
      </div>
      <ng-template #footer>
        <p-button label="Guardar" (onClick)="save()" />
      </ng-template>
    </p-dialog>
  `
})
export class ProgramasComponent implements OnInit {
  programas: Programa[] = [];
  dialog = false;
  programa: Programa = new Programa();

  constructor(
    private programaService: ProgramaService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.programaService.list().subscribe(data => (this.programas = data));
  }

  openNew() {
    this.programa = new Programa();
    this.dialog = true;
  }

  edit(p: Programa) {
    this.programa = { ...p };
    this.dialog = true;
  }

  save() {
    const request = this.programa.id ?
      this.programaService.update(this.programa.id, this.programa) :
      this.programaService.create(this.programa);

    request.subscribe(() => {
      this.load();
      this.dialog = false;
      this.messageService.add({severity:'success', summary:'Éxito', detail:'Registro guardado'});
    });
  }

  confirmDelete(p: Programa) {
    this.confirmationService.confirm({
      message: '¿Eliminar registro?',
      accept: () => this.delete(p)
    });
  }

  delete(p: Programa) {
    this.programaService.delete(p.id).subscribe(() => {
      this.load();
      this.messageService.add({severity:'success', summary:'Eliminado'});
    });
  }

  hideDialog() {
    this.dialog = false;
  }
}
