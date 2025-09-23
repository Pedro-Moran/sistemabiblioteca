import { Component, ElementRef,EventEmitter, Output,  OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
import { GenericoService } from '../../services/generico.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
@Component({
    selector: 'app-modal-involucrado',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '75%'}"  header="Buscar involucrado" [modal]="true" [closable]="true" styleClass="p-fluid">
     <ng-template pTemplate="content">
     <p-panel header="Buscar involucrado">
    <div class="grid grid-cols-7 gap-4">
    <div class="flex flex-col gap-2 col-span-6 md:col-span-4">
                    <label for="alumno" class="block text-sm font-medium text-gray-700">Buscar</label>
                                <input pInputText [(ngModel)]="filtro" placeholder="Código o correo">

                    </div>
                    <div class="flex items-end">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-danger"
                icon="pi pi-search"(click)="buscar()" [disabled]="loading"  pTooltip="Ver reporte" tooltipPosition="bottom">
            </button>
        </div>
        </div>
        <div class="py-4">
        <p-table
    [value]="usuarios"
    showGridlines
    [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template #header>
            <tr>
                <th>Codigo</th>
                <th>Estudiante</th>
                <th>Tipo</th>
                <th></th>
            </tr>
        </ng-template>
        <ng-template #body let-objeto>
            <tr>
                <td>{{ objeto.login }}</td>
                <td>{{ objeto.email }}</td>
                <td>{{ objeto.tipo }}</td>
                <td>
                <p-button icon="pi pi-plus" rounded outlined (click)="seleccionar(objeto)"pTooltip="Registrar" tooltipPosition="bottom"/>
                </td>
            </tr>
        </ng-template>
</p-table>
    </div>

    </p-panel>
     </ng-template>
  </p-dialog>
  `,
    imports: [TemplateModule],
    providers: [MessageService, ConfirmationService]
})
export class ModalInvolucrado implements OnInit {
    loading: boolean = false;
    objeto: any = {};
    display: boolean = false;
    form: FormGroup = new FormGroup({});
    involucrados: any[] = [
        {"codigo":"0000","estudiante":"nombres","tipo":"UNIVERSIDAD"}
    ];
    @Output() select = new EventEmitter<{ codigoUsuario: string; tipoUsuario: number }>();
    filtro = '';
    usuarios: any[] = [];
constructor(private fb: FormBuilder,private genericoService: GenericoService, private materialBibliograficoService: MaterialBibliograficoService, private confirmationService: ConfirmationService, private messageService: MessageService) {
}
    async ngOnInit() {
    }
        openModal() {
            this.objeto={};
            this.display = true;
            this.buscar();
        }

        closeModal() {
            this.display = false;
        }

          buscar() {
            // asumimos que tu API acepta un parámetro opcional de búsqueda
            this.materialBibliograficoService
              .listarUsuarios(this.filtro)    // ej: GET /api/usuarios?search=...
              .subscribe(lst => this.usuarios = lst);
          }

        seleccionar(u: any) {
          this.select.emit({
              codigoUsuario: u.login,
              tipoUsuario:   u.tipo
             });
         this.display = false;
         }
        registrarInvolucrado(objeto:any){
        }
    }
