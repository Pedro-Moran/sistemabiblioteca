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
                    <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                        <label for="codigo" class="block text-sm font-medium">Código usuario</label>
                        <input
                            id="codigo"
                            type="text"
                            pInputText
                            placeholder="Ej. 10000"
                            [(ngModel)]="codigoFiltro"
                        />
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
                icon="pi pi-search"
                (click)="reporte()"
                [disabled]="loading"
                pTooltip="Ver reporte"
                tooltipPosition="bottom"
            >
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
    codigoFiltro: string = '';
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
        this.establecerRangoFechasPorDefecto();
        await this.cargarFiltros();
    }
    private async cargarFiltros() {
        const filtros = await this.filtrosService.cargarFiltros();

        const { opciones: sedes, seleccion: sedeTodos } = this.asegurarOpcionTodos(
            filtros.sedes,
            () => new Sedes({ id: 0, descripcion: 'Todos', activo: true })
        );
        this.dataSede = sedes;
        this.sedeFiltro = sedeTodos;

        const { opciones: programas, seleccion: programaTodos } = this.asegurarOpcionTodos(
            filtros.programas,
            () => new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 })
        );
        this.dataPrograma = programas;
        this.programaFiltro = programaTodos;

        const { opciones: tiposUsuario, seleccion: tipoUsuarioTodos } = this.asegurarOpcionTodos(
            filtros.tipoUsuarios,
            () => new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 })
        );
        this.dataTipoUsuario = tiposUsuario;
        this.tipoUsuarioFiltro = tipoUsuarioTodos;

        const { opciones: escuelas, seleccion: escuelaTodos } = this.asegurarOpcionTodos(
            filtros.especialidades,
            () => new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 })
        );
        this.dataEscuela = escuelas;
        this.escuelaFiltro = escuelaTodos;

        const { opciones: ciclos, seleccion: cicloTodos } = this.asegurarOpcionTodos(
            filtros.ciclos,
            () => new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 })
        );
        this.dataCiclo = ciclos;
        this.cicloFiltro = cicloTodos;

        const { opciones: baseDatos, seleccion: baseDatosTodos } = this.asegurarOpcionTodos(
            this.dataBasededatos,
            () => new ClaseGeneral({ id: 0, descripcion: 'Todos', activo: true, estado: 1 })
        );
        this.dataBasededatos = baseDatos;
        this.basededatosFiltro = baseDatosTodos;
    }
    async reporte() {
        if (this.form.invalid) {
            this.messageService.add({ severity: 'warn', detail: 'Seleccione un rango de fechas.' });
            return;
        }
        this.loading = true;
        this.busquedaRealizada = true;
        const { fechaInicio, fechaFin } = this.form.value as { fechaInicio: Date; fechaFin: Date };
        if (fechaInicio && fechaFin && fechaInicio.getTime() > fechaFin.getTime()) {
            this.loading = false;
            this.messageService.add({ severity: 'warn', detail: 'La fecha inicio no puede ser mayor a la fecha fin.' });
            return;
        }
        const filtros = {
            fechaInicio: this.formatearFecha(fechaInicio),
            fechaFin: this.formatearFecha(fechaFin),
            codigo: this.codigoFiltro?.trim() || undefined,
            sede: this.normalizarId(this.sedeFiltro?.id),
            tipoUsuario: this.normalizarId(this.tipoUsuarioFiltro?.id),
            escuela: this.normalizarId(this.escuelaFiltro?.id),
            programa: this.normalizarId(this.programaFiltro?.id),
            ciclo: this.normalizarId(this.cicloFiltro?.id),
            baseDatos: this.normalizarId(this.basededatosFiltro?.id)
        };
        try {
            this.resultados = (await firstValueFrom(this.svc.reporteVisitantesBibliotecaVirtual(filtros))) ?? [];
        } catch (error: any) {
            const msg = error?.status === 403 ? 'No autorizado para ver el reporte.' : 'No fue posible cargar los datos.';
            this.messageService.add({ severity: 'error', detail: msg });
        } finally {
            this.loading = false;
        }
    }
    private formatearFecha(fecha: Date | null): string | undefined {
        if (!fecha) return undefined;
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    private normalizarId(valor?: number | string | null): number | string | undefined {
        if (valor == null) {
            return undefined;
        }
        if (typeof valor === 'number') {
            return valor === 0 ? undefined : valor;
        }
        const texto = valor.toString().trim();
        if (!texto) {
            return undefined;
        }
        if (/^-?\d+$/.test(texto)) {
            const numero = Number(texto);
            if (Number.isFinite(numero) && numero === 0) {
                return undefined;
            }
        }
        return texto.toUpperCase();
    }

    private establecerRangoFechasPorDefecto(): void {
        const fechaInicio = new Date(2025, 0, 1);
        const fechaFin = new Date(2025, 11, 31);
        this.form.setValue({ fechaInicio, fechaFin });
    }

    private asegurarOpcionTodos<T extends { id?: number | string }>(
        lista: T[] | undefined,
        crearTodos: () => T
    ): { opciones: T[]; seleccion: T } {
        const opciones = Array.isArray(lista) ? [...lista] : [];
        let seleccion = opciones.find((item) => {
            const id = item?.id;
            return id !== undefined && Number(id) === 0;
        });
        if (!seleccion) {
            seleccion = crearTodos();
            opciones.unshift(seleccion);
        } else {
            const indiceSeleccion = opciones.indexOf(seleccion);
            if (indiceSeleccion > 0) {
                opciones.splice(indiceSeleccion, 1);
                opciones.unshift(seleccion);
            }
        }
        return { opciones, seleccion };
    }
}
