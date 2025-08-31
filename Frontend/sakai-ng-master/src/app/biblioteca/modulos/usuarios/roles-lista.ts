import { Component, ViewChild, ElementRef } from '@angular/core';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { GenericoService } from '../../services/generico.service';
<<<<<<< HEAD
import { AuthService } from '../../services/auth.service';
=======
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { InputValidation } from '../../input-validation';
import { TemplateModule } from '../../template.module';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
<<<<<<< HEAD
import { forkJoin } from 'rxjs';
=======
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))

@Component({
  selector: 'app-roles-lista',
  standalone: true,
  template: ` <div class="grid">
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
    <p-dialog [(visible)]="objetoModulosDialog" [style]="{width: '50vw'}"  header="Modulos de {{objetoRol?.descripcion}}" [modal]="true" styleClass="p-fluid">
        <ng-template pTemplate="content">
        <p-select appendTo="body" [(ngModel)]="objetoModulo" [options]="dataModulos"
        optionLabel="descripcion" placeholder="Seleccionar" class="col-12 md:col-10 text-left lg:text-left mr-2"/>


        <button pButton type="button" label="Agregar" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="agregarRolModulo()"
                    pTooltip="Agregar" tooltipPosition="bottom" [disabled]="!objetoModulo"></button>


<<<<<<< HEAD
                    <p-table #dt1 [value]="dataRolModulos" dataKey="id" [rows]="10"
=======
                    <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
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
                            <button pButton pRipple icon="pi pi-trash"
							class="p-button-rounded p-button-danger"
							(click)="quitarRolModulo(objeto)"></button>
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
        </ng-template>
    </p-dialog>

<p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
    <p-toast></p-toast>
`,
  imports: [InputValidation, TemplateModule],
  providers: [MessageService, ConfirmationService]
})
export class RolesLista {
  objetoRol!: any;
  submitted!: boolean;
  objetoDialog!: boolean;
  objetoModulosDialog!: boolean;
  msgs: Message[] = [];
  form: FormGroup = new FormGroup({});
<<<<<<< HEAD
=======
  user: any;
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
  selectedItem: any;
  @ViewChild('menu') menu!: Menu;
  items!: MenuItem[];

  titulo: string = "Roles";
  data: ClaseGeneral[] = [];;
  modulo: string = "roles";
  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  dataModulos: ClaseGeneral[] = [];
  idRol: number = 0;
  dataRolModulos: ClaseGeneral[] = [];
<<<<<<< HEAD
  objetoModulo: ClaseGeneral | null = null;
  constructor(
    private genericoService: GenericoService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) { }

  get userId(): number {
    return this.authService.getUserId();
  }
  ngOnInit() {
    this.items = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.editarRegistro(this.selectedItem)
      },
      {
        label: 'Modulos',
        icon: 'pi pi-align-justify',
        command: () => this.permisosModulos(this.selectedItem)
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: () => this.deleteRegistro(this.selectedItem)
      }
    ];

    this.listar();
=======
  objetoModulo!: ClaseGeneral;
  constructor(private genericoService: GenericoService, private fb: FormBuilder, private messageService: MessageService, private confirmationService: ConfirmationService) { }
  ngOnInit() {
    this.user={
			"idusuario":0
		}
    this.items = [

      {
        label: 'Modulos',
        icon: 'pi pi-align-justify',
        command: (event) => this.permisosModulos(this.selectedItem)
      },
    ]
    this.genericoService.conf_event_get('roles/lista-roles')
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
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  showMenu(event: MouseEvent, selectedItem: any) {
    this.selectedItem = selectedItem;
    this.menu.toggle(event);
  }
  listar() {
    this.loading = true;
    this.data = [];
<<<<<<< HEAD
    this.genericoService.roles_get(this.modulo + '/lista-roles')
=======
    this.genericoService.roles_get(this.modulo + '/lista')
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
      .subscribe(
        (result: any) => {
          this.loading = false;
          if (result.status == "0") {
<<<<<<< HEAD
            this.data = result.data.map((rol: any) => ({
              id: rol.idRol,
              descripcion: rol.descripcion
            }));
          }
        },
        (error: HttpErrorResponse) => {
=======
            this.data = result.data;
          }
        }
        , (error: HttpErrorResponse) => {
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
          this.loading = false;
        }
      );
  }
  nuevoRegistro() {
    this.objetoRol = {
      "id": 0,
      "descripcion": ""
    };
    this.formValidar();
    this.submitted = false;
    this.objetoDialog = true;

  }
<<<<<<< HEAD
  editarRegistro(objeto: ClaseGeneral) {
    this.objetoRol = { id: objeto.id, descripcion: objeto.descripcion };
    this.formValidar();
    this.submitted = false;
    this.objetoDialog = true;
  }
