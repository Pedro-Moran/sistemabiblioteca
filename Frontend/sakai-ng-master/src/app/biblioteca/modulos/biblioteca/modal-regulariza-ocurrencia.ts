import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
import { GenericoService } from '../../services/generico.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
@Component({
    selector: 'app-modal-regulariza-ocurrencia',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '75%'}"  header="Regulariza ocurrencia de ejemplar" [modal]="true" [closable]="true" styleClass="p-fluid" [contentStyle]="{overflow: 'visible'}">
     <ng-template pTemplate="content">
        <form [formGroup]="form">
        <div class="grid grid-cols-7 gap-4">
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-1 lg:col-span-1">
                    <label for="ocurrencia">Ocurrencia</label>
                    <input pInputText id="ocurrencia" type="text" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-2">
                    <label for="fechaOcurrencia">Fecha Ocurrencia</label>
                    <p-datepicker
      appendTo="body"
      [ngClass]="'w-full'"
      [style]="{ width: '100%' }"
      [readonlyInput]="true"
      dateFormat="dd/mm/yy">
</p-datepicker>
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-1 lg:col-span-2">
                    <label for="codigoAlumno">Cód alumno</label>
                    <input pInputText id="codigoAlumno" type="text" />
                    </div>
                    <div class="flex flex-col gap-2  col-span-7 sm:col-span-4 md:col-span-3 lg:col-span-2">
                    <label for="involucrado">Involucrado</label>
                    <input pInputText id="involucrado" type="text" />
                    </div>

                <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="codigoBibliografico">Cód bibliografico</label>
                    <input pInputText id="codigoBibliografico" type="text" />
                    </div>
                <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-2">
                    <label for="nroIngreso">Nro ingreso</label>
                    <input pInputText id="nroIngreso" type="text" />
                    </div>
                <div class="flex flex-col gap-2 col-span-7">
                    <label for="ejemplar">Ejemplar</label>
                    <textarea pTextarea id="ejemplar" rows="2" ></textarea>
                    </div>


                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-2">
                    <label for="autor">Autor</label>
                    <input pInputText id="autor" type="text" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-2">
                    <label for="editorial">Editorial</label>
                    <input pInputText id="editorial" type="text" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-3">
                    <label for="tipoEjemplar">Tipo ejemplar</label>
                    <input pInputText id="tipoEjemplar" type="text" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-2">
                    <label for="anioPublicacion">Año publicaci&oacute;n</label>
                    <input pInputText id="anioPublicacion" type="text" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 sm:col-span-4 md:col-span-2 lg:col-span-2">
                    <label for="sedeEjemplar">Sede ejemplar</label>
                    <input pInputText id="sedeEjemplar" type="text" />
                    </div>
                    </div>
                    <div class="grid grid-cols-7 gap-4 py-4">
                <div class="flex flex-col gap-2 col-span-7 sm:col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="codigoPrestamo">Cód prestamo</label>
                    <input pInputText id="codigoPrestamo" type="text" />
                    </div>
                <div class="flex flex-col gap-2 col-span-7 lg:col-span-5">
                    <label for="auditoriaPrestamo"><b>Auditoria préstamo</b></label>
                    <p>NOMBRES - 02 - 06/03/2025</p>
                    </div>
                <div class="flex flex-col gap-2 col-span-7">
                    <label for="descripcion">Descripcion</label>
                    <textarea pTextarea id="descripcion" rows="2" ></textarea>
                    </div>
                <div class="flex flex-col gap-2 col-span-7 lg:col-span-2">
                    <label for="costo">Ingrese Costo</label>
                    <input pInputText id="costo" type="text" />
                    </div>
                <div class="flex flex-col gap-2 col-span-7 lg:col-span-5">
                    <label for="auditoriaOcurrencia"><b>Auditoria ocurrencia</b></label>
                    <p>NOMBRES - 02 - 06/03/2025</p>
                    </div>


                </div>

        </form>
     </ng-template>
     <ng-template pTemplate="footer">
                    <button pButton pRipple type="button" icon="pi pi-times" (click)="closeModal()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
                    <button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()" [disabled]="form.invalid || loading" label="Guardar" class="p-button-success"></button>
                </ng-template>
  </p-dialog>
  <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
  <p-toast></p-toast>
  `,
    styles: [`:host ::ng-deep label{white-space:normal !important;overflow:visible !important;text-overflow:initial !important;}`],
    imports: [TemplateModule],
    providers: [MessageService, ConfirmationService]
})
export class ModalRegularizaOcurencia implements OnInit {
    loading: boolean = false;
    objeto: any = {};
    display: boolean = false;
    form: FormGroup = new FormGroup({});
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
                message: 'El costo será agregado y se cargará a la cuenta del usuario.',
                header: 'Confirmar',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'SI',
                rejectLabel: 'NO',
                accept: () => {
                    this.loading = true;
                    //registrar nueva especiadad
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro satisfactorio.' });

                }
            });
        }
    }
