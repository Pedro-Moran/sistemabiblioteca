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
import { Sedes } from '../../interfaces/sedes';
import { GenericoService } from '../../services/generico.service';
import { DropdownModule } from 'primeng/dropdown';

import { PortalHorario } from '../../interfaces/portalHorario';
@Component({
    selector: 'app-horarios',
    standalone: true,
    template: `<div class="grid">
            <div class="col-12">
                <div class="card">
                    <h5>{{titulo}}</h5>
                    <p-toolbar styleClass="mb-6">
        <ng-template #start>
        <div class="flex flex-wrap gap-4">
        <div class="flex flex-col grow basis-0 gap-2">
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSedesFiltro" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>
                        <button pButton type="button" icon="pi pi-search" class="mr-2 p-inputtext-sm"
                        (click)="listar()" [disabled]="loading" pTooltip="Actualizar Lista"
                        tooltipPosition="bottom"></button>
                        </div>

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
                    [globalFilterFields]="['id','sede.descripcion','descripcion','activo']" responsiveLayout="scroll">
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
                                <th pSortableColumn="sede.descripcion" style="min-width:200px">Sede<p-sortIcon field="sede.descripcion"></p-sortIcon></th>
                                <th pSortableColumn="descripcion" style="min-width:200px">Horario<p-sortIcon field="descripcion"></p-sortIcon></th>
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
                                   {{ objeto.sedeDescripcion }}
                                </td>
                                <td>
                                    {{objeto.descripcion}}
                                </td>
                                <td>
                                   {{ objeto.estadoDescripcion || '-' }}
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
                            <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                            <p-select
                              formControlName="sedeId"
                              [options]="dataSede"
                              optionLabel="descripcion"
                              optionValue="id"
                              placeholder="Seleccionar Local/Filial">
                            </p-select>

                           <app-input-validation
                             [form]="form"
                             modelo="sedeId"
                             ver="Local/Filial">
                           </app-input-validation>
                        </div>

                        <div class="flex flex-col gap-2">
                            <label for="descripcion">Descripci&oacute;n</label>
                            <textarea pTextarea id="descripcion" rows="8" formControlName="descripcion"></textarea>
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
            imports: [InputValidation,TemplateModule, DropdownModule],
                providers: [MessageService, ConfirmationService]
})
export class HorariosComponent implements OnInit {
    titulo:string="Horarios";
    data: PortalHorario[]= [];
    modulo:string="horarios";
    loading: boolean = true;
    objeto:PortalHorario=new PortalHorario();
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
    sedeFiltro: Sedes = new Sedes();
    dataSedesFiltro: Sedes[] = [];
    dataSede: Sedes[] = [];

    constructor(private portalService: PortalService,private fb: FormBuilder, private genericoService: GenericoService,
          private router: Router,private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
    async ngOnInit() {
        await this.ListaSede();
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
//         this.user={
//             "idusuario":0
//         }


      await this.ListaTipo();
      this.formValidar();
      await this.listar();

    }

    private async ListaSede() {
        const res: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
        if (res.status === 0) {
          const sedes = (res.data as Sedes[]).filter(s => s.id !== 0);
          this.dataSede = sedes;
          const todas = new Sedes({ id: 0, descripcion: 'Todas las sedes' });
          this.dataSedesFiltro = [todas, ...sedes];
          this.sedeFiltro = todas;
        }
      }
        formValidar(){
          let dataObjeto=JSON.parse(JSON.stringify(this.objeto));
          this.form = this.fb.group({
            id: [dataObjeto.id ],
            sedeId:      [null, Validators.required],
            descripcion: [dataObjeto.descripcion ]
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
      editarRegistro(objeto:PortalHorario){
         this.objeto = objeto;
         this.form.patchValue({
             id:          objeto.id,
             sedeId:      objeto.sedeId,
             descripcion: objeto.descripcion
           });
        this.objetoDialog = true;
      }
      nuevoRegistro(){
        this.objeto = new PortalHorario();
        this.formValidar();
        this.objetoDialog = true;
      }

      cancelar() {
          this.objetoDialog = false;
          this.submitted = false;
      }

      deleteRegistro(objeto: PortalHorario) {
          this.confirmationService.confirm({
              message: '¿Estás seguro(a) de que quieres eliminar el horario de la sede: ' +objeto.sedeDescripcion+'?',
              header: 'Confirmar',
              icon: 'pi pi-exclamation-triangle',
              acceptLabel: 'SI',
              rejectLabel: 'NO',
              accept: () => {
                this.loading=true;
                const data = { id: objeto.id};
                this.portalService.deleteHorario(objeto.id!)
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
      guardar() {
        if (this.form.invalid) return;

        const sedeId = this.form.get('sedeId')!.value;
        const id = this.form.get('id')!.value;

        // Validar que no exista otro horario para la misma sede
        const existe = this.data.some(h => h.sedeId === sedeId && h.id !== id);
        if (existe) {
          this.messageService.add({ severity: 'warn', summary: 'Aviso', detail: 'Ya existe un horario para este local/filial' });
          return;
        }

        const decoded = this.authService.getUser();
        const usuario = decoded.sub; // "admin@gmail.com"

        // Mantener el estado actual al actualizar; por defecto, DISPONIBLE (2)
        const estadoActual = this.objeto.estadoId ?? 2;

        const dto: PortalHorario = {
          id: this.form.get('id')!.value,
          descripcion: this.form.get('descripcion')!.value,
          estadoId: estadoActual,
          sedeId: sedeId,
          usuarioCreacion: usuario,
          usuarioModificacion: usuario
        };

        // 3) Llamas al servicio
        this.loading = true;
        this.portalService.saveHorario(dto).subscribe({
          next: res => {
            this.loading = false;
            if (res.p_status === 0) {
              this.messageService.add({
                severity: 'success',
                summary: '¡Listo!',
                detail: dto.id ? 'Horario actualizado' : 'Horario creado'
              });
              this.objetoDialog = false;
              this.listar();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo procesar.'
              });
            }
          },
          error: () => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error de comunicación con el servidor.'
            });
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
        const sedeId = this.sedeFiltro?.id;
        this.portalService.listarHorarios(sedeId && sedeId > 0 ? sedeId : undefined)
          .subscribe({
            next: res => {
              if (res.p_status === 0) {
                this.data = res.data;
              } else {
                this.messageService.add({ severity: 'warn', detail: res.message });
              }
              this.loading = false;
            },
            error: () => {
              this.messageService.add({ severity: 'error', detail: 'Error al cargar horarios' });
              this.loading = false;
            }
          });
      }
      cambiarEstadoRegistro(n: PortalHorario) {
               // Por ejemplo: si está en 2 lo ponemos en 5, y viceversa
               const nuevoEstadoId = n.estadoId === 2 ? 5 : 2;
      // conviertes a descripción con un ternario
        const nuevoEstadoDesc = nuevoEstadoId === 2
          ? 'DISPONIBLE'
          : 'DESCARTE';
          const decoded = this.authService.getUser();
          const usuario = decoded.sub;
              this.confirmationService.confirm({
                message: `¿Cambiar estado a ${nuevoEstadoDesc}?`,
                acceptLabel: 'SI',
                rejectLabel: 'NO',
                accept: () => {
                   this.loading = true;
                   this.portalService
                     .toggleHorario(n.id, nuevoEstadoId, usuario)
                     .subscribe({
                       next: res => {
                         if (res.p_status === 0) {
                           this.messageService.add({severity:'success', detail:'Estado actualizado'});
                           this.listar();
                         } else {
                           this.messageService.add({severity:'error', detail:'No se pudo actualizar'});
                         }
                         this.loading = false;
                       },
                       error: err => {
                         this.messageService.add({severity:'error', detail:'Error en el servidor'});
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
  }
