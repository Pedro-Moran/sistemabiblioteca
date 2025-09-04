import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { InputValidation } from '../input-validation';
import { TemplateModule } from '../template.module';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
import { Table } from 'primeng/table';
import { ClaseGeneral } from '../interfaces/clase-general';
import { AuthService } from '../services/auth.service';
import { GenericoService } from '../services/generico.service';

@Component({
    selector: 'app-conf-lista',
    standalone: true,
    template: ` 
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>{{titulo}}</h5>
                <p-toolbar styleClass="mb-6">
    <ng-template #start>
    </ng-template>

    <ng-template #end>
         <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoRegistro()" 
                        pTooltip="Nuevo registro" tooltipPosition="bottom"></button>
                        <button pButton type="button" icon="pi pi-refresh" class="mr-2" (click)="listar()" [disabled]="loading"
                        [disabled]="loading" pTooltip="Actualizar Lista" tooltipPosition="bottom"></button>
                        
    </ng-template>
</p-toolbar>
              
                <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                [showCurrentPageReport]="true"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true" 
                [globalFilterFields]="['id','descripcion','activo']" responsiveLayout="scroll">
                    <ng-template pTemplate="caption">
                   
                    <div class="flex items-center justify-between">
            <p-button [outlined]="true" icon="pi pi-filter-slash" label="Limpiar" (click)="clear(dt1)" />
            
            <p-iconfield>
                <input pInputText type="text" placeholder="Filtrar" #filter (input)="onGlobalFilter(dt1, $event)"/>
            </p-iconfield>
        </div>
                    </ng-template>
                    <ng-template pTemplate="header">
                        <tr>
                            <th style="width: 4rem" pSortableColumn="id" >ID <p-sortIcon field="id"></p-sortIcon></th>
                            <th pSortableColumn="descripcion" style="min-width:200px">Descripcion<p-sortIcon field="descripcion"></p-sortIcon></th>
                            <th pSortableColumn="activo" style="width: 4rem">Estado<p-sortIcon field="activo"></p-sortIcon></th>
                            <th style="width: 4rem" >Opciones</th>
                            
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-objeto>
                        <tr>
                            <td>
                                {{objeto.id}}
                            </td>
                            <td>
                                {{objeto.descripcion}}
                            </td>	
                            <td>
                                @if(objeto.activo){
                                    ACTIVO
                                }@else{
                                    DESACTIVO
                                }
                            </td>				
                            <td class="text-center">
                                <div style="position: relative;">
                                    <button pButton type="button" icon="pi pi-ellipsis-v"
                                        class="p-button-rounded p-button-text p-button-plain"
                                        (click)="showMenu($event, objeto)"></button>
                                    <p-menu #menu [popup]="true" [model]="items" appendTo="body"></p-menu>
                                </div>
                                
                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="8">No se encontraron registros.</td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="loadingbody">
                        <tr>
                            <td colspan="8">Cargando datos. Espere por favor.</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
    
        </div>
    </div>
    
    <p-dialog [(visible)]="objetoDialog" [style]="{width: '50vw'}"  header="Registro" [modal]="true" styleClass="p-fluid">
        <ng-template pTemplate="content">
            <form [formGroup]="form" >
            <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <label for="descripcion">Descripci&oacute;n</label>
                        <input pInputText id="descripcion" type="text" formControlName="descripcion"  />
                        <app-input-validation
					[form]="form"
					modelo="descripcion"
					ver="descripcion"></app-input-validation>
                    </div>
                </div>
        </form>
        </ng-template>
    
        <ng-template pTemplate="footer">
            <button pButton pRipple type="button" icon="pi pi-times" (click)="cancelar()" [disabled]="loading" label="Cancelar" class="p-button-outlined p-button-danger"></button>
            <button pButton pRipple type="button" icon="pi pi-check" (click)="guardar()" [disabled]="form.invalid || loading" label="Guardar" class="p-button-success"></button>
        </ng-template>
    </p-dialog>
    
    <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
    <p-toast></p-toast>`,
        imports: [InputValidation,TemplateModule],
            providers: [MessageService, ConfirmationService]
})
export class ConfListaComponent implements OnInit,AfterViewInit, OnChanges{
    @Input("titulo")  titulo!: string;
    @Input("modulo")  modulo!: string;
    @Input("data") data: ClaseGeneral[] = [];
    @Input("loading") loading: boolean= true;
    objeto!:any;
    @ViewChild('filter') filter!: ElementRef;
    submitted!: boolean;
    objetoDialog!: boolean;
    msgs: Message[] = [];
    form: FormGroup = new FormGroup({}); 
    user:any;
    selectedItem: any;
    @ViewChild('menu') menu!: Menu;
    items!: MenuItem[];
    
