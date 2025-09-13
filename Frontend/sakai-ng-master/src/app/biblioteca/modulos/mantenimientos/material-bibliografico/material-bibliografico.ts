import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Message } from 'primeng/message';
import { Table } from 'primeng/table';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { TooltipModule } from 'primeng/tooltip';
import { ModalLibroComponent } from './modal-libro';
import { ModalRevistaComponent } from './modal-revista';
import { ModalOtrosComponent } from './modal-otros';
import { ClaseGeneral } from '../../../interfaces/clase-general';
import { Ejemplar } from '../../../interfaces/detalle';
import { EstadoRecurso } from '../../../interfaces/estado-recurso';
import { Sedes } from '../../../interfaces/sedes';
import { TipoRecurso } from '../../../interfaces/tipo-recurso';
import { AuthService } from '../../../services/auth.service';
import { GenericoService } from '../../../services/generico.service';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';
import { TemplateModule } from '../../../template.module';
import { ModalTesisComponent } from './modal-tesis';
import { BibliotecaDTO  } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { environment } from '../../../../../environments/environment';
import { firstValueFrom } from 'rxjs';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-material-bibliografico',
  standalone: true,
  template: ` <div class="">
                <div class="">
                    <div class="card flex flex-col gap-4 w-full">
                        <h5>{{titulo}}</h5>
                        <p-toolbar styleClass="mb-6">
            <ng-template #start>
            <div class="flex flex-wrap gap-4">

                      <!--  <div class="flex flex-col grow basis-0 gap-2">
                        <label for="sede" class="block text-sm font-medium text-gray-700">Sede</label>
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSedesFiltro" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>-->
                        <div class="flex flex-col grow basis-0 gap-2">
                        <label for="tipoMaterial" class="block text-sm font-medium">Tipo material</label>
                        <p-select [(ngModel)]="tipoRecursoFiltro" [options]="dataTipoRecursoFiltro" optionLabel="descripcion" placeholder="Seleccionar"  (onChange)="listar()"/>

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">

                        <label for="filtro" class="block text-sm font-medium">Buscar por</label>
                        <p-select [(ngModel)]="opcionFiltro" [options]="filtros" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>
                        <div class="flex flex-col grow basis-0 gap-2">
                        <label for="palabra-clave" class="block text-sm font-medium">Palabra clave</label>
                                <input [(ngModel)]="palabraClave"pInputText id="palabra-clave" type="text" placeholder="Palabra clave"/>
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
                 <button pButton type="button" label="Nuevo" icon="pi pi-plus" class="p-button-success mr-2" [disabled]="loading" (click)="nuevoRegistro()"
                                pTooltip="Nuevo registro" tooltipPosition="bottom"></button>


            </ng-template>
        </p-toolbar>

                        <p-table #dt1 [value]="data" dataKey="id" [rows]="10"
                        [(selection)]="selectedRows" selectionMode="multiple"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]" [loading]="loading" [rowHover]="true" styleClass="p-datatable-gridlines" [paginator]="true"
                        [globalFilterFields]="filterFields" responsiveLayout="scroll">
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
                                    <th *ngFor="let col of columns" [pSortableColumn]="col.field">
                                        {{ col.header }}<p-sortIcon [field]="col.field"></p-sortIcon>
                                    </th>
                                    <th style="width: 4rem">Opciones</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-objeto>
                                <tr [pSelectableRow]="objeto">
                                    <td><p-tableCheckbox [value]="objeto"></p-tableCheckbox></td>
                                    <td>
                                        <img [src]="getImageUrl(objeto)" [alt]="objeto.titulo" width="50" class="shadow-lg" />
                                    </td>
                                    <td *ngFor="let col of columns">{{ objeto[col.field] }}</td>
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

<app-modal-libro
   #modalLibro
   [tipoMaterialId]="tipoRecursoFiltro.tipo.id"
   (saved)="onSaved()">
</app-modal-libro>
<app-modal-revista
    #modalRevista
    [tipoMaterialId]="tipoRecursoFiltro.tipo.id"
    (saved)="onSaved()">
</app-modal-revista>
<app-modal-tesis
    #modalTesis
    [tipoMaterialId]="tipoRecursoFiltro.tipo.id"
    (saved)="onSaved()">
</app-modal-tesis>
<app-modal-otros
    #modalOtros
    [tipoMaterialId]="tipoRecursoFiltro.tipo.id"
    (saved)="onSaved()">
</app-modal-otros>


            <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
            <p-toast></p-toast>`,
  imports: [TemplateModule,TooltipModule,ModalRevistaComponent,ModalLibroComponent,ModalTesisComponent,ModalOtrosComponent],
  providers: [MessageService, ConfirmationService]
})
export class MaterialBibliografico {
  titulo: string = "Material bibliográfico";
  data: any[] = [];
  modulo: string = "biblioteca";
  loading: boolean = true;
  objeto: Ejemplar = new Ejemplar();
  submitted!: boolean;
  objetoDialog!: boolean;
  msgs: Message[] = [];
  form: FormGroup = new FormGroup({});
  user: any;
  selectedItem: any;
  selectedRows: any[] = [];
  @ViewChild('menu') menu!: Menu;
  @ViewChild('filter') filter!: ElementRef;
  items!: MenuItem[];
  dataTipoRecurso: TipoRecurso[] = [];
  dataSede: Sedes[] = [];
  dataSedesFiltro: Sedes[] = [];
  sedeFiltro: Sedes = new Sedes();
  dataTipoRecursoFiltro: TipoRecurso[] = [];
  tipoRecursoFiltro: TipoRecurso = new TipoRecurso();
  filtros: ClaseGeneral[] = [];
  opcionFiltro: ClaseGeneral = new ClaseGeneral();
  dataEstadoRecurso: EstadoRecurso[] = [];
  dataTipoEjemplarRecurso: ClaseGeneral[] = [];
  dataAutor: ClaseGeneral[] = [];
  dataEditorial: ClaseGeneral[] = [];
  dataTipoActivo: ClaseGeneral[] = [];
  palabra: any;
  itemsMaterial: any[] = [];
  palabraClave:string="";
  columns: Column[] = [];
  filterFields: string[] = [];

