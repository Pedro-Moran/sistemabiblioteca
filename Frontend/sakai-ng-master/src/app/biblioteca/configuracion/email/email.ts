import { Component, OnInit } from '@angular/core';

import { InputValidation } from "../../input-validation";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateModule } from '../../template.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { EmailService } from '../../services/email.service';
import { AuthService } from '../../services/auth.service';
@Component({
    selector: 'app-email',
    standalone: true,
    template: ` <p-fluid>
	<div class="grid">
		<div class="col-12">
		<div class="card">
		<h5>{{titulo}}</h5>
		<form [formGroup]="form" (ngSubmit)="guardar()">
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="smtp_host">Host</label>
                        <input pInputText id="smtp_host" type="text" pSize="small" formControlName="smtp_host"/>
						<app-input-validation
					[form]="form"
					modelo="smtp_host"
					ver="Host"></app-input-validation>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="smtp_port">Puerto</label>
                        <input pInputText id="smtp_port" type="text" pSize="small" formControlName="smtp_port"/>
						<app-input-validation
					[form]="form"
					modelo="smtp_port"
					ver="Puerto"></app-input-validation>
                    </div>
				</div>
				<div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="smtp_mail_sender">Mail Sender</label>
                        <input pInputText id="smtp_mail_sender" type="text" pSize="small" formControlName="smtp_mail_sender"/>
						<app-input-validation
					[form]="form"
					modelo="smtp_mail_sender"
					ver="Mail Sender"></app-input-validation>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="smtp_mail_user">Mail User</label>
                        <input pInputText id="smtp_mail_user" type="text" pSize="small" formControlName="smtp_mail_user"/>
						<app-input-validation
					[form]="form"
					modelo="smtp_mail_user"
					ver="Mail User"></app-input-validation>
                    </div>
				</div>
				<div class="flex flex-col md:flex-row gap-6">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="smtp_mail_password">Contraseña</label>
						<p-password id="smtp_mail_password" pSize="small" formControlName="smtp_mail_password" class="w-full" [toggleMask]="true" />
                        
						<app-input-validation
					[form]="form"
					modelo="smtp_mail_password"
					ver="Contraseña"></app-input-validation>
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="url_img">Url imagen email</label>
                        <input pInputText id="url_img" type="text" pSize="small" formControlName="url_img"/>
						<app-input-validation
					[form]="form"
					modelo="url_img"
					ver="Url imagen email"></app-input-validation>
                    </div>
					
                </div>
				
				<div class="flex flex-col md:items-end gap-6 py-6">
				@if(formReadOnly){
				<div class="flex flex-col md:items-end gap-8">
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            <p-button icon="pi pi-pencil" label="Modificar" (click)="accion(false);" styleClass="flex-auto md:flex-initial whitespace-nowrap"></p-button>
                                        </div>
                                    </div>
				}@else {
					<div class="flex flex-col md:items-end gap-8">
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                        <p-button label="Cancelar" class="mr-2 mb-2" styleClass="p-button-outlined p-button-danger" icon="pi pi-ban" (click)="accion(true);" pTooltip="Cancelar" tooltipPosition="bottom"></p-button>
										<p-button type="submit" label="Guardar" class="mr-2 mb-2" styleClass="p-button-raised p-button-success" icon="pi pi-check" pTooltip="Guardar" 
										[disabled]="form.invalid || loading" tooltipPosition="bottom"></p-button>
							    
										</div>
                                    </div>
				}
				</div>
				</form>
		</div>
		</div>
		</div>
</p-fluid>

<p-toast></p-toast>
<p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>`,
    imports: [InputValidation,TemplateModule],
		providers: [MessageService, ConfirmationService]
})
export class Email implements OnInit{
	titulo:string="Configuracion de email";
	data!: any;
	modulo:string="conf";
	loading: boolean = true;
	form:FormGroup = new FormGroup({});
	submitted = false;
	formReadOnly=true;
	user:any;

