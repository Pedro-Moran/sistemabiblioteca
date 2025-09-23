import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { TemplateModule } from '../../template.module';
import { MessageService, MenuItem } from 'primeng/api';
import { GenericoService } from '../../services/generico.service';
import { Table } from 'primeng/table';
import { Menu } from 'primeng/menu';
import { TipoRecurso } from '../../interfaces/tipo-recurso';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PortalDetalleEjemplar } from '../portal-landing/components/portal-detalle-ejemplar';
import { PortalDisponibleEjemplar } from '../portal-landing/components/portal-disponible-ejemplar';
import { BibliotecaDTO } from '../../interfaces/material-bibliografico/biblioteca.model';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'catalogo-lista',
    template: `

        <div id="catalogo-lista" class="py-6 px-6 lg:px-20 mx-0 my-12 lg:mx-20">
            <div class="text-center">
                <span class="text-muted-color text-2xl">Encuentra libros, art&iacute;culos y m&aacute;s recursos con nuestra herramienta de b&uacute;squeda</span>
            </div>

            <div class="my-4">
            <p-toolbar styleClass="mb-6">
            <div class="flex flex-wrap w-full gap-4">




        <div class="flex flex-col flex-1 gap-2">
            <label for="palabra-clave" class="block text-sm font-medium text-gray-700">Busqueda</label>
            <input pInputText id="palabra-clave" type="text" placeholder="Buscar Libros, Articulos y más" [(ngModel)]="palabraClave"/>
        </div>

        <div class="flex items-end">
            <button pButton
                    type="button"
                    class="p-button-rounded p-button-danger"
                    icon="pi pi-search"
                    (click)="listar()"
                    [disabled]="loading"
                    pTooltip="Filtrar"
                    tooltipPosition="bottom">
            </button>
            <button pButton
                    type="button"
                    class="p-button-rounded p-button-danger mx-2"
                    icon="pi pi-refresh"
                    (click)="listar()"
                    [disabled]="loading"
                    pTooltip="Filtrar"
                    tooltipPosition="bottom">
            </button>
        </div>
    </div>
    <div class="flex flex-wrap w-full gap-4">
    <div class="flex flex-col flex-1 gap-2">
            <label for="sede" class="block text-sm font-medium text-gray-700">Local</label>
            <p-select [(ngModel)]="sedeFiltro"
                      [options]="dataSedeFiltro"
                      optionLabel="descripcion"
                      placeholder="Seleccionar"
                      (onChange)="listar()"/>
        </div>
        <div class="flex flex-col flex-1 gap-2">
            <label for="tipo-material" class="block text-sm font-medium text-gray-700">Coleccion</label>
            <p-select [(ngModel)]="tipoRecursoFiltro"
                      [options]="dataTipoRecursoFiltro"
                      optionLabel="descripcion"
                      placeholder="Seleccionar"
                      (onChange)="listar()"/>
        </div>

        <div class="flex flex-col flex-1 gap-2">
            <label for="buscar-por" class="block text-sm font-medium text-gray-700">Buscar por</label>
            <p-select [(ngModel)]="opcionFiltro"
                      [options]="filtros"
                      optionLabel="descripcion"
                      placeholder="Seleccionar"/>
        </div>

    </div>


    <ng-template #end >


    </ng-template>
    </p-toolbar>
    <div *ngIf="loading" class="flex justify-center py-4">
        <p-progressSpinner></p-progressSpinner>
    </div>
            <p-table *ngIf="!loading" #dt1 [value]="data" dataKey="id" [rows]="10" [showCurrentPageReport]="true"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                    [rowsPerPageOptions]="[10, 25, 50]" [rowHover]="true"
                    styleClass="p-datatable-gridlines" [paginator]="true"
                    [globalFilterFields]="['codigoLocalizacion','titulo','autor','anioPublicacion']"
                    responsiveLayout="scroll">
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
                            <th style="width: 8rem" pSortableColumn="urlPortada">PORTADA <p-sortIcon field="urlPortada"></p-sortIcon></th>
                            <th style="width: 4rem" pSortableColumn="codigoLocalizacion">CODIGO <p-sortIcon field="codigoLocalizacion"></p-sortIcon></th>
                            <th style="min-width:200px" pSortableColumn="titulo"> TITULO <p-sortIcon field="titulo"></p-sortIcon></th>
                            <th style="min-width:200px" pSortableColumn="autor">AUTOR <p-sortIcon field="autor"></p-sortIcon></th>
                            <th style="width: 4rem" pSortableColumn="anioPublicacion">AÑO <p-sortIcon
                                    field="anioPublicacion"></p-sortIcon></th>
                            <th style="width: 10rem">Opciones</th>

                        </tr>
                    </ng-template>
                    <ng-template pTemplate="body" let-objeto>
                        <tr>
                            <td>
                            <!--<img class="block xl:block mx-auto rounded w-full" [src]="objeto.urlPortada" [alt]="objeto.titulo" />-->
                           <img [src]="objeto.urlPortada" [alt]="objeto.titulo" width="70" class="shadow-lg rounded" />

                            </td>
                            <td>
                                {{ objeto.codigoLocalizacion }}
                            </td>
                            <td>
                                {{objeto.titulo}}
                            </td>
                            <td>
                                {{ objeto.autor }}
                            </td>
                            <td>
                                {{objeto.anioPublicacion}}
                            </td>
                            <td class="text-center">
                            <div class="flex flex-wrap justify-center gap-2">
                                <p-button outlined icon="pi pi-search-plus" pTooltip="Más información" tooltipPosition="bottom" (click)="masInformacion(objeto)"/>
                                <p-button icon="pi pi-map-marker" pTooltip="Disponibilidad" tooltipPosition="bottom" (click)="disponible(objeto)"/>
                                <!--<p-button icon="pi pi-calendar" pTooltip="Reservar" tooltipPosition="bottom" (click)="reservar()"/>-->
                            </div>



                            </td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="emptymessage">
                        <tr>
                            <td colspan="11">No se encontraron registros.</td>
                        </tr>
                    </ng-template>
                    <ng-template pTemplate="loadingbody">
                        <tr>
                            <td colspan="11">Cargando datos. Espere por favor.</td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>

        </div>
        <portal-detalle-ejemplar [objeto]="objeto" [displayDialog]="displayDialog"/>
        <portal-disponible-ejemplar [objeto]="objeto" [displayDialog]="displayDisponibleDialog"/>
    `,
    imports: [TemplateModule, PortalDetalleEjemplar, PortalDisponibleEjemplar, ProgressSpinnerModule],
    providers: [MessageService]
})
export class CatalogoLista implements OnInit {
    modulo: string = "catalogo";
    data: (BibliotecaDTO & { autor: string })[] = [];
    @ViewChild('menu') menu!: Menu;
    @ViewChild('filter') filter!: ElementRef;
    items: MenuItem[] | undefined;
    user: any;
    loading: boolean = true;

