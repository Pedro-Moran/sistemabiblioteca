import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
import { GenericoService } from '../../services/generico.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { ModalInvolucrado } from './modal-involucrado';
import { ModalMaterial } from './modal-material';
@Component({
    selector: 'app-modal-nuevo-ocurrencia',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '75%'}"  header="Mantenimiento de materiales en deuda" [modal]="true" [closable]="true" styleClass="p-fluid" [contentStyle]="{overflow: 'visible'}">
     <ng-template pTemplate="content">
        <form [formGroup]="form">
        <div class="grid grid-cols-7 gap-4">
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-3 lg:col-span-3">
                    <label for="codigo">Código</label>
                    <input pInputText id="codigo" type="text" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-4 lg:col-span-4">
                    <label for="fecha">Fecha</label>
                    <p-datepicker
      appendTo="body"
      [ngClass]="'w-full'"
      [style]="{ width: '100%' }"
      [readonlyInput]="true"
      dateFormat="dd/mm/yy">
</p-datepicker>
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-3 lg:col-span-3">
                    <label for="semestre">Semestre</label>
                    <p-select appendTo="body" [options]="semestreLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-4 lg:col-span-4">
                    <label for="sede">Local/Filial</label>
                    <p-select appendTo="body" [options]="sedeLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="ambiente">Ambiente</label>
                    <p-select appendTo="body" [options]="ambienteLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-3 lg:col-span-2">
                    <label for="especialidad">Especialidad</label>
                    <p-select appendTo="body" [options]="especialidadLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-2 lg:col-span-3">
                    <label for="programa">Programa</label>
                    <p-select appendTo="body" [options]="programaLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-2">
                    <label for="ciclo">Ciclo</label>
                    <p-select appendTo="body" [options]="cicloLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-3 lg:col-span-2">
                    <label for="docente">Docente</label>
                    <p-select appendTo="body" [options]="docenteLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-3">
                    <label for="curso">Curso</label>
                    <p-select appendTo="body" [options]="cursoLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="turno">Turno</label>
                    <p-select appendTo="body" [options]="turnoLista" optionLabel="descripcion" placeholder="Seleccionar" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-5 lg:col-span-5">
                    <label for="personal">Personal</label>
                    <input pInputText id="personal" type="text" />

                    </div>
                    <div class="flex flex-col gap-2 col-span-7">
                    <label for="auditoria">Auditoria</label>
                    <textarea pTextarea id="auditoria" rows="4" ></textarea>

                    </div>


                </div>
<div class="grid grid-cols-7 gap-4 mt-4 flex justify-end">
    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()"
        [disabled]="loading || guardado" label="Cancelar" class="p-button-outlined p-button-danger"></button>
    <button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()"
        [disabled]="form.invalid || loading || guardado" label="Guardar" class="p-button-success"></button>
</div>
@if(guardado){

                <div class="grid grid-cols-7 gap-4 items-center py-4">
    <span class="col-span-4 font-bold">ESTUDIANTES INVOLUCRADOS</span>
    <div class="col-span-3 flex justify-end">
        <button pButton type="button" label="Agregar" icon="pi pi-plus" class="p-button-success"
            [disabled]="loading" (click)="agregarInvolucrados()"
            pTooltip="Agregar" tooltipPosition="bottom"></button>
    </div>
</div>
<div class="py-4">
        <p-table
    [value]="involucrados"
    showGridlines
    [tableStyle]="{ 'min-width': '50rem' }">
        <ng-template #header>
            <tr>
                <th>Codigo</th>
                <th>Estudiante</th>
                <th></th>
            </tr>
        </ng-template>
        <ng-template #body let-objeto>
            <tr>
                <td>{{ objeto.codigo }}</td>
                <td>{{ objeto.estudiante }}</td>
                <td>
                <p-button icon="pi pi-trash" rounded outlined (click)="eliminarInvolucrado(objeto)"pTooltip="Eliminar" tooltipPosition="bottom"/>
                </td>
            </tr>
        </ng-template>
</p-table>
    </div>
<div class="grid grid-cols-7 gap-4 items-center py-4">
    <span class="col-span-4 font-bold">MATERIALES INVOLUCRADOS</span>
    <div class="col-span-3 flex justify-end">
        <button pButton type="button" label="Agregar" icon="pi pi-plus" class="p-button-success"
            [disabled]="loading" (click)="agregarMaterial()"
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
        <ng-template #body let-objeto>
            <tr>
                <td>{{ objeto.codigo }}</td>
                <td>{{ objeto.material }}</td>
                <td>{{ objeto.cantidad }}</td>
                <td>
                <p-button icon="pi pi-trash" rounded outlined (click)="eliminarInvolucrado(objeto)"pTooltip="Eliminar" tooltipPosition="bottom"/>
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


<app-modal-material #modalMaterial></app-modal-material>
<app-modal-involucrado #modalInvolucrado></app-modal-involucrado>
  `,
    imports: [TemplateModule,ModalMaterial,ModalInvolucrado],
    providers: [MessageService, ConfirmationService],
    styles: [`:host ::ng-deep label{white-space:normal !important;overflow:visible !important;text-overflow:initial !important;}`]
})
export class ModalNuevoOcurencia implements OnInit {
    loading: boolean = false;
    objeto: any = {};
    display: boolean = false;
    form: FormGroup = new FormGroup({});
    sedeLista: ClaseGeneral[] = [];
    semestreLista: ClaseGeneral[] = [];
    ambienteLista: ClaseGeneral[] = [];
    especialidadLista: ClaseGeneral[] = [];
    programaLista: ClaseGeneral[] = [];
    cicloLista: ClaseGeneral[] = [];
    docenteLista: ClaseGeneral[] = [];
    cursoLista: ClaseGeneral[] = [];
    turnoLista: ClaseGeneral[] = [];
    involucrados: any[] = [
        {"codigo":"0000","estudiante":"nombres","tipo":"UNIVERSIDAD"}
    ];
    materiales: any[] = [
        {"codigo":"0000","material":"MOUSE/GENIUS/LAZER","cantidad":"1"}
    ];
    guardado:boolean=false;
    nuevoInvolucrado:boolean=false;
    nuevoMaterial:boolean=false;
    @ViewChild('modalMaterial') modalMaterial!: ModalMaterial;
    @ViewChild('modalInvolucrado') modalInvolucrado!: ModalInvolucrado;

constructor(private fb: FormBuilder,private genericoService: GenericoService, private materialBibliograficoService: MaterialBibliograficoService, private confirmationService: ConfirmationService, private messageService: MessageService) {
}
    async ngOnInit() {
    }
        openModal() {
            this.objeto={};
            this.display = true;
        }

        closeModal() {
            this.display = false;
        }
        guardar(){
            this.confirmationService.confirm({
                message: '¿Esta seguro de guardar el registro?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'SI',
                rejectLabel: 'NO',
                accept: () => {
                    this.loading = true;
                    this.guardado=true;
                    //registrar nueva especiadad
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro satisfactorio.' });
                    this.loading = false;
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
    }
