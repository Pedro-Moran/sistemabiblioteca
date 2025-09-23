import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
import { InputValidation } from '../../input-validation';
import { GenericoService } from '../../services/generico.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { generarConstanciaNoAdeudo, generarConstanciaPendientes } from './constancia-pdf';
@Component({
    selector: 'app-modal-impresion',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '75%'}"  header="Imprimir" [modal]="true" [closable]="true" styleClass="p-fluid">
     <ng-template pTemplate="content">
        <form [formGroup]="form">
        <div class="grid grid-cols-7 gap-4">

                <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-2">
                    <label for="tipoConstancia">Tipo constancia</label>
                    <p-select appendTo="body" formControlName="tipoConstancia" [options]="tipoconstanciaLista" optionLabel="descripcion" optionValue="id" placeholder="Seleccionar" />
                    <app-input-validation [form]="form" modelo="tipoConstancia" ver="Tipo constancia"></app-input-validation>
                </div>
                <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-3 lg:col-span-2" *ngIf="form.get('tipoConstancia')?.value === 2">
                    <label for="sedeSolicitud">Nro solicitud</label>
                    <div class="flex gap-2">
                        <input pInputText id="sedeSolicitud" formControlName="sede" type="text" maxlength="2" class="w-3rem" />
                        <input pInputText id="correlativoSolicitud" formControlName="correlativo" type="text" maxlength="8" class="flex-auto" />
                </div>
                    <div class="flex gap-2">
                        <app-input-validation [form]="form" modelo="sede" ver="Sede"></app-input-validation>
                        <app-input-validation [form]="form" modelo="correlativo" ver="Correlativo"></app-input-validation>
                    </div>
                </div>
                <div class="flex flex-col gap-2 col-span-7">
                    <label for="descripcion">Descripcion</label>
                    <textarea pTextarea id="descripcion" formControlName="descripcion" rows="8"></textarea>
                    <app-input-validation [form]="form" modelo="descripcion" ver="Descripción"></app-input-validation>
                </div>

                </div>

        </form>
     </ng-template>
     <ng-template pTemplate="footer">
                    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                    <button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()" [disabled]="form.invalid || loading" label="Aceptar" class="p-button-success"></button>
                </ng-template>
  </p-dialog>
  <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
  <p-toast></p-toast>
  `,
    imports: [TemplateModule, InputValidation],
    providers: [MessageService, ConfirmationService]
})
export class ModalImpresion implements OnInit {
    loading: boolean = false;
    objeto: any = {};
    display: boolean = false;
    form: FormGroup = new FormGroup({});
    tipoconstanciaLista: ClaseGeneral[] = [];
constructor(private fb: FormBuilder,
            private genericoService: GenericoService,
            private materialBibliograficoService: MaterialBibliograficoService,
            private confirmationService: ConfirmationService,
            private messageService: MessageService) {
}
    async ngOnInit() {
        this.tipoconstanciaLista = [
            { id: 1, descripcion: 'Error u omisión', activo: true, estado: 1 },
            { id: 2, descripcion: 'Solicitud', activo: true, estado: 1 },
            { id: 3, descripcion: 'Disposición administrativa', activo: true, estado: 1 }
        ];

        this.form = this.fb.group({
            tipoConstancia: [null, Validators.required],
            sede: [''],
            correlativo: [''],
            descripcion: ['', Validators.required]
        });

        this.form.get('tipoConstancia')?.valueChanges.subscribe(tipo => {
            const sedeCtrl = this.form.get('sede');
            const corrCtrl = this.form.get('correlativo');
            if (tipo === 2) {
                sedeCtrl?.setValidators([Validators.required, Validators.pattern('^[0-9]{2}$')]);
                corrCtrl?.setValidators([Validators.required, Validators.pattern('^[0-9]{8}$')]);
            } else {
                sedeCtrl?.clearValidators();
                corrCtrl?.clearValidators();
                sedeCtrl?.setValue('');
                corrCtrl?.setValue('');
            }
            sedeCtrl?.updateValueAndValidity();
            corrCtrl?.updateValueAndValidity();
        });
    }
        openModal(obj?: any) {
            this.objeto = obj || {};
            this.form.reset();
            this.display = true;
        }

        closeModal() {
            this.display = false;
        }
        guardar(){
            this.confirmationService.confirm({
                message: '¿Esta seguro de imprimir constancia?',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'SI',
                rejectLabel: 'NO',
                accept: () => {
                    this.loading = true;
                    const payload = {
                        codigo: this.objeto.codigo,
                        estudiante: this.objeto.estudiante,
                        tipoConstancia: this.form.value.tipoConstancia,
                        sede: this.form.value.sede,
                        correlativo: this.form.value.correlativo,
                        descripcion: this.form.value.descripcion
                    };
                    if (this.objeto.pendiente) {
                        generarConstanciaPendientes({
                            codigo: this.objeto.codigo,
                            estudiante: this.objeto.estudiante,
                            especialidad: this.objeto.especialidad,
                            detallesLaboratorio: this.objeto.laboratorios,
                            detallesBiblioteca: this.objeto.biblioteca
                        });
                    } else {
                        generarConstanciaNoAdeudo(payload);
                    }
                    this.loading = false;
                    this.display = false;
                }
            });
        }
    }
