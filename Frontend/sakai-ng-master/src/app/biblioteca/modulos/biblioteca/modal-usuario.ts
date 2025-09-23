import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
@Component({
    selector: 'app-modal-detalle-usuario',
    standalone: true,
    template: ` <p-dialog [(visible)]="display" [style]="{width: '50vw'}"  header="Datos de usuario" [modal]="true" [closable]="true" styleClass="p-fluid">
    <ng-template pTemplate="content">            
    <div class="p-4 grid md:grid-cols-3 lg:grid-cols-12 gap-4">
    <!-- Imagen del libro -->
    <div class="col-span-12 md:col-span-4 lg:col-span-6 xl:col-span-5 flex justify-center mx-8">
    <i class="pi pi-user" style="font-size: 8.5rem"></i>
        <!--<img src="https://biblioteca.upsjb.edu.pe/lan/Imagenes/Uploads/UPSJB_1_30112024_133774580434692598_469.jpg" 
             alt="Portada del libro" 
             class="w-full max-w-[300px] md:max-w-[350px] lg:max-w-[300px] h-auto object-cover rounded-lg shadow-lg">-->
    </div>

    <!-- Detalles del libro -->
    <div class="col-span-12 md:col-span-9 lg:col-span-6 xl:col-span-7 space-y-3">
        <div class="text-gray-700">
            <b class="font-semibold">Código:</b> 02543
            </div>
        <div class="text-gray-700">
            <span class="font-semibold">NOMBRES DEL ESTUDIANTE</span>
        </div><hr/>
        <div class="text-gray-700">
            <span class="font-semibold">TIPO DE USUARIO</span>
        </div><hr/>
        <div class="text-gray-700">
            <span class="font-semibold"></span>  'PRUEBAagmail.com'
        </div>

    </div>
</div>
    </ng-template>
  </p-dialog>
  `,
    imports: [TemplateModule],
    providers: [MessageService, ConfirmationService]
})
export class ModalDetalleUsuario implements OnInit {
    loading: boolean = false;
    objeto: any = {};
    display: boolean = false;

    async ngOnInit() {

    }
        openModal() {
            this.objeto={};
            this.display = true;
        }
    
        closeModal() {
            this.display = false;
        }
    }
