import { GenericoService } from '../../services/generico.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoRecurso } from '../../interfaces/tipo-recurso';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
import { Table } from 'primeng/table';
import { InputValidation } from '../../input-validation';
import { TemplateModule } from '../../template.module';
import { AuthService } from '../../services/auth.service';
import { ClaseGeneral } from '../../interfaces/clase-general';
@Component({
    selector: 'app-tipo-recurso',
    standalone: true,
    template: `<div class="grid">
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
                            pTooltip="Actualizar Lista" tooltipPosition="bottom"></button>
                            
        </ng-template>
    </p-toolbar>
                  
                    <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                    [showCurrentPageReport]="true"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                    [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true" 
                    [globalFilterFields]="['id','tipo.descripcion','descripcion','activo']" responsiveLayout="scroll">
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
                                <th pSortableColumn="tipo.descripcion" style="min-width:200px">Tipo<p-sortIcon field="tipo.descripcion"></p-sortIcon></th>
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
                                    {{objeto.tipo?.descripcion}}
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
                            <label for="descripcion">Tipo</label>
                            <p-select appendTo="body" [options]="dataTipo" optionLabel="descripcion" placeholder="Seleccionar" formControlName="tipo"/>
               
                            <app-input-validation
              [form]="form"
              modelo="descripcion"
              ver="descripcion"></app-input-validation>
                        </div>
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
export class TipoRecursoComponent {
    titulo:string="Tipo recurso";
    data: TipoRecurso[]= [];
    modulo:string="tipo-recurso";
    loading: boolean = true;
    objeto!:any;
    submitted!: boolean;
    objetoDialog!: boolean;
    msgs: Message[] = [];
    form: FormGroup = new FormGroup({}); 
    user:any;
    selectedItem: any;
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    items!: MenuItem[];
    dataTipo: ClaseGeneral[] = [];

    constructor(private genericoService: GenericoService,private fb: FormBuilder, 
          private router: Router,private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
    async ngOnInit() {
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
      await this.ListaTipo();
      await this.listar();
      this.formValidar();
    }

    
        formValidar(){
          let dataObjeto=JSON.parse(JSON.stringify(this.objeto));
          this.form = this.fb.group({
            id: [dataObjeto.id ],
            tipo: [dataObjeto.tipo , [Validators.required]],            
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
      editarRegistro(objeto:TipoRecurso){
       
        this.objeto = objeto;
        this.formValidar();
        this.objetoDialog = true;
      }
      nuevoRegistro(){
        this.objeto = {
          "id":0,
          "descripcion":""
        };
        this.formValidar();
        this.objetoDialog = true;
      }
      
      cancelar() {
          this.objetoDialog = false;
          this.submitted = false;
      }
      
      deleteRegistro(objeto: TipoRecurso) {
          this.confirmationService.confirm({
              message: '¿Estás seguro(a) de que quieres eliminar: ' +objeto.tipo.descripcion+' - ' + objeto.descripcion + '?',
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
      

    async ListaTipo() {
      try {
          const result: any = await this.genericoService.tipo_get('conf/tipo-lista').toPromise();
          if (result.status === "0") {
              this.dataTipo = result.data;
          }
      } catch (error) {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
      }

  }
      listar(){
        this.loading=true;
        this.data=[];
        this.genericoService.tiporecurso_get(this.modulo+'/lista')
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
      cambiarEstadoRegistro(objeto: TipoRecurso) {
        let estado="";
        if(objeto.activo){
          estado="Desactivar";
        }else{
          estado="Activar"
        }
          this.confirmationService.confirm({
              message: '¿Estás seguro(a) de que quieres cambiar el estado: '+objeto.tipo.descripcion+' - ' + objeto.descripcion + ' a '+estado+'?',
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
