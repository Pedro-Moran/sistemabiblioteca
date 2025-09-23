import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { ReportesFiltroService } from '../../services/reportes-filtro.service';
import { PrestamosService } from '../../services/prestamos.service';
import { IntranetVisitaDTO } from '../../interfaces/reportes/intranet-visita';

@Component({
    selector: 'app-reporte-intranet',
    standalone: true,
    template: `
        <div class="card flex flex-col gap-4 w-full">
    <h5>{{titulo}}</h5>
    <p-toolbar styleClass="mb-6">
    <form [formGroup]="form" class="flex flex-col w-full gap-4">
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
                        <label for="estado" class="block text-sm font-medium">Estado</label>
                        <p-select [(ngModel)]="estadoFiltro" [options]="dataEstado" optionLabel="descripcion" placeholder="Seleccionar" />
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

            </form>

    </p-toolbar>
    <p-table [value]="resultados" [paginator]="true" [rows]="10" [loading]="loading">
        <ng-template pTemplate="header">
            <tr>
                <th>Tipo usuario</th>
                <th>Subtipo usuario</th>
                <th>Programa</th>
                <th>PACPRO</th>
                <th>ID visita</th>
                <th>Situación alumno</th>
                <th>ID bib. vir.</th>
                <th>Hora salida</th>
                <th>Hora ingreso</th>
                <th>Estado usuario</th>
                <th>Fecha registro</th>
                <th>Código usuario</th>
                <th>Visitas registradas</th>
                <th>Sede</th>
                <th>Especialidad</th>
                <th>Ciclo</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
            <tr>
                <td>{{ row.tipoUsuario }}</td>
                <td>{{ row.subTipoUsuario }}</td>
                <td>{{ row.programa }}</td>
                <td>{{ row.pacpro }}</td>
                <td>{{ row.idVisitaBibVir }}</td>
                <td>{{ row.idSituacionAlumno }}</td>
                <td>{{ row.idBibVir }}</td>
                <td>{{ row.horaSalida }}</td>
                <td>{{ row.horaIngreso }}</td>
                <td>{{ row.flgUsuario }}</td>
                <td>{{ row.fechaRegistro }}</td>
                <td>{{ row.codigoUsuario }}</td>
                <td>{{ row.totalVisitas }}</td>
                <td>{{ row.codigoSede }}</td>
                <td>{{ row.codigoEspecialidad }}</td>
                <td>{{ row.ciclo }}</td>
            </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
            <tr>
                <td colspan="16">
                    {{ busquedaRealizada ? 'No se encontraron registros.' : 'Seleccione un rango de fechas para mostrar resultados.' }}
                </td>
            </tr>
        </ng-template>
    </p-table>
</div>
`,
            imports: [TemplateModule, TooltipModule],
            providers: [MessageService, ConfirmationService]
})
export class ReporteIntranet {
    titulo: string = "Visitas fisicas de usuarios";
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    dataPrograma: ClaseGeneral[] = [];
    programaFiltro: ClaseGeneral = new ClaseGeneral();
    dataEstado: ClaseGeneral[] = [];
    estadoFiltro: ClaseGeneral = new ClaseGeneral();
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
    loading: boolean = false;
    resultados: IntranetVisitaDTO[] = [];
    busquedaRealizada: boolean = false;
    form: FormGroup;
    constructor(private filtrosService: ReportesFiltroService, private svc: PrestamosService, private messageService: MessageService, private fb: FormBuilder) {
        this.form = this.fb.group({
            fechaInicio: [null, Validators.required],
            fechaFin: [null, Validators.required],
        });
    }
    async ngOnInit() {
        await this.cargarFiltros();
    }
    private async cargarFiltros() {
        const filtros = await this.filtrosService.cargarFiltros();
        this.dataSede = filtros.sedes;
        this.sedeFiltro = this.dataSede[0];
        this.dataPrograma = filtros.programas;
        this.programaFiltro = this.dataPrograma[0];
        this.dataEscuela = filtros.especialidades;
        this.escuelaFiltro = this.dataEscuela[0];
        this.dataTipoUsuario = filtros.tipoUsuarios;
        this.tipoUsuarioFiltro = this.dataTipoUsuario[0];
        this.dataEstado = filtros.tiposMaterial;
        this.estadoFiltro = this.dataEstado[0];
        this.dataCiclo = filtros.ciclos;
        this.cicloFiltro = this.dataCiclo[0];
    }
    private formatDate(d: Date | null): string | undefined {
        return d ? d.toISOString().split('T')[0] : undefined;
    }
    async reporte() {
        if (this.form.invalid) {
            this.messageService.add({ severity: 'warn', detail: 'Seleccione un rango de fechas.' });
            return;
        }
        this.loading = true;
        this.busquedaRealizada = true;
        const { fechaInicio, fechaFin } = this.form.value;
        const inicio = this.formatDate(fechaInicio);
        const fin = this.formatDate(fechaFin);
        try {
            this.resultados =
                (await firstValueFrom(
                    this.svc.reporteVisitasBibliotecaIntranet(
                        this.sedeFiltro.id,
                        this.tipoUsuarioFiltro.id,
                        this.estadoFiltro.id,
                        this.escuelaFiltro.id,
                        this.programaFiltro.id,
                        this.cicloFiltro.id,
                        inicio,
                        fin
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
