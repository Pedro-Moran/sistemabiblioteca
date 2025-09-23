import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { PrestamosService } from '../../services/prestamos.service';
import { EquipoUsoTiempoDTO } from '../../interfaces/reportes/equipo-uso-tiempo';
import { ReportesFiltroService } from '../../services/reportes-filtro.service';

@Component({
    selector: 'app-reporte-usotiempo-biblioteca',
    standalone: true,
    template: `
        <div class="card flex flex-col gap-4 w-full">
            <h5>{{ titulo }}</h5>
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
                        <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                            <label for="ciclo" class="block text-sm font-medium">Ciclo</label>
                            <p-select [(ngModel)]="cicloFiltro" [options]="dataCiclo" optionLabel="descripcion" placeholder="Seleccionar" />
                        </div>
                        <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                            <label for="escuela" class="block text-sm font-medium">Escuela</label>
                            <p-select [(ngModel)]="escuelaFiltro" [options]="dataEscuela" optionLabel="descripcion" placeholder="Seleccionar" />
                        </div>

                        <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                            <label for="tipoPrestamo" class="block text-sm font-medium">Fecha inicio</label>
                            <p-datepicker appendTo="body" [(ngModel)]="fechaInicio" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" dateFormat="dd/mm/yy"></p-datepicker>
                        </div>
                        <div class="flex flex-col gap-2 col-span-3 md:col-span-2 lg:col-span-2">
                            <label for="tipoPrestamo" class="block text-sm font-medium">Fecha fin</label>
                            <p-datepicker appendTo="body" [(ngModel)]="fechaFin" [ngClass]="'w-full'" [style]="{ width: '100%' }" [readonlyInput]="true" dateFormat="dd/mm/yy"></p-datepicker>
                        </div>
                        <div class="flex items-end">
                            <button pButton type="button" class="p-button-rounded p-button-danger" icon="pi pi-search" (click)="reporte()" [disabled]="loading" pTooltip="Ver reporte" tooltipPosition="bottom"></button>
                        </div>
                        <div class="flex col-span-1 md:col-span-2 lg:col-span-2"></div>
                    </div>
                </div>
            </p-toolbar>
            <p-table [value]="resultados" [paginator]="true" [rows]="10" [loading]="loading" scrollable="true" scrollHeight="400px">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Sede</th>
                        <th>Equipo</th>
                        <th>Número PC</th>
                        <th>Préstamos</th>
                        <th>Horas prestadas</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-row>
                    <tr>
                        <td>{{ row.sede }}</td>
                        <td>{{ row.nombreEquipo }}</td>
                        <td>{{ row.numeroEquipo }}</td>
                        <td>{{ row.cantidadPrestamos }}</td>
                        <td>{{ row.horasPrestado | number:'1.2-2' }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </div>
    `,
    imports: [TemplateModule, TooltipModule],
    providers: [MessageService, ConfirmationService]
})
export class ReporteUsoTiempoBiblioteca {
    titulo: string = "Uso de tiempo de biblioteca virtual";
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    dataPrograma: ClaseGeneral[] = [];
    programaFiltro: ClaseGeneral = new ClaseGeneral();
    dataTipoMaterial: ClaseGeneral[] = [];
    tipoMaterialFiltro: ClaseGeneral = new ClaseGeneral();
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
    dataEstado: ClaseGeneral[] = [];
    estadoFiltro: ClaseGeneral = new ClaseGeneral();
    dataTipoPrestamo: ClaseGeneral[] = [];
    tipoPrestamoFiltro: ClaseGeneral = new ClaseGeneral();
    dataEspecialidad: ClaseGeneral[] = [];
    especialidadFiltro: ClaseGeneral = new ClaseGeneral();
    fechaInicio?: Date;
    fechaFin?: Date;
    nroIngreso: string = '';
    tipo: number = 1;
    loading: boolean = true;
    resultados: EquipoUsoTiempoDTO[] = [];

    constructor(
        private svc: PrestamosService,
        private messageService: MessageService,
        private filtrosService: ReportesFiltroService
    ) {}
    async ngOnInit() {
        await this.cargarFiltros();
        await this.reporte();
    }
    private async cargarFiltros() {
        const [sedes, tipoUsuarios, ciclos, especialidades] = await Promise.all([
            this.filtrosService.getSedes(),
            this.filtrosService.getTiposUsuario(),
            this.filtrosService.getCiclos(),
            this.filtrosService.getEspecialidades()
        ]);

        this.dataSede = sedes;
        this.dataTipoUsuario = tipoUsuarios;
        this.dataCiclo = ciclos;
        this.dataEscuela = especialidades;

        this.sedeFiltro = this.dataSede[0];
        this.tipoUsuarioFiltro = this.dataTipoUsuario[0];
        this.cicloFiltro = this.dataCiclo[0];
        this.escuelaFiltro = this.dataEscuela[0];
    }
    private formatDate(d?: Date): string | undefined {
        return d ? d.toISOString().split('T')[0] : undefined;
    }

    async reporte() {
        this.loading = true;
        try {
            this.resultados =
                (await firstValueFrom(
                    this.svc.reporteUsoTiempoBiblioteca(
                        this.formatDate(this.fechaInicio),
                        this.formatDate(this.fechaFin),
                        this.sedeFiltro?.id,
                        this.tipoUsuarioFiltro?.id,
                        this.cicloFiltro?.id,
                        this.escuelaFiltro?.id
                    )
                )) ?? [];
        } catch (error: any) {
            const msg = error?.status === 403 ? 'No autorizado para ver el reporte.' : 'No fue posible cargar los datos.';
            this.messageService.add({ severity: 'error', detail: msg });
        } finally {
            this.loading = false;
        }
    }
}
