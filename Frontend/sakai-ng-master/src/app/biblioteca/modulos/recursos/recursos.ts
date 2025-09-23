import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
import { Table } from 'primeng/table';
import { InputValidation } from '../../input-validation';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { TipoRecurso } from '../../interfaces/tipo-recurso';
import { AuthService } from '../../services/auth.service';
import { GenericoService } from '../../services/generico.service';
import { TemplateModule } from '../../template.module';
import { RecursosService } from '../../services/recursos.service';
import { Recurso } from '../../interfaces/recurso';
import { Tipo } from '../../interfaces/tipo';

@Component({
  selector: 'app-recursos',
  standalone: true,
  template: ` <div class="">
                <div class="">
                    <div class="card flex flex-col gap-4 w-full">
                        <h5>{{titulo}}</h5>
                        <p-toolbar styleClass="mb-6">
            <ng-template #start>
            <div class="flex flex-wrap gap-4">
                       
                        <div class="flex flex-col grow basis-0 gap-2">
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSedesFiltro" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                        <p-select [(ngModel)]="tipoFiltro" [options]="dataTipoFiltro" optionLabel="descripcion"  (onChange)="listarTiposRecurso()"placeholder="Seleccionar" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                        <p-select [(ngModel)]="tipoRecursoFiltro" [options]="dataTipoRecursoFiltro" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>
                        <button pButton type="button" icon="pi pi-search" class="mr-2 p-inputtext-sm"
                        (click)="listar()" [disabled]="loading" pTooltip="Actualizar Lista"
                        tooltipPosition="bottom"></button>
                    </div>
            </ng-template>
        
            <ng-template #end>
                 <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoRegistro()" 
                                pTooltip="Nuevo registro" tooltipPosition="bottom"></button>
                                
                                
            </ng-template>
        </p-toolbar>
                      
                        <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true" 
                        [globalFilterFields]="['id','tipoRecurso.tipo.descripcion','tipoRecurso.descripcion','sede.descripcion','nombre','descripcion','estado.descripcion','activo','codigo']" responsiveLayout="scroll">
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
                                    <th pSortableColumn="tipoRecurso.tipo.descripcion" style="min-width:200px">Tipo Recurso<p-sortIcon field="tipoRecurso.tipo.descripcion"></p-sortIcon></th>
                                    <th pSortableColumn="sede.descripcion" style="min-width:200px">Sede<p-sortIcon field="sede.descripcion"></p-sortIcon></th>
                                    <th pSortableColumn="nombre" style="min-width:200px">Nombre<p-sortIcon field="nombre"></p-sortIcon></th>
                                    <th pSortableColumn="descripcion" style="min-width:200px">Descripcion<p-sortIcon field="descripcion"></p-sortIcon></th>
                                    <th pSortableColumn="estado.descripcion" style="width: 4rem">Estado<p-sortIcon field="estado.descripcion"></p-sortIcon></th>
                                    <th pSortableColumn="codigo" style="width: 4rem">Codigo<p-sortIcon field="codigo"></p-sortIcon></th>
                                    <th style="width: 4rem" >Opciones</th>
                                    
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-objeto>
                                <tr>
                                    <td>
                                        {{objeto.id}}
                                    </td>
                                    <td>
                                        {{objeto.tipoRecurso.tipo?.descripcion}} - {{objeto.tipoRecurso?.descripcion}}
                                    </td>	
                                    
                                    <td>
                                        {{objeto.sede?.descripcion}}
                                    </td>	
                                    <td>
                                        {{objeto.nombre}}
                                    </td>	
                                    <td>
                                        {{objeto.descripcion}}
                                    </td>	
                                    <td>{{objeto.estado.descripcion}}
                                    </td>	
                                    <td>{{objeto.codigo}}
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
            
            <p-dialog [(visible)]="objetoDialog" [style]="{width: '80vw'}"  header="Registro" [modal]="true" styleClass="p-fluid">
                <ng-template pTemplate="content">
                    <form [formGroup]="form" >
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="descripcion">Tipo</label>
                            <p-select appendTo="body" [options]="dataTipo" optionLabel="descripcion" placeholder="Seleccionar" formControlName="tipo" (onChange)="listarTiposRecurso()"/>
               
                            <app-input-validation
              [form]="form"
              modelo="tipo"
              ver="tipo"></app-input-validation>
                      </div>
                      <div class="flex flex-col gap-2 w-full">
                      <label for="descripcion">Tipo recurso</label>
                                <p-select appendTo="body" [options]="dataTipoRecurso" optionLabel="descripcion" placeholder="Seleccionar" formControlName="tipoRecurso"/>
                   
                                <app-input-validation
                  [form]="form"
                  modelo="tipoRecurso"
                  ver="tipoRecurso"></app-input-validation>
                      </div>
                      <div class="flex flex-col gap-2 w-full">
                      <label for="descripcion">Sede</label>
                                <p-select appendTo="body" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" formControlName="sede"/>
                   
                                <app-input-validation
                  [form]="form"
                  modelo="sede"
                  ver="sede"></app-input-validation>
                      </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="nombre">Nombre</label>
                                <input pInputText id="nombre" type="text" formControlName="nombre"  />
                                <app-input-validation
                  [form]="form"
                  modelo="nombre"
                  ver="nombre"></app-input-validation>
                      </div>
                      <div class="flex flex-col gap-2 w-full">
                      <label for="descripcion">Descripci&oacute;n</label>
                                <input pInputText id="descripcion" type="text" formControlName="descripcion"  />
                                <app-input-validation
                  [form]="form"
                  modelo="descripcion"
                  ver="descripcion"></app-input-validation>
                      </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="codigo">Codigo</label>
                                <input pInputText id="codigo" type="text" formControlName="codigo"  />
                                <app-input-validation
                  [form]="form"
                  modelo="codigo"
                  ver="codigo"></app-input-validation>
                      </div>
                      <div class="flex flex-col gap-2 w-full">
                      <label for="capacidad">Capacidad</label>
                                <input pInputText id="capacidad" type="text" formControlName="capacidad"  />
                                <app-input-validation
                  [form]="form"
                  modelo="capacidad"
                  ver="capacidad"></app-input-validation>
                      </div>
                      <div class="flex flex-col gap-2 w-full">
                      <label for="ubicacion">Ubicaci&oacute;n</label>
                                <input pInputText id="ubicacion" type="text" formControlName="ubicacion"  />
                                <app-input-validation
                  [form]="form"
                  modelo="ubicacion"
                  ver="ubicacion"></app-input-validation>
                      </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-x-4 gap-y-2">
                      <div class="flex flex-col gap-2 w-full">
                      <label for="caracteristicas">Caracter&iacute;sticas</label>
                      <textarea pTextarea id="caracteristicas" rows="4" formControlName="caracteristicas"></textarea>
                
                                <app-input-validation
                  [form]="form"
                  modelo="caracteristicas"
                  ver="caracteristicas"></app-input-validation>
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
  imports: [InputValidation, TemplateModule],
  providers: [MessageService, ConfirmationService]
})
export class RecursosComponent {
  titulo: string = "Biblioteca virtual";
  data: TipoRecurso[] = [];
  modulo: string = "recursoS";
  loading: boolean = true;
  objeto: Recurso=new Recurso();
  submitted!: boolean;
  objetoDialog!: boolean;
  msgs: Message[] = [];
  form: FormGroup = new FormGroup({});
  user: any;
  selectedItem: any;
  @ViewChild('menu') menu!: Menu;
  @ViewChild('filter') filter!: ElementRef;
  items!: MenuItem[];
  dataTipo: ClaseGeneral[] = [];
  dataTipoRecurso: TipoRecurso[] = [];
  dataSede: ClaseGeneral[] = [];
  dataSedesFiltro: ClaseGeneral[] = [];
  sedeFiltro: ClaseGeneral = new ClaseGeneral();
  dataTipoFiltro: ClaseGeneral[] = [];
  tipoFiltro: ClaseGeneral = new ClaseGeneral();
  dataTipoRecursoFiltro: TipoRecurso[] = [];
  tipoRecursoFiltro: TipoRecurso = new TipoRecurso();

  constructor(private recursosService: RecursosService, private genericoService: GenericoService, private fb: FormBuilder,
    private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
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
    this.user = {
      "idusuario": 0
    }
    await this.ListaTipo();
    await this.ListaSede();
    await this.listar();
    this.formValidar();
  }


  formValidar() {
    let dataObjeto = JSON.parse(JSON.stringify(this.objeto));
    console.log(dataObjeto);
    let documentosFiltrados;
    if(dataObjeto.tipoRecurso){
      dataObjeto.tipo=dataObjeto.tipoRecurso.tipo;
      this.listarTiposRecurso();
      dataObjeto.tipoRecurso=dataObjeto.tipoRecurso;
    }else{
      dataObjeto.tipoRecurso=null;
      dataObjeto.tipo=null;
    }
    this.form = this.fb.group({
      id: [dataObjeto.id],
      tipo: [dataObjeto.tipo, [Validators.required]],
      tipoRecurso: [dataObjeto.tipoRecurso, [Validators.required]],
      sede: [dataObjeto.sede, [Validators.required]],
      nombre: [dataObjeto.descripcion, [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
      descripcion: [dataObjeto.descripcion, [ Validators.maxLength(200), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
      codigo: [dataObjeto.codigo, [Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]],
      capacidad: [dataObjeto.capacidad, [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+$')]],
      ubicacion: [dataObjeto.ubicacion, [Validators.required, Validators.maxLength(200), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
      caracteristicas: [dataObjeto.caracteristicas, [Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
      
    });
  }
  refreshPag() {
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  editarRegistro(objeto: Recurso) {

    this.objeto = objeto;
    this.formValidar();
    this.objetoDialog = true;
  }
  nuevoRegistro() {
    this.formValidar();
    this.objetoDialog = true;
  }

  cancelar() {
    this.objetoDialog = false;
    this.submitted = false;
  }

  deleteRegistro(objeto: Recurso) {
    this.confirmationService.confirm({
      message: '¿Estás seguro(a) de que quieres eliminar: ' + objeto.nombre  + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
        this.loading = true;
        const data = { id: objeto.id };
        this.genericoService.conf_event_delete(data, this.modulo + '/eliminar')
          .subscribe(result => {
            if (result.p_status == 0) {
              this.objetoDialog = false;
              this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro eliminado.' });
              this.listar();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
            }
            this.loading = false;
          }
            , (error: HttpErrorResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
              this.loading = false;
            });
      }
    });
  }
  guardar() {
    this.loading = true;
    const data = { id: this.form.get('id')?.value, descripcion: this.form.get('descripcion')?.value, usuarioid: this.user.idusuario, activo: true, accion: 'registrar' };
    this.genericoService.conf_event_post(data, this.modulo + '/registrar')
      .subscribe(result => {
        if (result.p_status == 0) {
          this.objetoDialog = false;
          this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro guardado.' });
          this.listar();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
        }
        this.loading = false;
      }
        , (error: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
          this.loading = false;
        });

  }


  async ListaTipo() {
    try {
      const result: any = await this.genericoService.tipo_get('conf/tipo-lista').toPromise();
      if (result.status === "0") {
        this.dataTipo = result.data;
        let tipos = [{ id: 0, descripcion: 'TODAS LOS TIPOS', activo: true, estado: 1 }, ...this.dataTipo];

                this.dataTipoFiltro = tipos;
                this.tipoFiltro = this.dataTipoFiltro[0];
      }
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
    }

  }
  async listarTiposRecurso() {
    this.loading = true;
    this.form.get("tipoRecurso")?.setValue(null); 
    this.dataTipoRecurso = [];
    this.genericoService.tiporecurso_get(this.modulo + '/lista')
      .subscribe(
        (result: any) => {
          this.loading = false;
          if (result.status == "0") {
            let recursosFiltrados = result.data.filter((recurso: { tipo: { id: any; }; }) => recurso.tipo.id === this.form.get("tipo")?.value.id);
            this.dataTipoRecurso = recursosFiltrados;
            let tiposRecurso =null;
            if(this.tipoFiltro.id>0){
              recursosFiltrados = result.data.filter((recurso: { tipo: { id: any; }; }) => recurso.tipo.id === this.tipoFiltro.id);
            tiposRecurso = [{ id: 0,tipo:new Tipo(), descripcion: 'TODAS LOS TIPOS RECURSO', activo: true, estado: 1 }, ...recursosFiltrados];
            }else{
              tiposRecurso = [{ id: 0,tipo:new Tipo(), descripcion: 'TODAS LOS TIPOS RECURSO', activo: true, estado: 1 }, ...result.data];
            }
        

        this.dataTipoRecursoFiltro = tiposRecurso;
        this.tipoRecursoFiltro = this.dataTipoRecursoFiltro[0];
          }
        }
        , (error: HttpErrorResponse) => {
          this.loading = false;
        }
      );
  }
  async ListaSede() {
    try {
      const result: any = await this.genericoService.sedes_get('conf/tipo-lista').toPromise();
      if (result.status === "0") {
        this.dataSede = result.data;
        let sedes = [{ id: 0, descripcion: 'TODAS LAS SEDES', activo: true, estado: 1 }, ...this.dataSede];

                this.dataSedesFiltro = sedes;
                this.sedeFiltro = this.dataSedesFiltro[0];
      }
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
    }

  }
  listar() {
    this.loading = true;
    this.data = [];
    this.recursosService.api_recursos_lista(this.modulo + '/lista')
      .subscribe(
        (result: any) => {
          this.loading = false;
          if (result.status == "0") {
            this.data = result.data;
          }
        }
        , (error: HttpErrorResponse) => {
          this.loading = false;
        }
      );
  }
  cambiarEstadoRegistro(objeto: Recurso) {
    let estado = "";
    if (objeto.activo) {
      estado = "Desactivar";
    } else {
      estado = "Activar"
    }
    this.confirmationService.confirm({
      message: '¿Estás seguro(a) de que quieres cambiar el estado: ' + objeto.nombre  + ' a ' + estado + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
        this.loading = true;
        const data = { id: objeto.id, activo: !objeto.activo, idusuario: this.user.idusuario };
        this.genericoService.conf_event_put(data, this.modulo + '/activo')
          .subscribe(result => {
            if (result.p_status == 0) {
              this.objetoDialog = false;
              this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Estado de registro satisfactorio.' });
              this.listar();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
            }
            this.loading = false;
          }
            , (error: HttpErrorResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
              this.loading = false;
            });
      }
    });
  }
  showMenu(event: MouseEvent, selectedItem: any) {
    this.selectedItem = selectedItem;
    this.menu.toggle(event);
  }
}
