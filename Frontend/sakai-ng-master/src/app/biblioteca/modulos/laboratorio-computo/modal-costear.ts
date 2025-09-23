import { Component, ElementRef, Output, EventEmitter ,OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
import { GenericoService } from '../../services/generico.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { ModalInvolucrado } from './modal-involucrado';
import { ModalMaterial } from './modal-material';
@Component({
    selector: 'app-modal-costear',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '50vw'}"  header="Agregar costo a material" [modal]="true" [closable]="true" styleClass="p-fluid">
     <ng-template pTemplate="content">
        <form [formGroup]="form">
        <div class="grid grid-cols-7 gap-4">
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-5">
                    <label for="material">Material</label>
                    <input pInputText id="material" type="text" formControlName="nombre"/>
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2">
                    <label for="codigo">Costo</label>
                    <input pInputText id="codigo" type="text" formControlName="costo" />
                    </div>

                </div>
                <p class="text-gray-500 mt-2">El costo del material que se est&aacute; registrando corresponde a una unidad</p>

        </form>

     </ng-template>
     <ng-template pTemplate="footer">
                <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                <button pButton pRipple type="button" icon="pi pi-check" (click)="onSave()"  [disabled]="form.invalid || loading" label="Guardar" class="p-button-success"></button>
            </ng-template>
  </p-dialog>

  <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>

            <app-modal-material #modalMaterial></app-modal-material>
<app-modal-involucrado #modalInvolucrado></app-modal-involucrado>

  `,
    imports: [TemplateModule,ModalMaterial,ModalInvolucrado],
    providers: [MessageService, ConfirmationService]
})
export class ModalCostear implements OnInit {
    loading: boolean = false;
    objeto: any = {};
    display: boolean = false;
    actualizar: boolean = false;
    form: FormGroup = new FormGroup({});
    materialNombre = '';
    @Output() saveCost = new EventEmitter<number>();

constructor(private confirmation: ConfirmationService,private fb: FormBuilder,private genericoService: GenericoService, private materialBibliograficoService: MaterialBibliograficoService, private messageService: MessageService) {
}
    ngOnInit() {
  this.form = this.fb.group({
    nombre : [{ value: null, disabled: true }],
    costo  : [null, [Validators.required, Validators.min(0)]]
  });
    }
  open(material: { nombre: string; costo?: number }) {
    this.form.patchValue({
      nombre: material.nombre,
      costo:  material.costo ?? null
    });
    this.display = true;
  }
        openEditarModal() {
            this.objeto={};
            this.display = true;
            this.actualizar=true;
        }

        closeModal() {
            this.display = false;
        }
        guardar(){
            this.confirmation.confirm({
                message: '¿Esta seguro de guardar el registro?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'SI',
                rejectLabel: 'NO',
                accept: () => {
                    this.loading = true;
                    //registrar nueva especiadad
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro satisfactorio.' });
                    this.loading = false;
                }
            });
        }
  onSave() {
    this.confirmation.confirm({
      message: '¿Estás seguro de guardar el costo?',
      accept: () => {
        const c = this.form.value.costo as number;
        this.saveCost.emit(c);
        this.messageService.add({ severity: 'success', detail: 'Costo registrado.' });
        this.display = false;
      }
    });
  }
        eliminarInvolucrado(objeto:any){}
    }