	constructor(private emailService: EmailService, private authService: AuthService, private fb: FormBuilder, private messageService: MessageService,private confirmationService: ConfirmationService) { }
  	ngOnInit() {
		//this.user = this.authService.getUser();
		this.user={
			"idusuario":0
		}
		this.formValidar();
		this.objetoConfEmail();
  	}
	  objetoConfEmail(){
		this.emailService.conf_event(this.modulo+'/email')
		  .subscribe(
			(result: any) => {
			  this.loading=false;
			  if(result.status=="0"){
				this.data=result.data[0];
				this.changeForm();
			  }
			}
			, (error: HttpErrorResponse) => {
			  this.loading=false;
			}
		  );
	  }
	  formValidar(){
		this.form = this.fb.group({
		  smtp_host: [{ value: '', disabled: this.formReadOnly }, [Validators.required, Validators.maxLength(20),Validators.pattern('^[a-zA-Z.]+$')]],
		  smtp_port: [{ value: '', disabled: this.formReadOnly }, [Validators.required, Validators.maxLength(5), Validators.minLength(3), Validators.pattern('^[0-9]+$')]],
		  smtp_mail_sender: [{ value: '', disabled: this.formReadOnly }, [Validators.required, Validators.minLength(6), Validators.maxLength(50),Validators.email]],
		  smtp_mail_user: [{ value: '', disabled: this.formReadOnly }, [Validators.required, Validators.minLength(6), Validators.maxLength(50),Validators.email]],
		  smtp_mail_password: [{ value: '', disabled: this.formReadOnly }, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
		  url_img: [{ value: '', disabled: this.formReadOnly }, [Validators.required, Validators.minLength(6), Validators.maxLength(250)]],
		 // url_files: [{ value: '', disabled: this.formReadOnly }, [Validators.required, Validators.minLength(6), Validators.maxLength(250)]]
		});
	  }
	guardar(){
  
		this.confirmationService.confirm({
			message: '¿Estás seguro(a) de desea actualizar los datos de configuracion de correo?',
			header: 'Confirmar',
			icon: 'pi pi-exclamation-triangle',
			acceptLabel: 'SI',
			rejectLabel: 'NO',
			accept: () => {
			  this.loading=true;
			  const data = { id: this.data.id,smtp_host:this.form.get('smtp_host')?.value,smtp_port:this.form.get('smtp_port')?.value,
			  smtp_mail_sender:this.form.get('smtp_mail_sender')?.value,smtp_mail_user:this.form.get('smtp_mail_user')?.value,
			  smtp_mail_password:this.form.get('smtp_mail_password')?.value,url_img:this.form.get('url_img')?.value,url_files:"",idusuario:this.user.idusuario
			  };
			  this.emailService.conf_event_accion(data,this.modulo+'/email-registrar')
			  .subscribe(result => {
				if (result.p_status == 0) {
				  this.messageService.add({severity:'success', summary: 'Satisfactorio', detail: 'Registro actualizado.'});   
				  this.accion(true);       
				} else {
				  this.messageService.add({severity:'error', summary: 'Error', detail: 'No se puedo realizar el proceso.'}); 
				}
				this.loading=false;
			  }
				, (error: HttpErrorResponse) => {
				  this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde'}); 
				  this.loading=false;
				});
			}
		});
	   
	}
	changeForm() {
	  this.form.get('smtp_host')?.patchValue(this.data.smtp_host);
	  this.form.get('smtp_port')?.patchValue(this.data.smtp_port);
	  this.form.get('smtp_mail_sender')?.patchValue(this.data.smtp_mail_sender);
	  this.form.get('smtp_mail_user')?.patchValue(this.data.smtp_mail_user);
	  this.form.get('smtp_mail_password')?.patchValue(this.data.smtp_mail_password);
	  this.form.get('url_img')?.patchValue(this.data.url_img);
	}
	accion(valor:boolean){
		this.objetoConfEmail();
		this.formReadOnly=valor;
		if(valor){
		  this.form.get('smtp_host')?.disable();
		  this.form.get('smtp_port')?.disable();
		  this.form.get('smtp_mail_sender')?.disable();
		  this.form.get('smtp_mail_user')?.disable();
		  this.form.get('smtp_mail_password')?.disable();
		  this.form.get('url_img')?.disable();
		}else{      
		  this.form.get('smtp_host')?.enable();
		  this.form.get('smtp_port')?.enable();
		  this.form.get('smtp_mail_sender')?.enable();
		  this.form.get('smtp_mail_user')?.enable();
		  this.form.get('smtp_mail_password')?.enable();
		  this.form.get('url_img')?.enable();
		}

	}
}
