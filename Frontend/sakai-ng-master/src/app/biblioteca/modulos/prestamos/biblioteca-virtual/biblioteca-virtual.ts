import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
import { Table, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { ClaseGeneral } from '../../../interfaces/clase-general';
import { Ejemplar } from '../../../interfaces/detalle';
import { EstadoRecurso } from '../../../interfaces/estado-recurso';
import { Sedes } from '../../../interfaces/sedes';
import { TipoRecurso } from '../../../interfaces/tipo-recurso';
import { AuthService } from '../../../services/auth.service';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
import { BibliotecaVirtualService } from '../../../services/biblioteca-virtual.service';
import { Tipo } from '../../../interfaces/prestamos/tipo';
import { PrestamosService } from '../../../services/prestamos.service';
import { ModalRegularizarComponent } from './modal-regularizar';


@Component({
    selector: 'app-aceptaciones',
    standalone: true,
    template: ` <div class="">
                <div class="">
                    <div class="card flex flex-col gap-4 w-full">
                        <h5>{{titulo}}</h5>
                        <p-toolbar styleClass="mb-6">
    <ng-template #start>
        <div class="flex flex-wrap gap-4">
            <div class="flex flex-col grow basis-0 gap-2">
                <label for="sede" class="block text-sm font-medium">Sede</label>
                <p-select
                                              [(ngModel)]="sedeFiltro"
                                              [options]="dataSedesFiltro"
                                              optionLabel="descripcion"
                                              placeholder="Seleccionar sede"
                                              (onChange)="onSedeChange($event.value)"
                                              [style.width.px]="200"
                                            ></p-select>
            </div>

            <div class="flex flex-col grow basis-0 gap-2">
                <label for="tipo" class="block text-sm font-medium">Tipo</label>
                <p-select [(ngModel)]="tipoFiltro" [options]="dataTipo" optionLabel="descripcion" placeholder="Seleccionar" (ngModelChange)="listar()" />
            </div>

            <div class="flex flex-col grow basis-0 gap-2">
                <label for="tipo-busqueda" class="block text-sm font-medium">Buscar por</label>
                <p-select [(ngModel)]="campoBusqueda" [options]="opcionesBusqueda" optionLabel="label" optionValue="value" placeholder="Seleccionar" />
            </div>

            <div class="flex flex-col grow basis-0 gap-2">
                <label for="palabra-clave" class="block text-sm font-medium">Palabra clave</label>
                <input [(ngModel)]="palabraClave" pInputText id="palabra-clave" type="text" placeholder="Palabra clave" />
            </div>

            <!-- Filtro por discapacidad -->
            <div class="flex flex-col grow basis-0 gap-2">
                <label class="block text-sm font-medium invisible">Placeholder</label>
                <div class="flex items-center gap-2">
                    <p-checkbox
                        id="checkDiscapacidad"
                        name="option"
                        [(ngModel)]="discapacidadFiltro"
                        [binary]="true"
                        (onChange)="listar()"
                    ></p-checkbox>
                    <label for="checkDiscapacidad" class="text-sm">¿Equipos con discapacidad?</label>
                </div>
            </div>

            <div class="flex items-end">
                <button
                    pButton
                    type="button"
                    class="p-button-rounded p-button-danger"
                    icon="pi pi-search"
                    (click)="listar()"
                    [disabled]="loading"
                    pTooltip="Filtrar"
                    tooltipPosition="bottom">
                </button>
            </div>

            <div class="flex items-end">
                <button
                    pButton
                    type="button"
                    class="p-button-rounded p-button-danger"
                    icon="pi pi-trash"
                    (click)="limpiar()"
                    pTooltip="Limpiar"
                    tooltipPosition="bottom">
                </button>
            </div>
        </div>
    </ng-template>

    <ng-template #end>

    </ng-template>
</p-toolbar>


        <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                        [showCurrentPageReport]="true"
                        [expandedRowKeys]="expandedRows" (onRowExpand)="onRowExpand($event)" (onRowCollapse)="onRowCollapse($event)"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                        [globalFilterFields]="['id','nombreUsuario','usuario','codigoUsuario','nombreEquipo','numeroEquipo','ip','estado.descripcion','fechaPrestamo']" responsiveLayout="scroll">
                        <ng-template pTemplate="caption">

                       <div class="flex items-center justify-between">
               <div class="flex gap-2">
                   <p-button [outlined]="true" icon="pi pi-filter-slash" label="Limpiar" (click)="clear(dt1)" />
                   <p-button icon="pi pi-refresh" label="Regularizar" (click)="regularizarPrestamo()" />
               </div>

               <p-iconfield>
                   <input pInputText type="text" placeholder="Filtrar" #filter (input)="onGlobalFilter(dt1, $event)"/>
               </p-iconfield>
           </div>
                       </ng-template>
                            <ng-template pTemplate="header">
                                <tr>
                                 <th ></th>
                                    <th pSortableColumn="nombreUsuario" style="min-width:200px">Usuario<p-sortIcon field="nombreUsuario"></p-sortIcon></th>
                                    <th pSortableColumn="nombreEquipo"  style="width: 4rem">Equipo<p-sortIcon field="nombreEquipo"></p-sortIcon></th>
                                    <th pSortableColumn="numeroEquipo"   style="width: 4rem">N&uacute;mero<p-sortIcon field="numeroEquipo"></p-sortIcon></th>
                                    <th pSortableColumn="ip" style="width: 8rem">Dirección IP<p-sortIcon field="ip"></p-sortIcon></th>
                                    <th pSortableColumn="estado.descripcion" style="width: 8rem">Estado<p-sortIcon field="estado.descripcion"></p-sortIcon></th>
                                    <th pSortableColumn="fechaPrestamo" style="width: 8rem">Fecha de préstamo<p-sortIcon field="fechaPrestamo"></p-sortIcon></th>
                                    <th style="width: 8rem">Prestar</th>
                                    <th style="width: 8rem">Cancelar</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-objeto let-expanded="expanded">
                                <tr>

                                <td>
                                <i class="pi pi-user" style="font-size: 2.5rem"></i>
                                <!--<img [src]="objeto.foto" [alt]="objeto.nombres" width="50" class="shadow-lg" />-->

                                    </td>
                                <td>{{objeto.nombreUsuario || objeto.usuario}}
                                    </td>
                                    <td>
                                        {{objeto.equipo?.nombreEquipo}}

                                    </td>
                                    <td>
                                        {{objeto.equipo?.numeroEquipo}}
                                    </td>
                                    <td>
                                        {{objeto.equipo?.ip}}
                                    </td>
                                    <td>
                                        {{objeto.estado.descripcion}}
                                    </td>
                                    <td>
                                        {{objeto.fechaSolicitud | date:'dd-MM-yyyy'}}
                                    </td>	<td>
                   <p-button icon="pi pi-check" rounded outlined (click)="prestar(objeto)"pTooltip="Prestar" tooltipPosition="bottom"/>

                </td>
                <td>
                <p-button icon="pi pi-times" rounded outlined (click)="cancelar(objeto)"pTooltip="Cancelar" tooltipPosition="bottom"/>
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
<app-modal-regularizar #modalRegularizar (saved)="listar()"></app-modal-regularizar>

            <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
    imports: [TemplateModule, TooltipModule,ModalRegularizarComponent],
    providers: [MessageService, ConfirmationService]
})
export class PrestamoBibliotecaVirtual implements OnInit{
    titulo: string = "Préstamos";
    data: any[] = [];
    detalle: any[] = [];
    modulo: string = "prestamos";
    loading: boolean = true;
    objeto: Ejemplar = new Ejemplar();
    objetoDialog!: boolean;
    msgs: Message[] = [];
    form: FormGroup = new FormGroup({});
    user: any;
    selectedItem: any;
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    dataSedesFiltro: Sedes[] = [];
    dataTipo: Tipo[] = [];
    tipoFiltro: Tipo = new Tipo();
    filtros: ClaseGeneral[] = [];
    opcionFiltro: ClaseGeneral = new ClaseGeneral();
    palabra: any;
    palabraClave: string = "";
    opcionesBusqueda: { label: string; value: string }[] = [
      { label: 'Nombres', value: 'nombre' },
      { label: 'Email', value: 'email' },
      { label: 'N° Documento', value: 'documento' }
    ];
    public campoBusqueda: string = 'nombre';
    discapacidadFiltro: boolean = false;
    expandedRows = {};
    todosPendientes: any[] = [];
    usuarioCache = new Map<string, { nombre: string; correo: string; documento: string }>();

    sedeFilt?: number;
     prestamos: any[] = [];
      @ViewChild('modalRegularizar') modalRegularizar!: ModalRegularizarComponent;


    constructor(private prestamosService: PrestamosService,private materialBibliograficoService: MaterialBibliograficoService, private genericoService: GenericoService, private fb: FormBuilder,
        private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService,private bibliotecaVirtualService: BibliotecaVirtualService) { }
    async ngOnInit() {
        // this.user = this.authService.getUser();
        this.user = {
            "idusuario": 0
        }
        this.ListaSede().then(() => {
              this.onSedeChange(this.sedeFiltro);  // carga inicial con “Todas”
            });
        this.loadPendientes();
        await this.ListaTipo();
        await this.listar();
        this.detalle = [
            {
                "sede": { "id": 1, "descripcion": "Sede A", "activo": true },
                "nombreEquipo": "PC 1",
                "numeroEquipo": "1",
                "ip": "10.10.1.171",
                "fechaReserva": "14/11/2025 17:40:10"
            }
        ]
    }

    loadPendientes() {
        const id = this.sedeFiltro?.id ?? 0;
        const disc = this.discapacidadFiltro ? true : undefined;
        this.loading = true;
        this.bibliotecaVirtualService
          .listarPendientes(id, disc)
          .subscribe({
            next: resp => {
              this.todosPendientes = resp.data;
              this.completarNombres(this.todosPendientes)
                .finally(() => {
                  this.aplicarFiltros();
                  this.loading = false;
                });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                detail: 'Error al cargar reservas.'
              });
              this.loading = false;
            }
          });
      }

    private async completarNombres(prestamos: any[]): Promise<void> {
        const codigos = Array.from(
            new Set(
                prestamos
                    .map((p: any) => p.codigoUsuario)
                    .filter((c: string) => c && !this.usuarioCache.has(c))
            )
        );

        const promesas = codigos.map(async codigo => {
            const usuarios = await this.materialBibliograficoService
                .listarUsuarios(codigo)
                .toPromise();
            const u = usuarios?.[0];
            const nombre = u
                ? (
                      [u.apellidoPaterno, u.apellidoMaterno, u.nombreUsuario || u.nombres]
                          .filter(Boolean)
                          .join(' ')
                          .trim() || u.displayname || ''
                  )
                : '';
            const correo = u?.email || '';
            const documento = String(
                u?.numerodocumento || u?.numDocumento || u?.numeroDocumento || ''
            );
            this.usuarioCache.set(codigo, { nombre, correo, documento });
        });
        await Promise.all(promesas);

        prestamos.forEach(p => {
            const info = this.usuarioCache.get(p.codigoUsuario);
            if (info) {
                if (!p.nombreUsuario) {
                    p.nombreUsuario = info.nombre;
                }
                if (!p.correoUsuario) {
                    p.correoUsuario = info.correo;
                }
                if (!p.documentoUsuario && info.documento) {
                    p.documentoUsuario = info.documento;
                }
            }
        });
    }
    async ListaTipo() {
        try {
          const result: any = await this.prestamosService.api_prestamos_tipos('conf/tipo-lista').toPromise();
          if (result.status === "0") {
            const tipos = result.data.map((t: any) => ({
              ...t,
              codigo: this.mapDescripcionTipoToCodigo(t.descripcion)
            }));
            this.dataTipo = tipos.filter((t: any) => t.codigo !== 'PRESTAMO_SALA_DOMICILIO');
            this.dataTipo = [{ id: 0, descripcion: 'Sala y domicilio', activo: true, codigo: null }, ...this.dataTipo];
            this.tipoFiltro = this.dataTipo[0];
          }
        } catch (error) {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }

      }
  filtrarPorSede() {
        if (this.sedeFiltro && this.sedeFiltro.id) {
      this.bibliotecaVirtualService.filtrarPorSede(this.sedeFiltro.id).subscribe(
              (result: any) => {
                this.loading = false;
                if (result.status == 0) {
                  this.data = result.data;
                }
              }
              , (error: HttpErrorResponse) => {
                this.loading = false;
              }
            );
        } else {
          this.listar();
        }
      }

    limpiar() {
        this.palabraClave = '';
        this.tipoFiltro = this.dataTipo[0];
        this.campoBusqueda = 'nombre';
        this.discapacidadFiltro = false;
        this.listar();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    aplicarFiltros() {
        const termino = this.palabraClave?.trim().toLowerCase() || '';
        const tipoCodigo = this.tipoFiltro?.codigo || null;
        const requiereDiscapacidad = this.discapacidadFiltro;
        this.data = this.todosPendientes.filter(item => {
            const itemCodigo = this.mapDescripcionTipoToCodigo(item.tipoPrestamo);
            const coincideTipo = !tipoCodigo || itemCodigo === tipoCodigo;
            const valorBusqueda = (() => {
                switch (this.campoBusqueda) {
                    case 'email':
                        return String(item.correoUsuario || item.email || '');
                    case 'documento':
                        return String(item.documentoUsuario || item.numeroDocumento || '');
                    default:
                        return String(item.nombreUsuario || item.usuario || item.codigoUsuario || '');
                }
            })().toLowerCase();
            const coincideTexto = !termino || valorBusqueda.includes(termino);
            const coincideDiscapacidad = !requiereDiscapacidad || this.tieneDiscapacidad(item);
            return coincideTipo && coincideTexto && coincideDiscapacidad;
        });
    }

    private tieneDiscapacidad(item: any): boolean {
        const val =
            item?.equipo?.equipoDiscapacidad ??
            item?.equipo?.discapacidad ??
            item?.equipoDiscapacidad ??
            item?.discapacidad;
        if (typeof val === 'boolean') {
            return val;
        }
        if (val === undefined || val === null) {
            return false;
        }
        const texto = String(val).trim().toUpperCase();
        return ['1', 'S', 'SI', 'TRUE'].includes(texto);
    }

    private mapDescripcionTipoToCodigo(desc?: string | null): string | null {
        if (!desc) return null;
        const normalized = desc
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .trim().toUpperCase().replace(/\s+/g, '_');
        switch (normalized) {
            case 'EN_SALA':
            case 'PRESTAMO_EN_SALA':
                return 'PRESTAMO_EN_SALA';
            case 'A_DOMICILIO':
            case 'PRESTAMO_A_DOMICILIO':
                return 'PRESTAMO_A_DOMICILIO';
            case 'SALA_Y_DOMICILIO':
            case 'EN_SALA_DOMICILIO':
            case 'PRESTAMO_SALA_DOMICILIO':
            case 'SALAYDOMICILIO':
                return 'PRESTAMO_SALA_DOMICILIO';
            default:
                return normalized;
        }
    }

    async ListaSede() {
            try {
              const result: any = await this.genericoService.sedes_get('api/equipos/sedes').toPromise();
              if (result.status === 0) {
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
    listaFiltros() {
        this.loading = true;
        this.data = [];
        this.materialBibliograficoService.filtros(this.modulo + '/lista')
            .subscribe(
                (result: any) => {
                    this.loading = false;
                    if (result.status == "0") {
                        this.filtros = result.data;
                        this.opcionFiltro = this.filtros[0];
                    }
                }
                , (error: HttpErrorResponse) => {
                    this.loading = false;
                }
            );
    }

      listar() {
        this.aplicarFiltros();
      }
    cambiarEstadoRegistro(objeto: Ejemplar) {
        let estado = "";
        if (objeto.activo) {
            estado = "Desactivar";
        } else {
            estado = "Activar"
        }
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de que quieres cambiar el estado: ' + objeto.codigo + ' a ' + estado + '?',
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

        prestar(objeto: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de prestar el equipo de cómputo?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
              this.loading = true;
//               const dto = {
//                   id: objeto.id,
//                   aprobar: true,
//                   tipoPrestamo: null     // ya no usas modal, así que lo dejas null
//                 };
              this.prestamosService.procesarPrestamo(objeto.id, true)
                .subscribe({
                      next: () => {
                        this.messageService.add({
                          severity: 'success',
                          summary: 'Satisfactorio',
                          detail: 'Registro prestado.'
                        });
                        this.listar();
                      },
                      error: (err: HttpErrorResponse) => {
                        this.messageService.add({
                          severity: 'error',
                          summary: 'Error',
                          detail: 'Ocurrió un error. Intenta más tarde.'
                        });
                      }
                    })
                    .add(() => this.loading = false);
                }
              });
            }

    cancelar(objeto: any) {
        this.confirmationService.confirm({
            message: '¿Estás seguro(a) de querer cancelar la reserva del equipo de cómputo?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'SI',
            rejectLabel: 'NO',
            accept: () => {
                  this.loading = true;
                  this.prestamosService.procesarPrestamo(objeto.id, false)
                    .subscribe({
                      next: (res: any) => {
                        if (res.status === '0') {
                          this.messageService.add({
                            severity: 'success',
                            summary:  'Satisfactorio',
                            detail:   'Reserva cancelada.'
                          });
                          this.listar();
                        } else {
                          this.messageService.add({
                            severity: 'error',
                            summary:  'Error',
                            detail:   'No se pudo realizar el proceso.'
                          });
                        }
                        this.loading = false;
                      },
                      error: () => {
                        this.messageService.add({
                          severity: 'error',
                          summary:  'Error',
                          detail:   'Ocurrió un error. Intenta más tarde.'
                        });
                        this.loading = false;
                      }
                    });
                }
              });
            }


    onRowExpand(event: TableRowExpandEvent) {
    }

    onRowCollapse(event: TableRowCollapseEvent) {
    }
    regularizarPrestamo(){
        this.modalRegularizar.openModal();
    }
    onSedeChange(sede: Sedes) {
      this.sedeFiltro = sede;
      this.loadPendientes();
    }
}