  @ViewChild('modalLibro') modalLibro!: ModalLibroComponent;
  @ViewChild('modalRevista') modalRevista!: ModalRevistaComponent;
  @ViewChild('modalTesis') modalTesis!: ModalTesisComponent;
  @ViewChild('modalOtros') modalOtros!: ModalOtrosComponent;

  constructor(private materialBibliograficoService: MaterialBibliograficoService, private genericoService: GenericoService, private fb: FormBuilder,
    private router: Router, private authService: AuthService, private confirmationService: ConfirmationService, private messageService: MessageService) { }
  private readonly columnConfig: Record<number, Column[]> = {
    1: [
      { field: 'codigoLocalizacion', header: 'Codigo' },
      { field: 'titulo', header: 'Titulo' },
      { field: 'autorPersonal', header: 'Autor' },
      { field: 'ciudadCodigo', header: 'Ciudad' },
      { field: 'editorialPublicacion', header: 'Editorial' },
      { field: 'anioPublicacion', header: 'Año' }
    ],
    2: [
      { field: 'codigoLocalizacion', header: 'Codigo' },
      { field: 'titulo', header: 'Titulo' },
      { field: 'autorInstitucional', header: 'Institución' },
      { field: 'director', header: 'Director' },
      { field: 'editorialPublicacion', header: 'Editorial' },
      { field: 'anioPublicacion', header: 'Año' }
    ],
    3: [
      { field: 'codigoLocalizacion', header: 'Codigo' },
      { field: 'titulo', header: 'Titulo' },
      { field: 'autorPersonal', header: 'Autor' },
      { field: 'director', header: 'Director' },
      { field: 'paisId', header: 'País' },
      { field: 'anioPublicacion', header: 'Año' }
    ],
    4: [
      { field: 'codigoLocalizacion', header: 'Codigo' },
      { field: 'titulo', header: 'Título' },
      { field: 'autorPersonal', header: 'Autor' },
      { field: 'editorialPublicacion', header: 'Revista' },
      { field: 'numeroPaginas', header: 'Páginas' },
      { field: 'linkPublicacion', header: 'Link' }
    ]
  };