=======
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
  formValidar() {
    let dataObjeto = {
      id: this.objetoRol.id,
      descripcion: this.objetoRol.descripcion
    };
    this.form = this.fb.group({
      id: [dataObjeto.id],
      descripcion: [dataObjeto.descripcion, [Validators.required, Validators.maxLength(200), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]]
    });
  }

  cancelar() {
    this.objetoDialog = false;
    this.submitted = false;
  }
  cancelarModulos() {
    this.objetoModulosDialog = false;
  }
  guardar() {
    this.loading = true;
<<<<<<< HEAD
    const id = this.form.get('id')?.value;
    const data = {
      id,
      descripcion: this.form.get('descripcion')?.value,
      usuarioid: this.userId,
      activo: true,
      accion: id && id > 0 ? 'actualizar' : 'registrar'
    };
=======
    const data = { id: this.form.get('id')?.value, descripcion: this.form.get('descripcion')?.value, usuarioid: this.user.idusuario, activo: true, accion: 'registrar' };
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
    this.genericoService.conf_event_post(data, this.modulo + '/registrar')
      .subscribe(result => {
        if (result.p_status == 0) {
          this.objetoDialog = false;
<<<<<<< HEAD
          const detalle = id && id > 0 ? 'Registro actualizado.' : 'Registro guardado.';
          this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: detalle });
=======
          this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro guardado.' });
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
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
<<<<<<< HEAD
  deleteRegistro(objeto: ClaseGeneral) {
    this.confirmationService.confirm({
      message: '¿Estás seguro(a) de que quieres eliminar el rol: ' + objeto.descripcion + ' ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
        this.loading = true;
        this.genericoService.conf_event_delete_1(objeto.id, this.modulo + '/eliminar')
          .subscribe(result => {
            if (result.p_status == 0) {
              this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro eliminado.' });
              this.listar();
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
            }
            this.loading = false;
          },
            (error: HttpErrorResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
              this.loading = false;
            });
      }
    });
  }
=======
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
  permisosModulos(objeto: ClaseGeneral) {
    this.rolModulos(objeto.id);
    this.objetoRol = objeto;
    this.objetoModulosDialog = true;
  }
  guardarModulos() { }

  rolModulos(idrol: number) {
    this.idRol = idrol;
<<<<<<< HEAD
    this.loading = true;
    this.dataRolModulos = [];
    this.dataModulos = [];
    const asignados$ = this.genericoService.roles_get(`${this.modulo}/lista-rolmodulos/${idrol}`);
    const todos$ = this.genericoService.modulos_get();
    forkJoin({ asignados: asignados$, todos: todos$ })
      .subscribe({
        next: ({ asignados, todos }) => {
          const mapModulo = (m: any) => ({
            id: m.idModulo ?? m.idmodulo ?? m.id,
            descripcion: m.descripcion ?? m.modulo ?? m.descripcionModulo,
          });
          if (asignados.status == "0") {
            this.dataRolModulos = asignados.data.map(mapModulo);
          }
          if (todos.status == "0") {
            const existentes = new Set(this.dataRolModulos.map((m: any) => m.id));
            this.dataModulos = todos.data
              .map(mapModulo)
              .filter((m: any) => !existentes.has(m.id));
          }
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
        }
      });
=======
    this.dataRolModulos = [];
    this.genericoService.conf_event_get(`conf/lista-rolmodulos/${idrol}/1`)
      .subscribe(
        (result: any) => {
          this.loading = false;
          if (result.status == "0") {
            this.dataRolModulos = result.data;
          }
        }
        , (error: HttpErrorResponse) => {
          this.loading = false;
        }
      );
    this.dataModulos = [];
    this.genericoService.conf_event_get(`conf/lista-rolmodulos/${idrol}/2`)
      .subscribe(
        (result: any) => {
          this.loading = false;
          if (result.status == "0") {
            this.dataModulos = result.data;
          }
        }
        , (error: HttpErrorResponse) => {
          this.loading = false;
        }
      );
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
  }

  agregarRolModulo() {
    this.confirmationService.confirm({
<<<<<<< HEAD
      message: `¿Estás seguro(a) de que quieres agregar el modulo: ${this.objetoModulo?.descripcion ?? ''} ?`,
=======
      message: '¿Estás seguro(a) de que quieres agregar el modulo: ' + this.objetoModulo.descripcion + ' ?',
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
<<<<<<< HEAD
        const data = { idrol: this.objetoRol?.id, idmodulo: this.objetoModulo?.id };
        this.genericoService.conf_event_post(data, this.modulo + '/agregar-modulo')
          .subscribe(result => {
            this.objetoModulo = null;
=======
        const data = { idrol: this.objetoRol?.id, idmodulo: this.objetoModulo.id, idusuario: this.user.idusuario };
        this.genericoService.conf_event_post(data, this.modulo + '/agregar-modulo')
          .subscribe(result => {
            this.objetoModulo = new ClaseGeneral();
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
            if (result.p_status == 0) {
              this.messageService.add({ severity: 'success', summary: 'Satisfactorio', detail: 'Registro satisfactorio.' });
              this.rolModulos(this.idRol);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puedo realizar el proceso.' });
            }
          }
            , (error: HttpErrorResponse) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde' });
            });
      }
    });
  }
  quitarRolModulo(objeto: ClaseGeneral){

    this.confirmationService.confirm({
        message: '¿Estás seguro(a) de que quieres eliminar el modulo: ' + objeto.descripcion + ' ?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'SI',
        rejectLabel: 'NO',
        accept: () => {
<<<<<<< HEAD
          const data = { idrol: this.objetoRol.id, idmodulo: objeto.id };
          this.genericoService.conf_event_delete(data, this.modulo + '/quitar-modulo')
=======
          const data = { idrol: this.objetoRol.id,idmodulo:objeto.id,idusuario:this.user.idusuario};
          this.genericoService.conf_event_delete(data,this.modulo+'/quitar-modulo')
>>>>>>> c36c32b (chore: ignore build artifacts (target, *.jar))
          .subscribe(result => {
            if (result.p_status == 0) {
              this.messageService.add({severity:'success', summary: 'Satisfactorio', detail: 'Modulo eliminado satisfactorio.'});
              this.rolModulos(this.idRol);
            } else {
              this.messageService.add({severity:'error', summary: 'Error', detail: 'No se puedo realizar el proceso.'});
            }
          }
            , (error: HttpErrorResponse) => {
              this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrio un error. Intentelo más tarde'});
            });
        }
    });
  }
}

