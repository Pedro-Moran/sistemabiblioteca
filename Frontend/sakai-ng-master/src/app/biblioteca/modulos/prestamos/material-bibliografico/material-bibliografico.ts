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
import { BibliotecaDTO } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { DetalleBibliotecaDTO } from '../../../interfaces/material-bibliografico/DetalleBibliotecaDTO';
import { GrupoBiblioteca, BibliotecaResumen } from '../../../interfaces/material-bibliografico/grupo-biblioteca.model';

interface ReservaUsuario {
  codigoUsuario: string;
  /** Apellidos y nombres del usuario */
  nombreUsuario: string;
  /** Número de documento del usuario */
  documentoUsuario?: string | null;
  /** Correo electrónico del usuario */
  correoUsuario?: string | null;
  tipoPrestamo: string | null;
  cantidad: number;
  detalles: DetalleBibliotecaDTO[];
}
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
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" (ngModelChange)="listar()" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">

                        <label for="sede" class="block text-sm font-medium">Tipo</label>
                        <p-select [(ngModel)]="tipoFiltro" [options]="dataTipo" optionLabel="descripcion" placeholder="Seleccionar" (ngModelChange)="listar()" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                        <label for="tipo-busqueda" class="block text-sm font-medium">Buscar por</label>
                        <p-select [(ngModel)]="campoBusqueda" [options]="opcionesBusqueda" optionLabel="label" optionValue="value" placeholder="Seleccionar" />
                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                        <label for="palabra-clave" class="block text-sm font-medium">Palabra clave</label>
                                <input [(ngModel)]="palabraClave" pInputText id="palabra-clave" type="text" placeholder="Palabra clave"/>
                        </div>
                        <div class="flex items-end">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-danger"
                icon="pi pi-search"(click)="listar()" [disabled]="loading"  pTooltip="Filtrar" tooltipPosition="bottom">
            </button>
        </div><div class="flex items-end">
        <button
        pButton
        type="button"
        class="p-button-rounded p-button-danger"
        icon="pi pi-trash"
        (click)="limpiar()"pTooltip="Limpiar" tooltipPosition="bottom">
    </button>
        </div>

                    </div>
            </ng-template>
            <ng-template #end>


            </ng-template>
        </p-toolbar>

                        <p-table #dt1 [value]="reservadosDetalle"
                                           dataKey="codigoUsuario" [rows]="10"
                        [showCurrentPageReport]="true"
                        [expandedRowKeys]="expandedRows" (onRowExpand)="onRowExpand($event)" (onRowCollapse)="onRowCollapse($event)"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                        [globalFilterFields]="['nombreUsuario','tipoPrestamo']" responsiveLayout="scroll">
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
                                <th style="width: 5rem"></th>
                                    <th ></th>
                                    <th pSortableColumn="nombreUsuario" style="min-width:200px">Apellidos y Nombres<p-sortIcon field="nombreUsuario"></p-sortIcon></th>
                                 <th pSortableColumn="tipo.descripcion" style="width: 8rem">Tipo<p-sortIcon field="tipo.descripcion"></p-sortIcon></th>
                                    <th pSortableColumn="cantidad" style="width: 4rem">Cantidad<p-sortIcon field="cantidad"></p-sortIcon></th>

                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-detalle let-expanded="expanded">
                                <tr>
                                <td>
                <p-button type="button" pRipple [pRowToggler]="detalle" [text]="true" [rounded]="true" [plain]="true" [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'" />
            </td>
                                <td>
                                <i class="pi pi-user" style="font-size: 2.5rem"></i>
                                <!--<img [src]="objeto.foto" [alt]="objeto.nombres" width="50" class="shadow-lg" />-->

                                    </td>
                                <td>{{detalle.nombreUsuario}}
                                    </td>
                                    <td>
                                        {{ getTipoPrestamoDescripcion(detalle.tipoPrestamo) }}

                                    </td>
                                    <td>
                                        {{detalle.cantidad || '—'}}

                                    </td>
                                </tr>
                            </ng-template>
                            <ng-template #expandedrow let-detalle>
                            <tr>
                            <td colspan="8">


                            <p-table
    [value]="detalle.detalles"
    showGridlines
    [tableStyle]="{ 'min-width': '50rem' }"
    dataKey="idDetalleBiblioteca"
    selectionMode="single"
    [(selection)]="detalleSeleccionado">
        <ng-template pTemplate="header">
            <tr>
                <th>Título</th>
                <th>Código</th>
                <th>N.I</th>
                <th>Fecha de reserva</th>
                <th>Prestar</th>
                <th>Cancelar</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-bib>
            <tr [pSelectableRow]="bib">
                <td>{{ bib.biblioteca?.titulo || '-' }}</td>
                <td>{{ bib.biblioteca?.id }}</td>
                <td>{{ bib.numeroIngreso }}</td>
                <td>{{ bib.fechaReserva }}</td>
                <td>
                <p-button icon="pi pi-check" rounded outlined (click)="prestar(bib)" pTooltip="Prestar" tooltipPosition="bottom"/>
                </td>
                <td>
                <p-button icon="pi pi-times" rounded outlined (click)="cancelar(bib)" pTooltip="Cancelar" tooltipPosition="bottom"/>
                </td>
            </tr>
        </ng-template>
</p-table>
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

<app-modal-regularizar #modalRegularizar (saved)="onRegularizado($event)"></app-modal-regularizar>

            <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
    imports: [TemplateModule, TooltipModule,ModalRegularizarComponent],
    providers: [MessageService, ConfirmationService]
})
export class PrestamoMaterialBibliografico implements OnInit {
    titulo: string = "Préstamos";
    data: BibliotecaDTO[] = [];
    detalle: GrupoBiblioteca[] = [];
    modulo: string = "prestamos";
    loading: boolean = true;
    objeto: Ejemplar = new Ejemplar();
    objetoDialog!: boolean;
    msgs: Message[] = [];
    form: FormGroup = new FormGroup({});
    user: any;
    selectedItem: any;
    detalleSeleccionado: DetalleBibliotecaDTO | null = null;
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    dataTipo: Tipo[] = [];
    tipoFiltro: Tipo = new Tipo();
    filtros: ClaseGeneral[] = [];
    opcionFiltro: ClaseGeneral = new ClaseGeneral();
    palabra: any;
    palabraClave: string = "";
    opcionesBusqueda = [
      { label: 'Nombres', value: 'nombre' },
      { label: 'N° Documento', value: 'documento' },
      { label: 'Email', value: 'email' },
    ];
    campoBusqueda: string = 'nombre';
    expandedRows: { [key: string]: boolean } = {};
    reservadosDetalle: ReservaUsuario[] = [];
    grupos: GrupoBiblioteca[] = [];
    private todosDetallesReservados: DetalleBibliotecaDTO[] = [];
      @ViewChild('modalRegularizar') modalRegularizar!: ModalRegularizarComponent;
        @ViewChild('globalFilter') globalFilter!: ElementRef;


