import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from '../../../pages/landing/components/topbarwidget.component';
import { PortalTopbar } from '../portal-landing/components/portal-topbar';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService, ConfirmationService, ToastMessageOptions } from 'primeng/api';
import { Registro } from '../interfaces/registro';
import { FormsModule } from '@angular/forms';
import { InputValidation } from '../../input-validation';
import { TemplateModule } from '../../template.module';
import { AuthService } from '../../../biblioteca/services/auth.service';
import { DocumentoService } from '../../../biblioteca/services/documento.service';

@Component({
    selector: 'app-registrate',
    standalone: true,
    imports: [
        RouterModule,
        RippleModule,
        StyleClassModule,
        ButtonModule,
        DividerModule,
        PortalTopbar,
        AppFloatingConfigurator,
        InputValidation,
        TemplateModule,
        FormsModule],
    styles: [`
        .disabled-input {
            background-color: #e9ecef;
            cursor: not-allowed;
        }
    `],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
            <portal-topbar class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
            <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                        <div class="text-center">
                            <img src="assets/logo.png" alt="Logo" class="mb-8 w-100 shrink-0 mx-auto" />
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Biblioteca</div>
                            <span class="text-muted-color font-medium">Registrate</span>
                        </div>
                        <div *ngIf="!registrado">

                        <form [formGroup]="form" class="grid grid-cols-1 md:grid-cols-5 gap-4">

                        <div class="flex flex-col gap-2">
                            <label for="tipoDocumento" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Tipo documento</label>
                            <p-dropdown id="tipoDocumento" [options]="tiposDocumento" optionLabel="label" optionValue="code" formControlName="tipoDocumento" placeholder="Seleccione"></p-dropdown>
                            <app-input-validation [form]="form" modelo="tipoDocumento" ver="Tipo documento"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="numDocumento" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Número documento</label>
                            <input pInputText id="numDocumento" type="text" placeholder="Número" formControlName="numDocumento" (blur)="consultarDocumento()" />
                            <app-input-validation [form]="form" modelo="numDocumento" ver="Número documento"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="nombres" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Nombres</label>
                            <input pInputText id="nombreUsuario" type="text" placeholder="Nombre" formControlName="nombreUsuario" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            <app-input-validation [form]="form" modelo="nombreUsuario" ver="nombreUsuario"></app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="apellidoMaterno" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Apellido Materno</label>
                            <input pInputText id="apellidoMaterno" type="text" placeholder="Apellido Materno" formControlName="apellidoMaterno" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            <app-input-validation [form]="form" modelo="apellidoMaterno" ver="Apellido Materno"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="apellidoPaterno" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Apellido Paterno</label>
                            <input pInputText id="apellidoPaterno" type="text" placeholder="Apellidos" formControlName="apellidoPaterno" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            <app-input-validation [form]="form" modelo="apellidoPaterno" ver="Apellido Paterno"></app-input-validation>
                        </div>

                            <div class="flex flex-col gap-2">
                                <label for="email" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Email</label>
                                <input pInputText id="email" type="text" placeholder="Email" formControlName="email" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                                <app-input-validation [form]="form" modelo="email" ver="Email"></app-input-validation>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="address" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Dirección</label>
                                <input pInputText id="address" type="text" placeholder="Dirección" formControlName="ADDRESS" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="phone" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Teléfono</label>
                                <input pInputText id="phone" type="text" placeholder="Teléfono" formControlName="PHONE" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="cell" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Celular</label>
                                <input pInputText id="cell" type="text" placeholder="Celular" formControlName="CELL" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="program" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Programa</label>
                                <input pInputText id="program" type="text" placeholder="Programa" formControlName="PROGRAM" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="campus" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Campus</label>
                                <input pInputText id="campus" type="text" placeholder="Campus" formControlName="CAMPUS" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="country" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">País</label>
                                <input pInputText id="country" type="text" placeholder="País" formControlName="COUNTRY" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="state" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Estado</label>
                                <input pInputText id="state" type="text" placeholder="Estado" formControlName="STATE" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="city" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Ciudad</label>
                                <input pInputText id="city" type="text" placeholder="Ciudad" formControlName="CITY" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="county" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Provincia</label>
                                <input pInputText id="county" type="text" placeholder="Provincia" formControlName="COUNTY" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="age" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Edad</label>
                                <input pInputText id="age" type="text" placeholder="Edad" formControlName="AGE" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="sex" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Sexo</label>
                                <input pInputText id="sex" type="text" placeholder="Sexo" formControlName="SEX" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="emailInst" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Email Inst.</label>
                                <input pInputText id="emailInst" type="text" placeholder="Email Institucional" formControlName="EMAIL_INST" [readonly]="fieldsDisabled" [ngClass]="{'disabled-input': fieldsDisabled}" />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="rol" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Perfil</label>
                                <p-dropdown id="rol" [options]="roles" optionLabel="descripcion" optionValue="idRol" formControlName="rol" placeholder="Seleccione"></p-dropdown>
                                <app-input-validation [form]="form" modelo="rol" ver="Perfil"></app-input-validation>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2 mt-4">Contraseña</label>
                                <input pInputText id="password" type="password" placeholder="Contraseña" formControlName="password" />
                                <app-input-validation [form]="form" modelo="password" ver="Contraseña"></app-input-validation>
                            </div>



                            <div class="flex items-center justify-between">
                            </div>

                            <p-button label="Continuar" styleClass="w-full" (click)="registrar()" [disabled]="form.invalid"></p-button>
                        </form>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>

<p-toast></p-toast>
<p-confirmdialog [style]="{ width: '450px' }" />
    `,
     providers: [MessageService,ConfirmationService]
})
export class PortalRegistrate implements OnInit {
    registrado:boolean=false;
    msgs: ToastMessageOptions[] | null = [];
    objeto!: Registro;
    form!: FormGroup;
    fieldsDisabled = true;
    tiposDocumento = [
        { code: '01', label: 'DNI' },
        { code: '04', label: 'Carnet de ext.' },
        { code: '07', label: 'Pasaporte' },
        { code: '06', label: 'RUC' },
        { code: '00', label: 'Otros' }
    ];
    roles: { idRol: number; descripcion: string }[] = [];
    constructor(private router: Router,
                private fb: FormBuilder,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private authService: AuthService,
                private documentoService: DocumentoService) {
        this.form = this.fb.group({
            tipoDocumento: ['', Validators.required],
            numDocumento: ['', Validators.required],
            id: [0, [Validators.required]],
            nombreUsuario: [ '', [Validators.required, Validators.maxLength(100), Validators.minLength(3),Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],
            apellidoMaterno: [ '', [Validators.required, Validators.maxLength(100), Validators.minLength(3),Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],
            apellidoPaterno: [ '', [Validators.required, Validators.maxLength(100), Validators.minLength(3),Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],

            email: [ '', [Validators.required, Validators.maxLength(100), Validators.minLength(3),Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-@\\s]+$')]],
            rol: [null, Validators.required],
            password: ['' , [Validators.maxLength(150),Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ,.;-\\s\\-()]+$')]]
        });
    }

    ngOnInit() {
        this.limpiarObjeto();
        this.formValidar();
        this.authService.getPublicRoles().subscribe({
            next: roles => this.roles = roles,
            error: () => this.roles = []
        });
    }
    limpiarObjeto() {
        this.fieldsDisabled = true;
        this.objeto = {
            tipoDocumento: '',
            numDocumento: '',
            id: 0,
            nombreUsuario: '',
            apellidoMaterno: '',
            apellidoPaterno: '',
            email: '',
            password: '',
            ADDRESS: '',
            AGE: 0,
            CAMPUS: '',
            CELL: '',
            CITY: '',
            COUNTRY: '',
            COUNTY: '',
            EMAIL_INST: '',
            EMPLID: '',
            FEC_NAC: '',
            NAME: '',
            NATIONAL_ID: '',
            NATIONAL_ID_TYPE: '',
            PHONE: '',
            PROGRAM: '',
            SEX: '',
            STATE: '',
            rol: 0
        }
    }

    formValidar() {
        let dataObjeto = {
            tipoDocumento: this.objeto.tipoDocumento,
            numDocumento: this.objeto.numDocumento,
            id: this.objeto.id,
            nombreUsuario: this.objeto.nombreUsuario,
            apellidoMaterno: this.objeto.apellidoMaterno,
            apellidoPaterno: this.objeto.apellidoPaterno,
            email: this.objeto.email,
            password: this.objeto.password,
            ADDRESS: this.objeto.ADDRESS,
            AGE: this.objeto.AGE,
            CAMPUS: this.objeto.CAMPUS,
            CELL: this.objeto.CELL,
            CITY: this.objeto.CITY,
            COUNTRY: this.objeto.COUNTRY,
            COUNTY: this.objeto.COUNTY,
            EMAIL_INST: this.objeto.EMAIL_INST,
            EMPLID: this.objeto.EMPLID,
            FEC_NAC: this.objeto.FEC_NAC,
            NAME: this.objeto.NAME,
            NATIONAL_ID: this.objeto.NATIONAL_ID,
            NATIONAL_ID_TYPE: this.objeto.NATIONAL_ID_TYPE,
            PHONE: this.objeto.PHONE,
            PROGRAM: this.objeto.PROGRAM,
            SEX: this.objeto.SEX,
            STATE: this.objeto.STATE,
            rol: this.objeto.rol
        };
        this.form = this.fb.group({
            tipoDocumento: [dataObjeto.tipoDocumento, [Validators.required]],
            numDocumento: [dataObjeto.numDocumento, [Validators.required]],
            id: [dataObjeto.id, [Validators.required]],
            nombreUsuario: [dataObjeto.nombreUsuario, [Validators.required, Validators.maxLength(100), Validators.minLength(3),Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],
            apellidoMaterno: [ dataObjeto.apellidoMaterno , [Validators.required, Validators.maxLength(80), Validators.minLength(3),Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],
            apellidoPaterno: [ dataObjeto.apellidoMaterno , [Validators.required, Validators.maxLength(80), Validators.minLength(3),Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.;-\\s]+$')]],
            email: [ dataObjeto.email , [Validators.maxLength(150),Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ,.;-@\\s\\-()]+$')]],
            rol: [dataObjeto.rol, [Validators.required]],
            password: [ dataObjeto.password , [Validators.maxLength(150),Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ,.;-\\s\\-()]+$')]],
            ADDRESS: [dataObjeto.ADDRESS],
            AGE: [dataObjeto.AGE],
            CAMPUS: [dataObjeto.CAMPUS],
            CELL: [dataObjeto.CELL],
            CITY: [dataObjeto.CITY],
            COUNTRY: [dataObjeto.COUNTRY],
            COUNTY: [dataObjeto.COUNTY],
            EMAIL_INST: [dataObjeto.EMAIL_INST],
            EMPLID: [dataObjeto.EMPLID],
            FEC_NAC: [dataObjeto.FEC_NAC],
            NAME: [dataObjeto.NAME],
            NATIONAL_ID: [dataObjeto.NATIONAL_ID],
            NATIONAL_ID_TYPE: [dataObjeto.NATIONAL_ID_TYPE],
            PHONE: [dataObjeto.PHONE],
            PROGRAM: [dataObjeto.PROGRAM],
            SEX: [dataObjeto.SEX],
            STATE: [dataObjeto.STATE]
        });

        if (this.fieldsDisabled) {
            this.form.get('fechaNacimiento')?.disable();
        }
    }

    registrar() {
        if (this.form.invalid) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor complete el formulario correctamente.' });
          return;
        }

        const { rol, ...rest } = this.form.value;
        const userData = { ...rest, roles: [{ idRol: rol }] };

        this.confirmationService.confirm({
          message: '¿Estás seguro(a) que la información ingresada es correcta?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'SI',
          rejectLabel: 'NO',
          accept: () => {
            // Llamar al método register del AuthService
            this.authService.register(userData).subscribe({
              next: (response) => {
                this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro satisfactorio.' });
                // Redirige a la página de login u otra ruta según tu flujo
                this.router.navigate(['/login']);
              },
              error: (err) => {
                const detalle = err.error?.p_mensaje || 'Error al registrar usuario.';
                this.messageService.add({ severity: 'error', summary: 'Error', detail: detalle });
                console.error('Error en el registro:', err);
              }
            });
          },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Registro cancelado.' });
      }
    });
  }

  consultarDocumento() {
      const tipo = this.form.get('tipoDocumento')?.value;
      const numero = this.form.get('numDocumento')?.value;
      if (!tipo || !numero) {
          return;
      }
      this.documentoService.consultar(tipo, numero).subscribe({
          next: (data) => {
              const nombres = data.NAME ? data.NAME.split(',')[1]?.trim() || '' : '';
              const apellidos = data.NAME ? data.NAME.split(',')[0]?.trim() || '' : '';
              const apellidoParts = apellidos.split(' ');
              const apellidoPaterno = apellidoParts.shift() || '';
              const apellidoMaterno = apellidoParts.join(' ');

              this.form.patchValue({
                  nombreUsuario: nombres,
                  apellidoPaterno: apellidoPaterno,
                  apellidoMaterno: apellidoMaterno,
                  fechaNacimiento: data.FEC_NAC ? data.FEC_NAC.substring(0,10) : '',
                  email: data.EMAIL_INST || '',
                  ADDRESS: data.ADDRESS || '',
                  AGE: data.AGE || 0,
                  CAMPUS: data.CAMPUS || '',
                  CELL: data.CELL || '',
                  CITY: data.CITY || '',
                  COUNTRY: data.COUNTRY || '',
                  COUNTY: data.COUNTY || '',
                  EMAIL_INST: data.EMAIL_INST || '',
                  EMPLID: data.EMPLID || '',
                  FEC_NAC: data.FEC_NAC || '',
                  NAME: data.NAME || '',
                  NATIONAL_ID: data.NATIONAL_ID || '',
                  NATIONAL_ID_TYPE: data.NATIONAL_ID_TYPE || '',
                  PHONE: data.PHONE || '',
                  PROGRAM: data.PROGRAM || '',
                  SEX: data.SEX || '',
                  STATE: data.STATE || ''
              });
              // Mantener los campos bloqueados cuando se encuentra el documento
              this.fieldsDisabled = true;
              this.form.get('fechaNacimiento')?.disable();
          },
          error: () => {
              this.form.patchValue({
                  id: 0,
                  nombreUsuario: '',
                  apellidoPaterno: '',
                  apellidoMaterno: '',
                  fechaNacimiento: '',
                  email: '',
                  ADDRESS: '',
                  AGE: 0,
                  CAMPUS: '',
                  CELL: '',
                  CITY: '',
                  COUNTRY: '',
                  COUNTY: '',
                  EMAIL_INST: '',
                  EMPLID: '',
                  FEC_NAC: '',
                  NAME: '',
                  NATIONAL_ID: '',
                  NATIONAL_ID_TYPE: '',
                  PHONE: '',
                  PROGRAM: '',
                  SEX: '',
                  STATE: ''
              });
              this.messageService.add({severity:'warn', summary:'Sin resultados', detail:'Documento no encontrado. Complete los datos manualmente.'});
              this.fieldsDisabled = false;
              this.form.get('fechaNacimiento')?.enable();
          }
      });
  }
}
