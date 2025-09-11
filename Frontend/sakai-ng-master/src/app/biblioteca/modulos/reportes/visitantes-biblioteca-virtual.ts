import { Component } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { PrestamosService } from '../../services/prestamos.service';
import { VisitanteBibliotecaVirtualDTO } from '../../interfaces/reportes/visitante-biblioteca-virtual';
import { ReportesFiltroService } from '../../services/reportes-filtro.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-reporte-visitantes-biblioteca',
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

            </form>

    </p-toolbar>
    <p-table [value]="resultados" [paginator]="true" [rows]="10" [loading]="loading">
        <ng-template pTemplate="header">
            <tr>
                <th>Sede</th>
                <th>Base de datos</th>
                <th>Código</th>
                <th>Apellidos y nombres</th>
                <th>Tipo usuario</th>
                <th>Especialidad</th>
                <th>Programa</th>
                <th>Ciclo</th>
                <th>Correo</th>
                <th>Total visitas</th>
            </tr>
        </ng-template>
        <ng-template pTemplate="body" let-row>
            <tr>
                <td>{{ row.sede }}</td>
                <td>{{ row.baseDatos }}</td>
                <td>{{ row.codigo }}</td>
                <td>{{ row.apellidosNombres }}</td>
                <td>{{ row.tipoUsuario }}</td>
                <td>{{ row.especialidad }}</td>
                <td>{{ row.programa }}</td>
                <td>{{ row.ciclo }}</td>
                <td>{{ row.correo }}</td>
                <td>{{ row.totalVisitas }}</td>
            </tr>
        </ng-template>
        <ng-template pTemplate="emptymessage">
            <tr>
                <td colspan="10">
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
    loading: boolean = false;
    resultados: VisitanteBibliotecaVirtualDTO[] = [];
    busquedaRealizada: boolean = false;
    form: FormGroup;

    constructor(private svc: PrestamosService, private messageService: MessageService, private filtrosService: ReportesFiltroService, private fb: FormBuilder) {
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
        this.dataTipoUsuario = filtros.tipoUsuarios;
        this.tipoUsuarioFiltro = this.dataTipoUsuario[0];
        this.dataEscuela = filtros.especialidades;
        this.escuelaFiltro = this.dataEscuela[0];
        this.dataCiclo = filtros.ciclos;
        this.cicloFiltro = this.dataCiclo[0];
    }
    async reporte() {
        if (this.form.invalid) {
            this.messageService.add({ severity: 'warn', detail: 'Seleccione un rango de fechas.' });
            return;
        }
        this.loading = true;
        this.busquedaRealizada = true;
        const { fechaInicio, fechaFin } = this.form.value as { fechaInicio: Date; fechaFin: Date };
        const fi = fechaInicio ? fechaInicio.toISOString().split('T')[0] : undefined;
        const ff = fechaFin ? fechaFin.toISOString().split('T')[0] : undefined;
        try {
            this.resultados =
                (await firstValueFrom(this.svc.reporteVisitantesBibliotecaVirtual(fi, ff))) ?? [];
        } catch (error: any) {
            const msg = error?.status === 403 ? 'No autorizado para ver el reporte.' : 'No fue posible cargar los datos.';
            this.messageService.add({ severity: 'error', detail: msg });
        } finally {
            this.loading = false;
        }
    }
}
