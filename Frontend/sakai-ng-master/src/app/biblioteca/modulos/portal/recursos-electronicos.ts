import { HttpErrorResponse } from '@angular/common/http';
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
import { LibroElectronico } from '../../interfaces/librosElectronicos';
import { PortalService } from '../../services/portal.service';
import { RecursoDigitalDTO } from '../../interfaces/RecursoDigitalDTO';
import { TipoRecurso } from '../../interfaces/tipo-recurso';
@Component({
    selector: 'app-recursos-electronicos',
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

                    <p-table #dt1 [value]="data" dataKey="id" selectionMode="multiple" [(selection)]="selectedRows" [rows]="10"
                    [showCurrentPageReport]="true"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                    [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                    [globalFilterFields]="['id','tipo.descripcion','titulo','activo']" responsiveLayout="scroll">
                    <ng-template pTemplate="caption">

                   <div class="flex items-center justify-between">
           <p-button [outlined]="true" icon="pi pi-filter-slash" label="Limpiar" (click)="clear(dt1)" />

           <div class="flex items-center gap-2">
               <p-iconfield>
                   <input pInputText type="text" placeholder="Filtrar" #filter (input)="onGlobalFilter(dt1, $event)"/>
               </p-iconfield>
               <button pButton type="button" class="p-button-danger" label="Eliminar seleccionados" icon="pi pi-trash"
                       (click)="deleteSelected()" [disabled]="!selectedRows.length"></button>
           </div>
       </div>
                   </ng-template>
                        <ng-template pTemplate="header">
                            <tr>
                            <th style="width:3rem"><p-tableHeaderCheckbox></p-tableHeaderCheckbox></th>
                            <th>Imagen</th>
                            <th pSortableColumn="tipo.descripcion" style="min-width:200px">Tipo<p-sortIcon field="tipo.descripcion"></p-sortIcon></th>
                                <th pSortableColumn="titulo" style="min-width:200px">Titulo<p-sortIcon field="titulo"></p-sortIcon></th>
                                <th pSortableColumn="activo" style="width: 4rem">Estado<p-sortIcon field="activo"></p-sortIcon></th>
                                <th style="width: 4rem" >Opciones</th>

                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-objeto>
                            <tr [pSelectableRow]="objeto">
                                <td><p-tableCheckbox [value]="objeto"></p-tableCheckbox></td>
                                <td>
                                <img [src]="objeto.imagenUrl" [alt]="objeto.titulo" width="50" class="shadow-lg" />
                                    </td>
                                <td>
                                    {{objeto.tipoDescripcion}}
                                </td>
                                <td>
                                    {{objeto.titulo}}
                                    <a [href]="objeto.enlace" target="_blank"><p class="text-gray-500 mt-2"> URL:{{ objeto.enlace }}</p></a>
                                </td>
                                <td>
                                    @if(objeto.estado === 1){
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
                            <label for="tipoId">Tipo</label>
                            <p-select
                              formControlName="tipoId"
                              [options]="dataTipo"
                              optionLabel="descripcion"
                              optionValue="id"
                              placeholder="Seleccionar Tipo">
                            </p-select>

                            <app-input-validation
                              [form]="form"
                              modelo="tipoId"
                              ver="tipoId"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="titulo">Titulo</label>
                            <input pInputText id="titulo" type="text" formControlName="titulo"  />
                            <app-input-validation
                              [form]="form"
                              modelo="titulo"
                              ver="titulo"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="autor">Autor</label>
                            <input pInputText id="autor" type="text" formControlName="autor"  />
                            <app-input-validation
                              [form]="form"
                              modelo="autor"
                              ver="autor"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="descripcion">Descripci&oacute;n</label>
                            <textarea pTextarea id="descripcion" rows="8" formControlName="descripcion"></textarea>
                            <app-input-validation
                              [form]="form"
                              modelo="descripcion"
                              ver="descripcion"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="enlace">URL Documento</label>
                            <input pInputText id="enlace" type="text" formControlName="enlace"  />
                            <app-input-validation
                              [form]="form"
                              modelo="enlace"
                              ver="enlace"></app-input-validation>
                        </div>
                        <div class="flex flex-col gap-2 md:w-1/4" >
      <label for="adjunto">Logo</label>
      <p-fileupload
        #fu
        mode="basic"
        chooseLabel="Seleccionar"
        chooseIcon="pi pi-upload"
        name="adjunto"
        accept="image/*"
        maxFileSize="1000000"
        (onSelect)="onFileSelect($event)">

  <ng-template pTemplate="empty">
    Ningún archivo seleccionado
  </ng-template>
      </p-fileupload>

      <app-input-validation [form]="form" modelo="adjunto" ver="adjunto"></app-input-validation>
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
export class RecursosElectronicos implements OnInit {
    titulo:string="Recursos electrónicos";
    data: RecursoDigitalDTO[]= [];
    modulo:string="recursos-electronicos";
    loading: boolean = true;
//     objeto:LibroElectronico=new LibroElectronico();
    submitted!: boolean;
    objetoDialog!: boolean;
    msgs: Message[] = [];
    form: FormGroup = new FormGroup({});
    user:any;
    selectedItem: any;
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    items!: MenuItem[];
    dataTipo: TipoRecurso[] = [];
    objeto!: RecursoDigitalDTO;
    selectedFile: File | null = null;
    selectedRows: RecursoDigitalDTO[] = [];
    @ViewChild('dt1') dt!: Table;

    constructor(private portalService: PortalService,private fb: FormBuilder,
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
    this.portalService.listarTipoRecursos()
          .subscribe(res => this.dataTipo = res.data);
      await this.ListaTipo();
      await this.listar();
      this.formValidar();
    }


        formValidar(){
          const data = this.objeto ?? {} as RecursoDigitalDTO;
           this.form = this.fb.group({
              id: [ data.id ?? null ],
              // campo fileUpload: vacío al abrir nuevo/editar
              adjunto: [ '', Validators.required ],
              // aquí sí exists control tipoId
              tipoId: [ data.tipoId ?? null, Validators.required ],
              titulo: [ data.titulo  ?? '', Validators.required ],
              autor:  [ data.autor   ?? '', Validators.required ],
              enlace: [ data.enlace  ?? '', Validators.required ],
              descripcion: [ data.descripcion ?? '', Validators.required ]
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
      editarRegistro(obj:RecursoDigitalDTO){

        // 1) guarda la entidad para que formValidar (si lo usas) use estos valores como defecto
          this.objeto = obj;

          // 2) parchea directamente el formGroup
          this.form.patchValue({
            id:         obj.id,
            tipoId:     obj.tipoId,      // ← aquí asignas el valor del combo
            titulo:     obj.titulo,
            autor:      obj.autor,
            enlace:     obj.enlace,
            descripcion:obj.descripcion,
            // adjunto: deja en blanco o muéstralo aparte
          });

          // 3) abre el diálogo
          this.objetoDialog = true;
      }
      nuevoRegistro(){
        // 1) Re-inicializa el objeto a un DTO vacío
          this.objeto = {} as RecursoDigitalDTO;
          // 2) Limpia también el File
//           this.selectedFile = undefined;
          // 3) Re-crea el formulario usando formValidar (parte de tu lógica actual)
          this.formValidar();
          // 4) Abre el diálogo
          this.objetoDialog = true;
      }

      cancelar() {
          this.objetoDialog = false;
          this.submitted = false;
      }

      deleteRegistro(objeto: RecursoDigitalDTO) {
        this.confirmationService.confirm({
          message: `¿Estás seguro(a) de que quieres eliminar: ${objeto.tipoDescripcion} - ${objeto.titulo}?`,
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'SI',
          rejectLabel: 'NO',
          accept: () => {
            this.loading = true;
            this.portalService.deleteRecursoDigital(objeto.id!)
              .subscribe({
                next: res => {
                  if (res.p_status === 0) {
                    this.messageService.add({severity: 'success', summary: 'Satisfactorio', detail: 'Registro eliminado.'});
                    this.listar();
                  } else {
                    this.messageService.add({severity: 'warn', detail: res.message});
                  }
                  this.loading = false;
                },
                error: () => {
                  this.messageService.add({severity:'error', summary:'Error', detail:'Ocurrió un error. Intentelo más tarde'});
                  this.loading = false;
                }
              });
          }
        });
      }

      deleteSelected() {
        if (!this.selectedRows.length) return;
        this.confirmationService.confirm({
          message: '¿Estás seguro(a) de eliminar los seleccionados?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'SI',
          rejectLabel: 'NO',
          accept: () => {
            const ids = this.selectedRows.map(item => item.id!) as number[];
            this.loading = true;
            this.portalService.deleteBulkRecursos(ids).subscribe({
              next: () => {
                this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registros eliminados.' });
                this.selectedRows = [];
                this.listar();
                this.loading = false;
              },
              error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo realizar el proceso.' });
                this.loading = false;
              }
            });
          }
        });
      }
     guardar() {
       if (this.form.invalid) return;

       const email = this.authService.getEmail();               // <-- esto te da el decoded.sub
       const dto: RecursoDigitalDTO = {
         id:                   this.form.get('id')!.value,
         autor:                this.form.get('autor')!.value,
         titulo:               this.form.get('titulo')!.value,
         descripcion:          this.form.get('descripcion')!.value,
         enlace:               this.form.get('enlace')!.value,
         estado:               1,                                // activo
         tipoId:               this.form.get('tipoId')!.value,
         usuarioCreacion:      email,
         usuarioModificacion:  email,                            // aquí ya no llamas a user.idusuario
         fechaCreacion:        new Date().toISOString(),         // opcional
         fechaModificacion:    new Date().toISOString()
       };
        const formData = new FormData();
          formData.append(
            'dto',
            new Blob([JSON.stringify(dto)], { type: 'application/json' })
          );
          if (this.selectedFile) {
            formData.append('imagen', this.selectedFile, this.selectedFile.name);
          }


       this.loading = true;
       this.portalService.saveRecursoDigital(formData)
         .subscribe({
           next: () => {
             this.loading = false;
             this.messageService.add({ severity:'success', summary:'Ok', detail: dto.id ? 'Actualizado' : 'Creado' });
             this.objetoDialog = false;
             this.listar();
           },
           error: () => {
             this.loading = false;
             this.messageService.add({ severity:'error', summary:'Error', detail:'No se pudo procesar.' });
           }
         });
     }


    async ListaTipo() {
      try {
          const result: any = await this.portalService.tipo_get('conf/tipo-lista').toPromise();
          if (result.status === "0") {
              this.dataTipo = result.data;
          }
      } catch (error) {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
      }

  }
      listar() {
          this.loading = true;
          this.portalService
            .listarRecursosDigitales()
            .subscribe({
              next: (res) => {
                this.loading = false;
                if (res.p_status === 0) {
                  this.data = res.data.filter(d => d.estado === 1);
                } else {
                  this.messageService.add({ severity: 'warn', detail: res.message });
                }
              },
              error: (err) => {
                this.loading = false;
                this.messageService.add({ severity: 'error', detail: 'Error al cargar datos.' });
              }
            });
        }

      cambiarEstadoRegistro(objeto: RecursoDigitalDTO) {
        const accion = objeto.estado === 1 ? 'Desactivar' : 'Activar';
        this.confirmationService.confirm({
          message: `¿Estás seguro(a) de que quieres ${accion}: ${objeto.tipoDescripcion} - ${objeto.titulo}?`,
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'SI',
          rejectLabel: 'NO',
          accept: () => {
            const usuario = this.authService.getEmail();
            this.loading = true;
            const nuevoEstado = objeto.estado === 1 ? 0 : 1;
            this.portalService
              .toggleRecursoDigitalStatus(objeto.id!, nuevoEstado, usuario)
              .subscribe({
                next: (res) => {
                  if (res.p_status === 0) {
                    this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Estado actualizado.' });
                    this.listar();
                  } else {
                    this.messageService.add({ severity: 'warn', detail: res.message });
                  }
                  this.loading = false;
                },
                error: () => {
                  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cambiar el estado.' });
                  this.loading = false;
                }
              });
          }
        });
      }
      showMenu(event: MouseEvent, selectedItem: any) {
        this.selectedItem = selectedItem;
        this.menu.toggle(event);
      }
      onFileSelect(event: any) {
          const file = event.files[0]; // Obtiene el primer archivo seleccionado
         this.selectedFile = file;            // y aquí lo guardas
             this.form.patchValue({ adjunto: file });
             this.messageService.add({ severity: 'info', summary: 'Success', detail: 'Se adjuntó archivo' });
           }
  }