  private readonly customHeaders: Record<string, string> = {
    tipoMaterialDescripcion: 'Tipo de material'
  };

  private setColumns(data: any[] = []): void {
    const tipo = this.tipoRecursoFiltro?.tipo?.id ?? 0;
    const base = this.columnConfig[tipo] ?? [
      { field: 'codigoLocalizacion', header: 'Codigo' },
      { field: 'titulo', header: 'Título' },
      { field: 'autorPersonal', header: 'Autor' },
      { field: 'editorialPublicacion', header: 'Editorial' },
      { field: 'numeroPaginas', header: 'Páginas' },
      { field: 'anioPublicacion', header: 'Año' }
    ];

    if (data.length) {
      const available = Object.keys(data[0]).filter(f => f !== 'id');
      let cols: Column[] = base.filter(
        col =>
          available.includes(col.field) &&
          data.some(item => this.hasValue(item[col.field]))
      );
      const used = new Set(cols.map(c => c.field));

      for (const field of available) {
        if (cols.length >= base.length) break;
        if (
          !used.has(field) &&
          !field.toLowerCase().endsWith('id') &&
          data.some(item => this.hasValue(item[field]))
        ) {
          const header = this.customHeaders[field] ?? this.toHeader(field);
          cols.push({ field, header });
        }
      }

      this.columns = cols;
    } else {
      this.columns = base;
    }

    this.filterFields = this.columns.map(col => col.field);
  }

  private toHeader(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, c => c.toUpperCase());
  }

  private hasValue(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }


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
    await this.listarTiposRecurso();
    await this.listaFiltros();
    await this.listar();
    this.formValidar();
  }
  limpiar() {
    this.palabraClave = "";  // Resetea el campo de búsqueda
    this.tipoRecursoFiltro = this.dataTipoRecursoFiltro[0];
    this.opcionFiltro = this.filtros[0];
}
  buscar(event: AutoCompleteCompleteEvent) {
    this.itemsMaterial = [...Array(10).keys()].map(item => event.query + '-' + item);
  }
