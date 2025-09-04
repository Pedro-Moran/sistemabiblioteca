import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
import { GenericoService } from '../../services/generico.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
@Component({
    selector: 'app-modal-material',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '75%'}"  header="Buscar material" [modal]="true" [closable]="true" styleClass="p-fluid">
     <ng-template pTemplate="content">  
        <p-panel header="Buscar material">
            <div class="grid grid-cols-7 gap-4">
            <div class="flex flex-col gap-2 col-span-6 md:col-span-4">
                            <label for="alumno" class="block text-sm font-medium text-gray-700">Buscar</label>
                                        <input pInputText id="alumno" type="text"/>
                               
                            </div>
                            <div class="flex items-end">
                    <button 
                        pButton 
                        type="button" 
                        class="p-button-rounded p-button-danger" 
                        icon="pi pi-search"(click)="buscarMaterial()" [disabled]="loading"  pTooltip="Ver reporte" tooltipPosition="bottom">
                    </button>
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
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template #body let-objeto>
                    <tr>
                        <td>{{ objeto.codigo }}</td>
                        <td>{{ objeto.material }}</td>
                        <td>
                        <p-button icon="pi pi-plus" rounded outlined (click)="registrarMaterial(objeto)"pTooltip="Registrar" tooltipPosition="bottom"/>   
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
export class ModalMaterial implements OnInit {
    loading: boolean = false;
    objeto: any = {};
    display: boolean = false;
    form: FormGroup = new FormGroup({});
    materiales: any[] = [
        {"codigo":"0000","material":"MOUSE/GENIUS/LAZER","cantidad":"1"}
    ];
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
        buscarMaterial(){}
        
        registrarMaterial(objeto:any){}
    }