    constructor(private prestamosService: PrestamosService,private materialBibliograficoService: MaterialBibliograficoService, private genericoService: GenericoService, private fb: FormBuilder,
        private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
    ngOnInit(): void {
        this.ListaSede();
        this.ListaTipo();
        this.listar();
    }
  private cargarTodosDetallesReservados(): void {
    const sedeId = this.sedeFiltro?.id && this.sedeFiltro.id !== 0 ? this.sedeFiltro.id : undefined;
    const tipoCodigo = this.tipoFiltro?.codigo ? this.tipoFiltro.codigo : undefined;
    this.detalleSeleccionado = null;
    this.loading = true;
    this.materialBibliograficoService.listarDetallesReservados(sedeId, tipoCodigo).subscribe({
      next: (lista: DetalleBibliotecaDTO[]) => {
        this.todosDetallesReservados = lista;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los detalles reservados.'
        });
      }
    });
  }


private agruparPorBiblioteca(
    detalles: DetalleBibliotecaDTO[]
  ): GrupoBiblioteca[] {
    const mapa = new Map<number, GrupoBiblioteca>();

    detalles.forEach((det) => {
      const bibId = det.biblioteca?.id;
      if (bibId == null) {
        return;
      }
      if (!mapa.has(bibId)) {
        // Crea el “resumen” de la cabecera (BibliotecaResumen) partiendo de det.biblioteca:
        const padre = det.biblioteca!;
        const resumen: BibliotecaResumen = {
          id: bibId,
          codigoLocalizacion: padre.codigoLocalizacion ?? null,
          tipoBibliotecaId: padre.tipoBibliotecaId ?? null,
          autorPersonal: padre.autorPersonal ?? null,
          autorInstitucional: padre.autorInstitucional ?? null,
          autorSecundario: padre.autorSecundario ?? null,
          traductor: padre.traductor ?? null,
          director: padre.director ?? null,
          coordinador: padre.coordinador ?? null,
          compilador: padre.compilador ?? null,
          productor: padre.productor ?? null,
          titulo: padre.titulo ?? null,
          tituloAnterior: padre.tituloAnterior ?? null,
          editorialPublicacion: padre.editorialPublicacion ?? null,
          tipoAnioPublicacion: padre.tipoAnioPublicacion ?? null,
          anioPublicacion: padre.anioPublicacion ?? null,
          idEspecialidad: padre.idEspecialidad ?? null,
          isbn: padre.isbn ?? null,
          issn: padre.issn ?? null,
          serie: padre.serie ?? null,
          tipoReproduccion: padre.tipoReproduccion ?? null,
          tipoConteo: padre.tipoConteo ?? null,
          numeroConteo: padre.numeroConteo ?? null,
          numeroConteo2: padre.numeroConteo2 ?? null,
          edicion: padre.edicion ?? null,
          reimpresion: padre.reimpresion ?? null,
          descriptor: padre.descriptor ?? null,
          notaContenido: padre.notaContenido ?? null,
          notaGeneral: padre.notaGeneral ?? null,
          notaResumen: padre.notaResumen ?? null,
          idiomaId: padre.idiomaId ?? null,
          paisId: padre.paisId ?? null,
          ciudadCodigo: padre.ciudadCodigo ?? null,
          periodicidadId: padre.periodicidadId ?? null,
          numeroExpediente: padre.numeroExpediente ?? null,
          juzgado: padre.juzgado ?? null,
          fechaInicioExpediente: padre.fechaInicioExpediente ?? null,
          motivo: padre.motivo ?? null,
          proceso: padre.proceso ?? null,
          materia: padre.materia ?? null,
          observacion: padre.observacion ?? null,
          demandado: padre.demandado ?? null,
          demandante: padre.demandante ?? null,
          rutaImagen: padre.rutaImagen ?? null,
          nombreImagen: padre.nombreImagen ?? null,
          estadoId: padre.estadoId ?? null,
          flasyllabus: padre.flasyllabus ?? null,
          fladigitalizado: padre.fladigitalizado ?? null,
          linkPublicacion: padre.linkPublicacion ?? null,
          numeroPaginas: padre.numeroPaginas ?? null,
          numeroDeIngreso: padre.numeroDeIngreso ?? null,
          sedeId: padre.sedeId ?? null,
          tipoAdquisicionId: padre.tipoAdquisicionId ?? null,
          fechaIngreso: padre.fechaIngreso ?? null,
          costo: padre.costo ?? null,
          numeroFactura: padre.numeroFactura ?? null,
          existencias: padre.existencias ?? null,
          usuarioCreacion: padre.usuarioCreacion ?? null,
          fechaCreacion: padre.fechaCreacion ?? null,
          usuarioModificacion: padre.usuarioModificacion ?? null,
          fechaModificacion: padre.fechaModificacion ?? null,
          tipoMaterialId: padre.tipoMaterialId ?? null
        };

        mapa.set(bibId, {
          biblioteca: resumen,
          detalles: [] as DetalleBibliotecaDTO[]
        });
      }
      // Añade el detalle al grupo correspondiente:
      mapa.get(bibId)!.detalles.push(det);
    });

    return Array.from(mapa.values());
  }
  private agruparPorUsuario(detalles: DetalleBibliotecaDTO[]): ReservaUsuario[] {
    const mapa = new Map<string, ReservaUsuario>();

    detalles.forEach(det => {
      const codigo = det.codigoUsuario ?? 'DESCONOCIDO';
      const nombre = det.usuarioPrestamo ?? det.nombreUsuario ?? '';
      const documento = det.documentoUsuario ?? null;
      const correo = det.correoUsuario ?? null;
      if (!mapa.has(codigo)) {
        mapa.set(codigo, {
          codigoUsuario: codigo,
          nombreUsuario: nombre,
          documentoUsuario: documento,
          correoUsuario: correo,
          tipoPrestamo: det.tipoPrestamo ?? null,
          cantidad: 0,
          detalles: []
        });
      }
      const entry = mapa.get(codigo)!;
      entry.detalles.push(det);
      entry.cantidad = entry.detalles.length;
      entry.tipoPrestamo ??= det.tipoPrestamo ?? null;
      if (!entry.nombreUsuario && nombre) {
        entry.nombreUsuario = nombre;
      }
      if (!entry.documentoUsuario && documento) {
        entry.documentoUsuario = documento;
      }
      if (!entry.correoUsuario && correo) {
        entry.correoUsuario = correo;
      }
    });

    return Array.from(mapa.values());
  }

    async ListaTipo() {
        try {
          const result: any = await this.prestamosService.api_prestamos_tipos('conf/tipo-lista').toPromise();
          if (result.status === "0") {
            // Mapear las descripciones a los códigos usados por el backend
            this.dataTipo = result.data.map((t: any) => ({
              ...t,
              codigo: this.mapDescripcionTipoToCodigo(t.descripcion)
            }));

            this.dataTipo = [{ id: 0, descripcion: 'TODOS', activo: true, codigo: null }, ...this.dataTipo];
            this.tipoFiltro = this.dataTipo[0];
          }
        } catch (error) {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
        }

      }

    limpiar() {
        this.palabraClave = "";  // Resetea el campo de búsqueda
        this.sedeFiltro = this.dataSede[0];
        this.tipoFiltro = this.dataTipo[0];
        this.campoBusqueda = 'nombre';
        this.listar();
    }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.globalFilter.nativeElement.value = '';
  }

  private aplicarFiltros(): void {
    const termino = this.palabraClave?.trim().toLowerCase() || '';

    const filtrados = this.todosDetallesReservados.filter((det) => {
      const valorBusqueda = (() => {
        switch (this.campoBusqueda) {
          case 'documento':
            return det.documentoUsuario;
          case 'email':
            return det.correoUsuario;
          case 'nombre':
          default:
            return det.usuarioPrestamo ?? det.nombreUsuario;
        }
      })()?.toLowerCase() || '';
      return !termino || valorBusqueda.includes(termino);
    });

    this.reservadosDetalle = this.agruparPorUsuario(filtrados);
  }

  getTipoPrestamoDescripcion(tipo?: string | null): string {
    const normalized = tipo ? tipo.trim().toUpperCase().replace(/\s+/g, '_') : '';
    switch (normalized) {
      case 'PRESTAMO_EN_SALA':
      case 'EN_SALA':
        return 'En sala';
      case 'PRESTAMO_A_DOMICILIO':
      case 'A_DOMICILIO':
        return 'A domicilio';
      case 'PRESTAMO_SALA_DOMICILIO':
      case 'EN_SALA_DOMICILIO':
      case 'SALAYDOMICILIO':
      case 'SALA_Y_DOMICILIO':
        return 'Sala y domicilio';
      default:
        return tipo ?? '';
    }
  }

  private mapDescripcionTipoToCodigo(desc: string): string {
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
            const result: any = await this.genericoService
                .sedes_get('api/equipos/sedes')
                .toPromise();
            const sedes = [
                { id: 0, descripcion: 'TODOS', activo: true, estado: 1 },
                ...((Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : []))
            ];
            this.dataSede = sedes;
            this.sedeFiltro = this.dataSede[0];
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudieron cargar sedes' });
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
        this.cargarTodosDetallesReservados();
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

  toggleGrupo(grupo: GrupoBiblioteca) {
    grupo.expandido = !grupo.expandido;
  }

  prestar(detalle: DetalleBibliotecaDTO) {
    this.confirmationService.confirm({
      message: '¿Estás seguro(a) de prestar el ejemplar?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
        this.loading = true;
        this.materialBibliograficoService.prestarDetalle(detalle.idDetalleBiblioteca!).subscribe({
          next: (resp: any) => {
            this.loading = false;
            if (resp.p_status === 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Listo',
                detail: 'Ejemplar prestado.'
              });
              this.cargarTodosDetallesReservados();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'No se pudo prestar',
                detail: 'El servidor devolvió un estado distinto a 0.'
              });
            }
          },
          error: () => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error al comunicarse con el servidor.'
            });
          }
        });
      }
    });
  }

    cancelar(detalle: DetalleBibliotecaDTO) {
      this.confirmationService.confirm({
        message: '¿Estás seguro(a) de cancelar la reserva del ejemplar?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
        this.loading = true;
        this.materialBibliograficoService.cancelarDetalle(detalle.idDetalleBiblioteca!).subscribe({
          next: (resp: any) => {
            this.loading = false;
            if (resp.p_status === 0) {
              this.messageService.add({
                severity: 'success',
                summary: 'Listo',
                detail: 'Reserva cancelada.'
              });
              this.cargarTodosDetallesReservados();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'No se pudo cancelar',
                detail: 'El servidor devolvió un estado distinto a 0.'
              });
            }
          },
          error: () => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error al comunicarse con el servidor.'
            });
          }
        });
      }
    });
  }

  onRowExpand(event: TableRowExpandEvent) {
    // No hacen falta llamadas extra: cada “detalle” ya viene con su “biblioteca” embebida
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    // Si quisieras limpiar algo al colapsar, aquí va
  }

  regularizarPrestamo(detalle: DetalleBibliotecaDTO | null = null) {
    this.modalRegularizar.openModal(detalle);
  }

  onRegularizado(det: DetalleBibliotecaDTO) {
    this.programarPrestamoAutomatico(det);
    this.cargarTodosDetallesReservados();
  }

  private programarPrestamoAutomatico(det: DetalleBibliotecaDTO): void {
    if (!det.idDetalleBiblioteca) {
      return;
    }
    const inicio = this.obtenerFechaInicio(det);
    if (!inicio) {
      return;
    }
    const ejecutar = () => {
      this.materialBibliograficoService
        .prestarDetalle(det.idDetalleBiblioteca!)
        .subscribe(() => this.cargarTodosDetallesReservados());
    };
    const delay = inicio.getTime() - Date.now();
    if (delay <= 0) {
      ejecutar();
    } else {
      setTimeout(ejecutar, delay);
    }
  }

  private obtenerFechaInicio(det: DetalleBibliotecaDTO): Date | null {
    if (det.horaInicio) {
      return new Date(det.horaInicio);
    }
    if (det.fechaPrestamo) {
      return new Date(det.fechaPrestamo);
    }
    return null;
  }

}