onSaved(): void {
  this.listar();          // recarga la tabla con los datos actualizados
}

  formValidar() {
    let dataObjeto = JSON.parse(JSON.stringify(this.objeto));
    console.log("ver form: "+ dataObjeto.id);
    let documentosFiltrados;
   /* if (dataObjeto.material.tipoRecurso) {
      // dataObjeto.material.tipoRecurso.tipo=dataObjeto.material.tipoRecurso.tipo;
      this.listarTiposRecurso();!!/*dataObjeto.material.tipoRecurso=dataObjeto.tipoRecurso;
    } else {
      dataObjeto.material.tipoRecurso = null;
      dataObjeto.tipo = null;
    }*/
    this.form = this.fb.group({
      id: [dataObjeto.id],
      buscar: [''],
      sede: [dataObjeto.sede ?? null, [Validators.required]],
      estado: [dataObjeto.estado, [Validators.required]],
      codigo: [dataObjeto.codigo, [Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]],
      nroingreso: [dataObjeto.nroingreso, [Validators.required, Validators.maxLength(20), Validators.pattern('^[0-9]+$')]],

      tipoEjemplar: [dataObjeto.tipoEjemplar, [Validators.required]],
      tipo: [dataObjeto.material?.tipoRecurso?.tipo, [Validators.required]],
      tipoRecurso: [dataObjeto.material?.tipoRecurso, [Validators.required]],
      titulo: [dataObjeto.titulo, [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
      descripcion: [dataObjeto.descripcion, [Validators.required, Validators.maxLength(200), Validators.pattern('^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\\s\\-()]+$')]],
      autor: [dataObjeto.autor, [Validators.required]],
      genero: [dataObjeto.genero, [Validators.required]],
      editorial: [dataObjeto.editorial, [Validators.required]],
      anioPublicacion: [dataObjeto.anioPublicacion, [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+$')]],
      numPaginas: [dataObjeto.numPaginas, [Validators.required, Validators.maxLength(4), Validators.pattern('^[0-9]+$')]],
      tipoActivo: [dataObjeto.tipoActivo, [Validators.required]],
      especialidad: [dataObjeto.especialidad],
      detalles: this.fb.array([])
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
  async editarRegistro(objeto: BibliotecaDTO) {
    const idTipo = objeto.tipoMaterialId ?? this.tipoRecursoFiltro?.id ?? null;

    switch (objeto.tipoMaterialId ?? this.tipoRecursoFiltro?.tipo?.id) {
      case 1: // Libro
        await this.modalLibro.editarRegistro(objeto, idTipo);
        break;
      case 2: // Revista
        await this.modalRevista.editarBiblioteca(objeto, idTipo);
        break;
      case 3: // Tesis
        await this.modalTesis.editarBiblioteca(objeto, idTipo);
        break;
      default: // Otros
        await this.modalOtros.editarBiblioteca(objeto, idTipo);
        break;
    }
}


//   editarRegistro(material: Material) {
//       this.modalLibro.editarRegistro(material);
//       this.formValidar();
//   }

  nuevoRegistro() {
    const idTipo = this.tipoRecursoFiltro?.id ?? null;   // valor del combo padre
    if (this.tipoRecursoFiltro.tipo.id == 1) {
      this.modalLibro.openModal(idTipo);
    } else if (this.tipoRecursoFiltro.tipo.id == 2) {
      this.modalRevista.openModal(idTipo);
    } else if (this.tipoRecursoFiltro.tipo.id == 3) {
      this.modalTesis.openModal(idTipo);
    } else {
      this.modalOtros.openModal(idTipo);
    }
    this.formValidar();
    //this.objetoDialog = true;
  }

  cancelar() {
    this.objetoDialog = false;
    this.submitted = false;
  }

  deleteRegistro(objeto: Ejemplar) {
    this.confirmationService.confirm({
      message: '¿Estás seguro(a) de que quieres eliminar el libro: ' + objeto.titulo + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
        this.loading = true;
        const data = { id: objeto.id };
        this.materialBibliograficoService.delete(objeto.id)
          .subscribe(result => {
            if (result.status == 0) {
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

  deleteSelected() {
    if (!this.selectedRows.length) {
      return;
    }
    this.confirmationService.confirm({
      message: '¿Estás seguro(a) de eliminar los seleccionados?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'SI',
      rejectLabel: 'NO',
      accept: () => {
        const ids = this.selectedRows.map(item => item.id);
        this.loading = true;
        this.materialBibliograficoService.deleteBulkBiblioteca(ids).subscribe({
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
    this.loading = true;
    const data = { id: this.form.get('id')?.value, descripcion: this.form.get('descripcion')?.value, usuarioid: this.user.idusuario, activo: true, accion: 'registrar' };
    this.genericoService.conf_event_post(data, 'api/material-bibliografico/register')
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

  async listarTiposRecurso(): Promise<void> {
    this.loading = true;
    this.dataTipoRecurso = [];
    try {
      const result: any = await firstValueFrom(
        this.genericoService.tiporecurso_get('api/catalogos/tipomaterial/activos')
      );
      if (result.status == 0) {
        this.dataTipoRecurso = result.data;
        this.dataTipoRecursoFiltro = result.data;
        this.tipoRecursoFiltro = this.dataTipoRecursoFiltro[0];
      }
    } catch (error) {
      // manejo silencioso; loading se restablece abajo
    } finally {
      this.loading = false;
    }
  }
  async ListaSede() {
    try {
      const result: any = await this.genericoService.sedes_get('conf/tipo-lista').toPromise();
      if (result.status == 0) {
        this.dataSede = result.data;
        let sedes = [{ id: 0, descripcion: 'TODAS LAS SEDES', activo: true, estado: 1 }, ...this.dataSede];

        this.dataSedesFiltro = sedes;
        this.sedeFiltro = this.dataSedesFiltro[0];
      }
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudieron cargar las sedes' });
    }

  }
//   async listar() {
//     this.loading = true;
//     this.data = [];
//
//     if(this.tipoRecursoFiltro.tipo.id==1){//Libro
//       this.lista_libros();
//     }else if(this.tipoRecursoFiltro.tipo.id==2){//Revista
//       this.lista_revistas();
//     }else{
//       this.lista_otro();
//     }
//     this.loading = false;
//   }

async listar() {
  this.loading = true;
  this.data = [];
  this.setColumns();

  const opcion = this.opcionFiltro?.valor;
  const valor  = this.palabraClave?.trim() || '';

  if (opcion === 'codigoLocalizacion') {
    if (valor && !/^\d+$/.test(valor)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Código inválido',
        detail: 'Ingrese solo números para buscar por código'
      });
      this.loading = false;
      return;
    }
  }

  if (opcion && !valor) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Valor requerido',
      detail: 'Ingrese un valor para realizar la búsqueda'
    });
    this.loading = false;
    return;
  }

  if (valor || opcion) {
    const params: string[] = [];
    if (this.tipoRecursoFiltro?.tipo?.id) {
      params.push(`tipoMaterial=${this.tipoRecursoFiltro.tipo.id}`);
    }
    if (opcion) {
      params.push(`opcion=${opcion}`);
    }
    if (valor) {
      params.push(`valor=${encodeURIComponent(valor)}`);
    }
    params.push('soloEnProceso=false');
    const endpoint = `api/biblioteca/search?${params.join('&')}`;

    this.materialBibliograficoService.search_get(endpoint).subscribe(
      (result: any) => {
        const lista: any[] = Array.isArray(result?.data?.content)
          ? result.data.content
          : Array.isArray(result?.content)
          ? result.content
          : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];
        this.data = lista.filter((b: any) => Number(b.estadoId) === 2);
        this.setColumns(this.data);
        this.loading = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Error en búsqueda:', error);
        this.loading = false;
      }
    );
  } else {
    this.listarPorTipoMaterial(this.tipoRecursoFiltro?.tipo?.id);
  }
}

  private listarPorTipoMaterial(tipo?: number) {
    const base = 'api/biblioteca/search?soloEnProceso=false';
    const endpoint = tipo ? `${base}&tipoMaterial=${tipo}` : base;
    this.materialBibliograficoService.search_get(endpoint).subscribe(
      (result: any) => {
        const lista: any[] = Array.isArray(result?.data?.content)
          ? result.data.content
          : Array.isArray(result?.content)
          ? result.content
          : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];
        this.data = lista.filter((b: any) => Number(b.estadoId) === 2);
        this.setColumns(this.data);
        this.loading = false;
      },
      () => (this.loading = false)
    );
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

  getImageUrl(obj: any): string | undefined {
    if (obj.material?.url) {
      const p = obj.material.url as string;
      return p.startsWith('http') ? p : `${environment.filesUrl}${p}`;
    }
    if (obj.rutaImagen) {
      const base = obj.rutaImagen.startsWith('http')
        ? obj.rutaImagen
        : `${environment.filesUrl}${obj.rutaImagen.startsWith('/') ? '' : '/'}${obj.rutaImagen}`;

      if (obj.nombreImagen) {
        // evita duplicar el nombre si ya viene incluido en rutaImagen
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

  async listaFiltros(): Promise<void> {
    this.loading = true;
    this.data = [];
    try {
      const result: any = await firstValueFrom(
        this.materialBibliograficoService.filtros(this.modulo + '/lista')
      );
      if (result.status == "0") {
        this.filtros = result.data;
        this.opcionFiltro = this.filtros[0];
      }
    } catch (error) {
      // manejo silencioso de errores
    } finally {
      this.loading = false;
    }
  }
}