    constructor(private genericoService: GenericoService,private fb: FormBuilder, 
      private router: Router,private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
    ngOnInit() {
      this.items = [
        
        {
          label: 'Cambiar estado',
          icon: 'pi pi-check',
          command: (event) => this.cambiarEstadoRegistro(this.selectedItem)
        },
        {
          label: 'Actualizar',
          icon: 'pi pi-pencil',
          command: (event) => this.editarRegistro(this.selectedItem)
        },
        {
          label: 'Eliminar',
          icon: 'pi pi-trash',
          command: (event) => this.deleteRegistro(this.selectedItem)
        }
      ]
     // this.user = this.authService.getUser();
		this.user={
			"idusuario":0
		}
      this.objeto={
        id:0,
        descripcion:''   
      };
      this.formValidar();
    }
    ngAfterViewInit() {
    }
    ngOnChanges(changes: SimpleChanges): void {
      this.refreshPag();
    }
    formValidar(){
      let dataObjeto={
        id:this.objeto.id,
        descripcion:this.objeto.descripcion     
      };
      this.form = this.fb.group({
        id: [dataObjeto.id ],
      descripcion: [dataObjeto.descripcion , [Validators.required,Validators.maxLength(200),Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]]
      });
    }
    refreshPag(){
    }
    
    onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  
  clear(table: Table) {
      table.clear();
      this.filter.nativeElement.value = '';
  }
  editarRegistro(objeto:ClaseGeneral){
    let objt={
      id:objeto.id,
      descripcion:objeto.descripcion
    }
    this.objeto = objt;
    this.formValidar();
    this.objetoDialog = true;
  }
  nuevoRegistro(){
    this.objeto = {
      "id":0,
      "descripcion":""
    };
    this.formValidar();
    this.submitted = false;
    this.objetoDialog = true;
  }
  
  cancelar() {
      this.objetoDialog = false;
      this.submitted = false;
  }
  
  deleteRegistro(objeto: ClaseGeneral) {
      this.confirmationService.confirm({
          message: '¿Estás seguro(a) de que quieres eliminar: ' + objeto.descripcion + '?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'SI',
          rejectLabel: 'NO',
          accept: () => {
            this.loading=true;
            const data = { id: objeto.id};
            this.genericoService.conf_event_delete(data,this.modulo+'/eliminar')
            .subscribe(result => {
              if (result.p_status == 0) {
                this.objetoDialog = false;
                this.messageService.add({severity:'success', summary: 'Satisfactorio', detail: 'Registro eliminado.'});   
                this.listar();       
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
  guardar(){    
    this.loading=true;
    const data = { id:  this.form.get('id')?.value, descripcion:  this.form.get('descripcion')?.value,usuarioid:this.user.idusuario,activo:true,accion:'registrar'};
      this.genericoService.conf_event_post(data,this.modulo+'/registrar')
        .subscribe(result => {
          if (result.p_status == 0) {
            this.objetoDialog = false;
            this.messageService.add({severity:'success', summary: 'Satisfactorio', detail: 'Registro guardado.'});   
            this.listar();       
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
  listar(){
    this.loading=true;
    this.data=[];
    this.genericoService.conf_event_get(this.modulo+'/lista')
        .subscribe(
          (result: any) => {
            this.loading=false;
            if(result.status=="0"){
              this.data=result.data;
            }
          }
          , (error: HttpErrorResponse) => {
            this.loading=false;
          }
        );
  }
  cambiarEstadoRegistro(objeto: ClaseGeneral) {
    let estado="";
    if(objeto.activo){
      estado="Desactivar";
    }else{
      estado="Activar"
    }
      this.confirmationService.confirm({
          message: '¿Estás seguro(a) de que quieres cambiar el estado: ' + objeto.descripcion + ' a '+estado+'?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'SI',
          rejectLabel: 'NO',
          accept: () => {
            this.loading=true;
            const data = { id: objeto.id,activo:!objeto.activo,idusuario:this.user.idusuario};
            this.genericoService.conf_event_put(data,this.modulo+'/activo')
            .subscribe(result => {
              if (result.p_status == 0) {
                this.objetoDialog = false;
                this.messageService.add({severity:'success', summary: 'Satisfactorio', detail: 'Estado de registro satisfactorio.'});   
                this.listar();       
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
  showMenu(event: MouseEvent, selectedItem: any) {
    this.selectedItem = selectedItem;
    this.menu.toggle(event);
  }
}