    selectedItem: any = null;
    dataSedeFiltro: ClaseGeneral[] = [];
    sedeFiltro: ClaseGeneral = new ClaseGeneral();
    tipoRecursoFiltro: TipoRecurso = new TipoRecurso();
    dataTipoRecursoFiltro: TipoRecurso[] = [];
    opcionFiltro: ClaseGeneral = new ClaseGeneral();
    filtros: ClaseGeneral[] = [];
    displayDialog: boolean = false;
    displayDisponibleDialog: boolean = false;
    objeto:any;
    palabraClave: string = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private materialBibliograficoService: MaterialBibliograficoService,
        private genericoService: GenericoService,
        private messageService: MessageService,
        private cd: ChangeDetectorRef
    ) {}
    async ngOnInit() {
        // this.user = this.authService.getUser();

        this.user = {
            "idusuario": 0
        }
        this.items = [
        ]
        await this.listarTiposRecurso();
        await this.listaFiltros();
        await this.ListaSede();
        this.palabraClave = this.route.snapshot.queryParamMap.get('valor') ?? '';
        await this.listar();
    }

    async ListaSede() {
        try {
            const result: any = await this.genericoService
                .sedes_get('api/equipos/sedes')
                .toPromise();
            const sedes = [{ id: 0, descripcion: 'TODOS', activo: true, estado: 1 },
                ...((Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : []))];
            this.dataSedeFiltro = sedes;
            this.sedeFiltro = this.dataSedeFiltro[0];
        } catch (error) {
            console.log(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar sedes' });
        }

    }

    listaFiltros() {
        this.materialBibliograficoService
            .filtros(this.modulo + '/lista')
            .subscribe(
                (result: any) => {
                    if (result.status == "0") {
                        this.filtros = result.data;
                        this.opcionFiltro = this.filtros[0];
                    }
                }
            );
    }

    async listarTiposRecurso() {
        try {
            const result: any = await this.genericoService
                .tiporecurso_get('api/catalogos/tipomaterial/activos')
                .toPromise();

            const data = Array.isArray(result?.data)
                ? result.data.map((r: any) => ({
                    id: r.tipo?.id,
                    descripcion: r.descripcion,
                    activo: r.activo
                }))
                : Array.isArray(result)
                    ? result
                    : [];

            const filtro = [{ id: 0, descripcion: 'TODOS', activo: true, estado: 1 }, ...data];
            this.dataTipoRecursoFiltro = filtro;
            this.tipoRecursoFiltro = this.dataTipoRecursoFiltro[0];
        } catch (error) {
            console.log(error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ocurrió un error. No se pudo cargar tipos de material'
            });
        }
    }


