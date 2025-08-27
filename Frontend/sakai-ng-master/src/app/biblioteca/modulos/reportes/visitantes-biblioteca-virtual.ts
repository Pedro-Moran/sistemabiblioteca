import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { PrestamosService } from '../../services/prestamos.service';
import { VisitanteBibliotecaVirtualDTO } from '../../interfaces/reportes/visitante-biblioteca-virtual';

@Component({
    selector: 'app-reporte-visitantes-biblioteca',
    standalone: true,
    template: `
        <div class="card flex flex-col gap-4 w-full">
    <h5>{{titulo}}</h5>
    <p-toolbar styleClass="mb-6">
    <div class="flex flex-col w-full gap-4">
                <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                <div class="grid grid-cols-7 gap-4">
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                        <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                        <label for="tipoUsuario" class="block text-sm font-medium">Tipo usuario</label>
                        <p-select [(ngModel)]="tipoUsuarioFiltro" [options]="dataTipoUsuario" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-3 lg:col-span-3">
                        <label for="estado" class="block text-sm font-medium">Base de datos</label>
                        <p-select [(ngModel)]="basededatosFiltro" [options]="dataBasededatos" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-3 lg:col-span-3">
                        <label for="escuela" class="block text-sm font-medium">Escuela</label>
                        <p-select [(ngModel)]="escuelaFiltro" [options]="dataEscuela" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>

                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-3">
                    <label for="programa" class="block text-sm font-medium">Programa</label>
                    <p-select [(ngModel)]="programaFiltro" [options]="dataPrograma" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-1">
                    <label for="ciclo" class="block text-sm font-medium">Ciclo</label>
                    <p-select [(ngModel)]="cicloFiltro" [options]="dataCiclo" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="tipoPrestamo" class="block text-sm font-medium">Fecha inicio</label>
                        <p-datepicker
                            appendTo="body"
                            formControlName="fechaInicio"
                            [ngClass]="'w-full'"
                            [style]="{ width: '100%' }"
                            [readonlyInput]="true"
                            dateFormat="dd/mm/yy">
                        </p-datepicker>
                    </div>
                    <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                    <label for="tipoPrestamo" class="block text-sm font-medium">Fecha fin</label>
                    <p-datepicker
                            appendTo="body"
                            formControlName="fechaFin"
                            [ngClass]="'w-full'"
                            [style]="{ width: '100%' }"
                            [readonlyInput]="true"
                            dateFormat="dd/mm/yy">
                        </p-datepicker>
                    </div>
                    <div class="flex items-end">
            <button
                pButton
                type="button"
                class="p-button-rounded p-button-danger"
                icon="pi pi-search"(click)="reporte()" [disabled]="loading"  pTooltip="Ver reporte" tooltipPosition="bottom">
            </button>
        </div>
                    <div class="flex col-span-1 md:col-span-2 lg:col-span-2">

                    </div>
                </div>

            </div>

    </p-toolbar>
    <p-table [value]="resultados" [paginator]="true" [rows]="10" [loading]="loading">
        <ng-template pTemplate="header">
            <tr>
                <th>Sede</th>
                <th>Tipo documento</th>
                <th>N° documento</th>
                <th>Apellidos y nombres</th>
                <th>Tipo usuario</th>
                <th>Visitas</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
            <tr>
                <td>{{ row.sede }}</td>
                <td>{{ row.tipoDocumento }}</td>
                <td>{{ row.numeroDocumento }}</td>
                <td>{{ row.apellidosNombres }}</td>
                <td>{{ row.tipoUsuario }}</td>
                <td>{{ row.totalVisitas }}</td>
            </tr>
        </ng-template>
    </p-table>
</div>
`,
            imports: [TemplateModule, TooltipModule],
            providers: [MessageService, ConfirmationService]
})
export class ReporteVisitantesBibliotecaVirtual {
    titulo: string = "Visitantes biblioteca virtual - Base de datos";
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    dataPrograma: ClaseGeneral[] = [];
    programaFiltro: ClaseGeneral = new ClaseGeneral();
    dataEscuela: ClaseGeneral[] = [];
    escuelaFiltro: ClaseGeneral = new ClaseGeneral();
    dataAnio: ClaseGeneral[] = [];
    anioFiltro: ClaseGeneral = new ClaseGeneral();
    dataMes: ClaseGeneral[] = [];
    mesFiltro: ClaseGeneral = new ClaseGeneral();
    dataCiclo: ClaseGeneral[] = [];
    cicloFiltro: ClaseGeneral = new ClaseGeneral();
    dataTipoUsuario: ClaseGeneral[] = [];
    tipoUsuarioFiltro: ClaseGeneral = new ClaseGeneral();
    dataBasededatos: ClaseGeneral[] = [];
    basededatosFiltro: ClaseGeneral = new ClaseGeneral();
    dataTipoPrestamo: ClaseGeneral[] = [];
    tipoPrestamoFiltro: ClaseGeneral = new ClaseGeneral();
    loading: boolean = true;
    resultados: VisitanteBibliotecaVirtualDTO[] = [];

    constructor(private svc: PrestamosService, private messageService: MessageService) {}
    async ngOnInit() {
        await this.reporte();
    }
    async reporte() {
        this.loading = true;
        try {
            this.resultados =
                (await firstValueFrom(this.svc.reporteVisitantesBibliotecaVirtual())) ?? [];
        } catch (error: any) {
            const msg = error?.status === 403 ? 'No autorizado para ver el reporte.' : 'No fue posible cargar los datos.';
            this.messageService.add({ severity: 'error', detail: msg });
        } finally {
            this.loading = false;
        }
    }
}