listar() {
  const valor  = this.palabraClave?.trim() || '';
  const opcion = this.opcionFiltro.valor || undefined;

  if (opcion === 'codigoLocalizacion') {
    if (valor && !/^\d+$/.test(valor)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Código inválido',
        detail: 'Ingrese solo números para buscar por código'
      });
      return;
    }
  }

  if (opcion && !valor) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Valor requerido',
      detail: 'Ingrese un valor para realizar la búsqueda'
    });
    return;
  }

  this.loading = true;
  this.data = [];
  this.materialBibliograficoService
    .catalogo(
      valor,
      this.sedeFiltro.id,
      this.tipoRecursoFiltro.id,
      opcion
    )
    .subscribe(
      list => {
        this.data = list.map(b => ({
          ...b,
          autor: b.autorPersonal ?? b.autorInstitucional ?? b.autorSecundario ?? '',
          urlPortada: this.getImageUrl(b)
        }));
        this.loading = false;
      },
      () => (this.loading = false)
    );
}

getImageUrl(obj: BibliotecaDTO): string | undefined {
  if ((obj as any).material?.url) {
    const p = (obj as any).material.url as string;
    return p.startsWith('http') ? p : `${environment.filesUrl}${p}`;
  }
  if (obj.rutaImagen) {
    const base = obj.rutaImagen.startsWith('http')
      ? obj.rutaImagen
      : `${environment.filesUrl}${obj.rutaImagen.startsWith('/') ? '' : '/'}${obj.rutaImagen}`;
    if (obj.nombreImagen) {
      if (base.endsWith(obj.nombreImagen)) {
        return base;
      }
      const sep = base.endsWith('/') ? '' : '/';
      return base + sep + obj.nombreImagen;
    }
    return base;
  }
  return undefined;
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
    nuevoRegistro() { }
    reservar(){
        this.router.navigate(['/reservar']);
    }
    masInformacion(obj: BibliotecaDTO){
      this.objeto = obj;
      this.displayDialog = false;
      this.cd.detectChanges();
      setTimeout(() => {
          this.displayDialog = true;
          this.cd.detectChanges();
      }, 50);

    }
    disponible(obj: BibliotecaDTO){
        this.objeto = obj;
        this.displayDisponibleDialog = false;
        this.cd.detectChanges();
        setTimeout(() => {
            this.displayDisponibleDialog = true;
            this.cd.detectChanges();
        }, 50);
    }
}
