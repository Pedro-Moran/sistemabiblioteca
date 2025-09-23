import { CommonModule, formatDate, registerLocaleData } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Sedes } from '../../interfaces/sedes';
import { AuthService } from '../../services/auth.service';
import { BibliotecaVirtualService } from '../../services/biblioteca-virtual.service';
import { GenericoService } from '../../services/generico.service';
import { MaterialBibliograficoService } from '../../services/material-bibliografico.service';
import { InformacionAcademicaDetalle, SeleccionAcademica } from '../../interfaces/material-bibliografico/informacion-academica';

import localeEsPe from '@angular/common/locales/es-PE';
registerLocaleData(localeEsPe);
import { forkJoin, of } from 'rxjs';

// PrimeNG Modules que vas a usar:
import { ToolbarModule } from 'primeng/toolbar';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

import { SelectModule } from 'primeng/select';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-biblioteca-virtual',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ToolbarModule, DataViewModule, SelectModule, SelectButtonModule, DialogModule, RadioButtonModule, CheckboxModule, CalendarModule, ButtonModule, TagModule, TooltipModule, ToastModule],
    providers: [MessageService],
    template: `
        <div class="card flex flex-col gap-4 w-full">
            <h5>{{ titulo }}</h5>
            <p-toolbar styleClass="mb-6">
                <div class="flex flex-col w-full gap-4">
                    <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                    <div class="grid grid-cols-7 gap-4">
                        <div class="flex flex-col gap-2 col-span-7 md:col-span-2 lg:col-span-2">
                            <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                            <p-select [(ngModel)]="sedeFiltro" [options]="dataSedesFiltro" optionLabel="descripcion" placeholder="Seleccionar sede" (onChange)="filtrarPorSede()" [style.width.px]="200"></p-select>
                        </div>
                        <div class="flex flex-col gap-2 col-span-6 md:col-span-4 lg:col-span-4">
                            <label for="tipoPrestamo" class="block text-sm font-medium text-gray-700">&nbsp;</label>
                            <div class="col-span-2 flex items-center gap-2">
                                <p-radiobutton id="option1" name="tipo" value="1" [(ngModel)]="opcionFiltro" />
                                <label for="option1">Ordenar por Nro. de equipo</label>
                                <p-radiobutton id="option2" name="tipo" value="2" [(ngModel)]="opcionFiltro" />
                                <label for="option2">Ordenar por hora de término</label>
                            </div>
                        </div>

                        <div class="flex items-end">
                            <button pButton type="button" class="p-button-rounded p-button-danger" icon="pi pi-search" (click)="buscar()" [disabled]="loading" pTooltip="Ver reporte" tooltipPosition="bottom"></button>
                        </div>
                    </div>
                </div>
            </p-toolbar>
            <p-dataview [value]="data" [layout]="layout">
                <ng-template #header>
                    <div class="flex justify-end">
                        <p-select-button [(ngModel)]="layout" [options]="options" [allowEmpty]="false">
                            <ng-template #item let-option>
                                <i class="pi " [ngClass]="{ 'pi-bars': option === 'list', 'pi-table': option === 'grid' }"></i>
                            </ng-template>
                        </p-select-button>
                    </div>
                </ng-template>

                <ng-template #list let-items>
                    <div class="flex flex-col">
                        <div *ngFor="let item of items; let i = index">
                            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" [ngClass]="{ 'border-t border-surface': i !== 0 }">
                                <div class="md:w-40 relative">
                                    <div class="absolute" [style]="{ left: '4px', top: '4px' }">
                                        <p-tag [severity]="getSeverity(item)" styleClass="flex items-center gap-1">
                                            <i [ngClass]="getIcon(item.estado.descripcion)"></i>
                                            {{ getEstadoDescripcion(item) }}
                                        </p-tag>
                                    </div>
                                </div>
                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                        <div>
                                            <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">EQUIPO: {{ item.nombreEquipo }}</span>
                                            <div class="text-lg font-medium mt-2">NRO: {{ item.numeroEquipo }}</div>
                                        </div>
                                    </div>
                                    <div class="flex flex-col md:items-end gap-8">
                                        <div class="flex flex-row-reverse md:flex-row gap-2">
                                            @if (item.estado.descripcion == 'DISPONIBLE') {
                                                <p-button
                                                    *ngIf="item.estado.descripcion === 'DISPONIBLE'"
                                                    icon="pi pi-check"
                                                    (click)="reservar(item)"
                                                    icon="pi pi-check"
                                                    severity="success"
                                                    label="Reservar"
                                                    [disabled]="item.estado.descripcion != 'DISPONIBLE'"
                                                    class="flex-auto whitespace-nowrap"
                                                    styleClass="w-full"
                                                ></p-button>
                                            } @else {
                                                <p-button label="Sin acceso" disabled class="flex-auto whitespace-nowrap" styleClass="w-full" />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>

                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4">
                        <div *ngFor="let item of items; let i = index" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                            <div class="border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col relative">
                                <div class="absolute -top-3 right-3 bg-blue-500 text-white text-sm font-medium px-3 py-2 rounded-full shadow-md">
                                    {{ item.nombreEquipo }}
                                </div>
                                <div class="p-6 flex flex-col">
                                    <div class="flex justify-between mb-4">
                                        <div>
                                            <div class="text-lg font-medium">NRO: {{ item.numeroEquipo }}</div>
                                            @if (item.estado.descripcion === 'DISPONIBLE') {
                                                <p-button [label]="getEstadoDescripcion(item)" severity="success" text />
                                            } @else if (item.estado.descripcion === 'MANTENIMIENTO') {
                                                <p-button [label]="getEstadoDescripcion(item)" severity="danger" text />
                                            } @else {
                                                <p-button [label]="getEstadoDescripcion(item)" severity="warn" text />
                                            }
                                        </div>
                                        <div class="flex items-center justify-center rounded-border" [ngClass]="getIconBg(item.estado.descripcion)" style="width: 2.5rem; height: 2.5rem">
                                            <i [ngClass]="getIcon(item.estado.descripcion)" class="!text-xl"></i>
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-6 mt-6">
                                        <div class="flex gap-2">
                                            @if (item.estado.descripcion == 'DISPONIBLE') {
                                                <p-button
                                                    icon="pi pi-check"
                                                    severity="success"
                                                    (click)="reservar(item)"
                                                    label="Reservar"
                                                    [disabled]="item.estado.descripcion != 'DISPONIBLE'"
                                                    class="flex-auto whitespace-nowrap"
                                                    styleClass="w-full"
                                                ></p-button>
                                            } @else {
                                                <p-button label="Sin acceso" disabled class="flex-auto whitespace-nowrap" styleClass="w-full" />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-dataview>
            <!-- 1) Diálogo principal -->
            <p-dialog header="Tipo de préstamo" [(visible)]="displayDialog" modal="true" appendTo="body" [closable]="false" [style]="{ width: '800px' }">
                <ng-template pTemplate="content">
                    <div class="flex flex-col gap-4">
                        <!-- Radios -->
                        <div *ngFor="let op of tiposPrestamo" class="p-field-radiobutton">
                            <p-radioButton name="tipoPr" [value]="op.value" [(ngModel)]="selectedTipo" inputId="tipo-{{ op.value }}"> </p-radioButton>
                            <label for="tipo-{{ op.value }}">{{ op.label }}</label>
                        </div>

                        <!-- Fecha y hora -->
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Sólo fecha -->
                            <div class="flex flex-col">
                                <label>Fecha de inicio</label>
                                <p-calendar name="fechaInicioDate" [minDate]="minDate" [(ngModel)]="prestamo.fechaInicioDate" dateFormat="yy-mm-dd" [showTime]="false" appendTo="body" (ngModelChange)="onDateRangeChange()"> </p-calendar>
                            </div>

                            <!-- Sólo hora -->
                            <div class="flex flex-col">
                                <label>Hora de inicio</label>
                                <p-calendar name="fechaInicioTime" [(ngModel)]="prestamo.fechaInicioTime" timeOnly="true" hourFormat="24" appendTo="body" [minDate]="minHora" [maxDate]="maxHora" (ngModelChange)="onDateRangeChange()"> </p-calendar>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 mt-4">
                            <div class="flex flex-col">
                                <label>Fecha de devolución</label>
                                <p-calendar name="fechaFinDate" [minDate]="minDate" [(ngModel)]="prestamo.fechaFinDate" dateFormat="yy-mm-dd" [showTime]="false" appendTo="body" (ngModelChange)="onDateRangeChange()"> </p-calendar>
                            </div>

                            <div class="flex flex-col">
                                <label>Hora de devolución</label>
                                <p-calendar name="fechaFinTime" [(ngModel)]="prestamo.fechaFinTime" timeOnly="true" hourFormat="24" appendTo="body" [minDate]="minHora" [maxDate]="maxHora" (ngModelChange)="onDateRangeChange()"> </p-calendar>
                            </div>
                        </div>
                        <div class="border border-surface-200 dark:border-surface-700 rounded-md p-3 mt-2">
                            <div class="flex justify-between gap-3 items-start">
                                <div>
                                    <div class="text-sm font-medium text-color-secondary">Información académica</div>
                                    <ng-container *ngIf="resumenSeleccionAcademica; else seleccionPendiente">
                                        <div class="text-sm mt-2">
                                            <span class="font-semibold">Programa:</span>
                                            {{ resumenSeleccionAcademica.programa }}
                                        </div>
                                        <div class="text-sm">
                                            <span class="font-semibold">Especialidad:</span>
                                            {{ resumenSeleccionAcademica.especialidad }}
                                        </div>
                                        <div class="text-sm">
                                            <span class="font-semibold">Ciclo:</span>
                                            {{ resumenSeleccionAcademica.ciclo }}
                                        </div>
                                    </ng-container>
                                    <ng-template #seleccionPendiente>
                                        <div class="text-sm mt-2 text-color-secondary">
                                            Selecciona tu programa, especialidad y ciclo antes de confirmar la reserva.
                                        </div>
                                    </ng-template>
                                </div>
                                <button
                                    pButton
                                    type="button"
                                    class="p-button-sm p-button-text"
                                    icon="pi pi-pencil"
                                    label="{{ resumenSeleccionAcademica ? 'Cambiar' : 'Seleccionar' }}"
                                    (click)="abrirFormularioAcademico()"
                                ></button>
                            </div>
                        </div>
                    </div>
                </ng-template>

                <ng-template pTemplate="footer">
                    <button pButton label="Confirmar" (click)="confirmarPrestamo()" [disabled]="!selectedTipo" class="p-button-success mr-2"></button>
                    <button pButton label="Cancelar" (click)="closeDialog()" class="p-button-secondary"></button>
                </ng-template>
            </p-dialog>

            <p-dialog
                [(visible)]="mostrarFormularioAcademico"
                [modal]="true"
                [draggable]="false"
                [resizable]="false"
                header="Información académica del usuario"
                appendTo="body"
                [style]="{ width: '28rem' }"
                (onHide)="onCancelarFormularioAcademico()"
            >
                <ng-template pTemplate="content">
                    <div *ngIf="cargandoInformacionAcademica" class="py-6 text-center text-sm text-color-secondary">
                        Cargando información académica...
                    </div>
                    <form *ngIf="!cargandoInformacionAcademica" [formGroup]="formAcademico" class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="programaAcademico" class="font-medium text-sm">Programa</label>
                            <p-select
                                id="programaAcademico"
                                appendTo="body"
                                formControlName="programa"
                                [options]="opcionesProgramaAcademico"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Seleccionar"
                            ></p-select>
                            <small class="text-xs text-red-500" *ngIf="formAcademico.get('programa')?.touched && formAcademico.get('programa')?.invalid">
                                Seleccione un programa.
                            </small>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="especialidadAcademica" class="font-medium text-sm">Especialidad</label>
                            <p-select
                                id="especialidadAcademica"
                                appendTo="body"
                                formControlName="especialidad"
                                [options]="opcionesEspecialidadAcademica"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Seleccionar"
                            ></p-select>
                            <small class="text-xs text-red-500" *ngIf="formAcademico.get('especialidad')?.touched && formAcademico.get('especialidad')?.invalid">
                                Seleccione una especialidad.
                            </small>
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="cicloAcademico" class="font-medium text-sm">Ciclo</label>
                            <p-select
                                id="cicloAcademico"
                                appendTo="body"
                                formControlName="ciclo"
                                [options]="opcionesCicloAcademico"
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Seleccionar"
                            ></p-select>
                            <small class="text-xs text-red-500" *ngIf="formAcademico.get('ciclo')?.touched && formAcademico.get('ciclo')?.invalid">
                                Seleccione un ciclo.
                            </small>
                        </div>
                    </form>
                </ng-template>
                <ng-template pTemplate="footer">
                    <button
                        pButton
                        type="button"
                        class="p-button-outlined p-button-danger"
                        label="Cancelar"
                        (click)="onCancelarFormularioAcademico()"
                        [disabled]="cargandoInformacionAcademica"
                    ></button>
                    <button
                        pButton
                        type="button"
                        class="p-button-success"
                        label="Confirmar"
                        (click)="confirmarSeleccionAcademica()"
                        [disabled]="formAcademico.invalid || cargandoInformacionAcademica"
                    ></button>
                </ng-template>
            </p-dialog>

            <p-dialog header="Términos y Condiciones" [(visible)]="showTerms" modal="true" appendTo="body" [closable]="false" [style]="{ width: '600px' }">
                <ng-template pTemplate="content">
                    <div style="max-height:300px; overflow:auto">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                </ng-template>

                <ng-template pTemplate="footer">
                    <p-checkbox binary="true" name="acceptedTerms" [(ngModel)]="acceptedTerms" inputId="tcCheck"> </p-checkbox>
                    <label for="tcCheck" class="ml-2">Acepto los términos</label>
                    <button pButton label="Continuar" (click)="showTerms = false" [disabled]="!acceptedTerms" class="p-button-success ml-4"></button>
                    <button pButton label="Cancelar" class="p-button-secondary ml-4" (click)="showTerms = false; acceptedTerms = false"></button>
                </ng-template>
            </p-dialog>
            <p-toast></p-toast>
        </div>
    `
})
export class BibliotecaVirtualComponent {
    layout: 'list' | 'grid' = 'grid';
    options = ['list', 'grid'];

    private parseTime(t: string) {
        const [h, m] = t.split(':').map((n) => parseInt(n, 10));
        return { h, m };
    }

    private parseTimeAtDate(time: string, base: Date) {
        const { h, m } = this.parseTime(time);
        const d = new Date(base);
        d.setHours(h, m, 0, 0);
        return d;
    }

    private coerceToDate(value: any): Date | null {
        if (!value) {
            return null;
        }
        if (value instanceof Date) {
            return value;
        }
        if (Array.isArray(value)) {
            const [y, m, d, hh = 0, mm = 0, ss = 0] = value;
            return new Date(y, m - 1, d, hh, mm, ss);
        }
        if (typeof value === 'string') {
            const match = value.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
            if (match) {
                const [, hh, mm, ss = '0'] = match;
                return new Date(1970, 0, 1, +hh, +mm, +ss);
            }
            return new Date(value.replace(' ', 'T'));
        }
        if (typeof value === 'object') {
            return this.coerceToDate(value.fechaFin ?? value.fecha_fin);
        }
        return null;
    }
    titulo: string = 'Biblioteca virtual';
    dataSede: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    loading: boolean = true;
    opcionFiltro: number = 1;
    data: any[] = [];
    dataSedesFiltro: Sedes[] = [];
    tiposPrestamo = [
        { label: 'En sala', value: 'EN_SALA' },
        { label: 'A domicilio', value: 'PRESTAMO_A_DOMICILIO' },
        { label: 'Sala y domicilio', value: 'SALA_Y_DOMICILIO' }
    ];
    showTerms: boolean = false;
    acceptedTerms: boolean = false;
    displayDialog = false;
    selectedItem: any;
    selectedTipo: string | undefined;
    minDate: Date = new Date();
    minHora: Date | null = null;
    maxHora: Date | null = null;
    formAcademico: FormGroup;
    mostrarFormularioAcademico = false;
    cargandoInformacionAcademica = false;
    informacionAcademicaDisponible: InformacionAcademicaDetalle[] = [];
    opcionesProgramaAcademico: { label: string; value: string }[] = [];
    opcionesEspecialidadAcademica: { label: string; value: string }[] = [];
    opcionesCicloAcademico: { label: string; value: string }[] = [];
    resumenSeleccionAcademica: { programa: string; especialidad: string; ciclo: string } | null = null;
    private seleccionAcademicaConfirmada: SeleccionAcademica | null = null;
    private onSeleccionAcademicaListo: ((seleccion: SeleccionAcademica) => void) | null = null;
    prestamo: {
        equipoId?: number;
        tipoUsuario?: number;
        codigoUsuario?: string;
        codigoSede?: string;
        codigoSemestre?: string;
        codigoPrograma?: string;
        codigoEscuela?: string;
        codigoTurno?: string;
        codigoCiclo?: string;
        tipoPrestamo?: string;
        fechaInicioDate?: Date | null;
        fechaInicioTime?: Date | null;
        fechaFinDate?: Date | null;
        fechaFinTime?: Date | null;
    } = {
        fechaInicioDate: null,
        fechaInicioTime: null,
        fechaFinDate: null,
        fechaFinTime: null
    };

    constructor(
        private bibliotecaVirtualService: BibliotecaVirtualService,
        private genericoService: GenericoService,
        private materialBibliograficoService: MaterialBibliograficoService,
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService
    ) {
        this.formAcademico = this.fb.group({
            programa: [null, Validators.required],
            especialidad: [null, Validators.required],
            ciclo: [null, Validators.required]
        });

        this.formAcademico.get('programa')?.valueChanges.subscribe((valor: string | null) => {
            this.actualizarEspecialidades(valor ?? null);
        });

        this.formAcademico.get('especialidad')?.valueChanges.subscribe((valor: string | null) => {
            const programaActual = this.formAcademico.get('programa')?.value ?? null;
            this.actualizarCiclos(programaActual ?? null, valor ?? null);
        });
    }
    async ngOnInit() {
        await this.ListaSede();
        await this.listar();
    }
    buscar() {}
    async listar(sedeId?: number) {
        this.loading = true;
        this.data = [];

        this.bibliotecaVirtualService.listarEquipos().subscribe(
            (result: any) => {
                let equipos = result?.data ?? result;
                if (!Array.isArray(equipos)) {
                    this.loading = false;
                    return;
                }
                if (sedeId && sedeId !== 0) {
                    equipos = equipos.filter((eq: any) => eq.sede?.id === sedeId);
                }
                const solicitudes = equipos.map((eq: any) => {
                    const id = eq?.id ?? eq?.idEquipo ?? eq?.equipo?.id ?? eq?.equipoLaboratorio?.id;
                    return id ? this.bibliotecaVirtualService.obtenerProximoFin(id) : of(null);
                });

                if (solicitudes.length) {
                    forkJoin(solicitudes).subscribe(
                        (fechas) => {
                            (fechas as any[]).forEach((fecha, index) => {
                                const equipo = equipos[index];
                                const fechaFin = this.coerceToDate(fecha);
                                if (fechaFin) {
                                    equipo.detallePrestamo = { fechaFin };
                                }
                            });
                            this.data = equipos;
                            this.loading = false;
                        },
                        () => {
                            this.data = equipos;
                            this.loading = false;
                        }
                    );
                } else {
                    this.data = equipos;
                    this.loading = false;
                }
            },
            () => {
                this.loading = false;
            }
        );
    }
    getSeverity(product: any) {
        const estado = product?.estado?.descripcion?.toUpperCase?.() || '';
        switch (estado) {
            case 'DISPONIBLE':
                return 'success';
            case 'MANTENIMIENTO':
                return 'danger';
            case 'PRESTADO EN SALA':
            case 'PRESTADO A DOMICILIO':
            case 'RESERVADO':
                return 'warn';
            default:
                return 'info';
        }
    }

    getIcon(estado: string): string {
        const estadoUpper = estado?.toUpperCase?.() || '';
        switch (estadoUpper) {
            case 'DISPONIBLE':
                return 'pi pi-check-circle text-green-500';
            case 'MANTENIMIENTO':
                return 'pi pi-cog text-red-500';
            case 'PRESTADO EN SALA':
            case 'PRESTADO A DOMICILIO':
            case 'RESERVADO':
                return 'pi pi-lock text-yellow-500';
            default:
                return 'pi pi-question-circle text-gray-500';
        }
    }

    getIconBg(estado: string): string {
        const estadoUpper = estado?.toUpperCase?.() || '';
        switch (estadoUpper) {
            case 'DISPONIBLE':
                return 'bg-green-100 dark:bg-green-400/10';
            case 'MANTENIMIENTO':
                return 'bg-red-100 dark:bg-red-400/10';
            case 'PRESTADO EN SALA':
            case 'PRESTADO A DOMICILIO':
            case 'RESERVADO':
                return 'bg-yellow-100 dark:bg-yellow-400/10';
            default:
                return 'bg-gray-100 dark:bg-gray-400/10';
        }
    }

    getEstadoDescripcion(item: any): string {
        const estado = item?.estado?.descripcion || '';
        const estadoUpper = estado.toUpperCase();
        const estadosConHora = ['PRESTADO EN SALA', 'PRESTADO A DOMICILIO', 'RESERVADO'];
        if (estadosConHora.includes(estadoUpper)) {
            const fin = this.coerceToDate(item?.detallePrestamo);
            if (fin) {
                const hora = formatDate(fin, 'HH:mm', 'es-PE');
                return `${estado} hasta las ${hora}`;
            }
        }
        return estado;
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
    onDateRangeChange() {
        if (this.prestamo.fechaInicioDate && this.prestamo.fechaFinDate && this.prestamo.fechaInicioTime && this.prestamo.fechaFinTime) {
            // si se modifican las fechas u horas después de aceptar, se debe volver a aceptar
            this.acceptedTerms = false;
        }
    }

    filtrarPorSede() {
        const id = this.sedeFiltro?.id || 0;
        this.listar(id);
    }
    reservar(item: any) {
        this.selectedItem = item;
        this.selectedTipo = undefined;
        this.acceptedTerms = false;
        const now = new Date();
        if (item.horaInicio && item.horaFin) {
            this.minHora = this.parseTimeAtDate(item.horaInicio, now);
            this.maxHora = this.parseTimeAtDate(item.horaFin, now);
            if (this.maxHora <= this.minHora) {
                this.maxHora.setDate(this.maxHora.getDate() + 1);
            }
        } else {
            this.minHora = null;
            this.maxHora = null;
        }
        const startBase = this.minHora && now > this.minHora ? now : (this.minHora ?? now);
        this.prestamo = {
            fechaInicioDate: new Date(startBase),
            fechaInicioTime: new Date(startBase),
            fechaFinDate: new Date(startBase),
            fechaFinTime: new Date(startBase)
        };
        this.displayDialog = true;
    }

    closeDialog() {
        this.displayDialog = false;
        this.minHora = null;
        this.maxHora = null;
    }

    private formatLocalDateTime(d: Date): string {
        const pad = (n: number) => String(n).padStart(2, '0');
        const Y = d.getFullYear();
        const M = pad(d.getMonth() + 1);
        const D = pad(d.getDate());
        const h = pad(d.getHours());
        const m = pad(d.getMinutes());
        const s = pad(d.getSeconds());
        return `${Y}-${M}-${D}T${h}:${m}:${s}`;
    }

    confirmarPrestamo() {
        if (!this.selectedTipo) {
            this.messageService.add({
                severity: 'warn',
                detail: 'Por favor selecciona un tipo de préstamo.'
            });
            return;
        }

        if (!this.prestamo.fechaInicioDate || !this.prestamo.fechaInicioTime || !this.prestamo.fechaFinDate || !this.prestamo.fechaFinTime) {
            this.messageService.add({ severity: 'warn', detail: 'Por favor selecciona fecha y hora de inicio y de devolución' });
            return;
        }

        if (!this.acceptedTerms) {
            this.showTerms = true;
            return;
        }

        const inicioDate = this.prestamo.fechaInicioDate;
        const inicioTime = this.prestamo.fechaInicioTime;
        const dtInicio = new Date(inicioDate.getFullYear(), inicioDate.getMonth(), inicioDate.getDate(), inicioTime.getHours(), inicioTime.getMinutes());

        const finDate = this.prestamo.fechaFinDate;
        const finTime = this.prestamo.fechaFinTime;
        const dtFin = new Date(finDate.getFullYear(), finDate.getMonth(), finDate.getDate(), finTime.getHours(), finTime.getMinutes());

        if (this.selectedItem.horaInicio && this.selectedItem.horaFin) {
            const inicioPermitido = this.parseTimeAtDate(this.selectedItem.horaInicio, dtInicio);
            const finPermitido = this.parseTimeAtDate(this.selectedItem.horaFin, dtInicio);
            if (finPermitido <= inicioPermitido) {
                if (dtFin < inicioPermitido) {
                    finPermitido.setDate(finPermitido.getDate() + 1);
                } else {
                    inicioPermitido.setDate(inicioPermitido.getDate() - 1);
                }
            }
            if (dtInicio < inicioPermitido || dtFin > finPermitido) {
                this.messageService.add({ severity: 'warn', detail: 'El horario seleccionado está fuera del rango permitido.' });
                return;
            }
        }

        if (this.selectedItem.maxHoras) {
            const diff = (dtFin.getTime() - dtInicio.getTime()) / 3600000;
            if (diff > this.selectedItem.maxHoras) {
                this.messageService.add({ severity: 'warn', detail: `Máximo ${this.selectedItem.maxHoras} horas de préstamo.` });
                return;
            }
        }

        const inicioFinal = new Date(dtInicio);
        const finFinal = new Date(dtFin);
        this.solicitarSeleccionAcademica((seleccion) => this.enviarSolicitudPrestamo(inicioFinal, finFinal, seleccion));
    }

    abrirFormularioAcademico(): void {
        this.solicitarSeleccionAcademica();
    }

    private solicitarSeleccionAcademica(continuacion?: (seleccion: SeleccionAcademica) => void): void {
        const correo = this.obtenerCorreoUsuario();
        if (!correo) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Usuario sin correo',
                detail: 'No se pudo determinar el correo electrónico del usuario autenticado.'
            });
            return;
        }

        this.onSeleccionAcademicaListo = continuacion ?? null;
        this.mostrarFormularioAcademico = true;
        this.cargandoInformacionAcademica = true;
        this.formAcademico.reset();
        this.formAcademico.markAsPristine();
        this.formAcademico.markAsUntouched();
        this.formAcademico.enable({ emitEvent: false });
        this.informacionAcademicaDisponible = [];
        this.opcionesProgramaAcademico = [];
        this.opcionesEspecialidadAcademica = [];
        this.opcionesCicloAcademico = [];

        const preseleccion = this.seleccionAcademicaConfirmada;

        this.materialBibliograficoService.obtenerInformacionAcademica(correo).subscribe({
            next: (lista: InformacionAcademicaDetalle[]) => {
                this.cargandoInformacionAcademica = false;
                if (!lista.length) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Información no disponible',
                        detail: 'El usuario no cuenta con información académica registrada.'
                    });
                    this.onSeleccionAcademicaListo = null;
                    this.cerrarFormularioAcademico();
                    return;
                }

                this.informacionAcademicaDisponible = lista;
                this.actualizarProgramas(preseleccion?.programa ?? null);
                const programaActual = this.formAcademico.get('programa')?.value ?? preseleccion?.programa ?? null;
                this.actualizarEspecialidades(programaActual ?? null, preseleccion?.especialidad ?? null, preseleccion?.ciclo ?? null);
            },
            error: () => {
                this.cargandoInformacionAcademica = false;
                this.onSeleccionAcademicaListo = null;
                this.cerrarFormularioAcademico();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo obtener la información académica del usuario.'
                });
            }
        });
    }

    confirmarSeleccionAcademica(): void {
        if (this.cargandoInformacionAcademica) {
            return;
        }
        if (this.formAcademico.invalid) {
            this.formAcademico.markAllAsTouched();
            return;
        }

        const valores = this.formAcademico.value as { programa: string; especialidad: string; ciclo: string };
        const detalleSeleccionado = this.informacionAcademicaDisponible.find(
            (item) =>
                item.gradoAcademico === valores.programa &&
                item.carrera === valores.especialidad &&
                item.cicloNivel === valores.ciclo
        );
        const seleccion: SeleccionAcademica = {
            programa: valores.programa,
            especialidad: valores.especialidad,
            ciclo: valores.ciclo,
            estadoPrograma: this.obtenerValorCadena(detalleSeleccionado, [
                'estadoPrograma',
                'estado_programa',
                'programaEstado',
                'estadoProg'
            ]),
            motaccion: this.obtenerValorCadena(detalleSeleccionado, ['motaccion', 'motAccion', 'motivoAccion'])
        };

        this.seleccionAcademicaConfirmada = seleccion;
        this.resumenSeleccionAcademica = this.construirResumenSeleccion(seleccion);

        const continuar = this.onSeleccionAcademicaListo;
        this.onSeleccionAcademicaListo = null;

        this.cerrarFormularioAcademico();

        if (continuar) {
            continuar(seleccion);
        } else {
            this.messageService.add({ severity: 'success', detail: 'Información académica actualizada.' });
        }
    }

    onCancelarFormularioAcademico(): void {
        this.onSeleccionAcademicaListo = null;
        this.cerrarFormularioAcademico();
    }

    private cerrarFormularioAcademico(): void {
        this.mostrarFormularioAcademico = false;
        this.cargandoInformacionAcademica = false;
        this.formAcademico.enable({ emitEvent: false });
        this.formAcademico.reset();
        this.informacionAcademicaDisponible = [];
        this.opcionesProgramaAcademico = [];
        this.opcionesEspecialidadAcademica = [];
        this.opcionesCicloAcademico = [];
    }

    private actualizarProgramas(preseleccion?: string | null): void {
        this.opcionesProgramaAcademico = this.extraerOpciones(
            'gradoAcademico',
            ['descripcionGradoAcademico', 'gradoAcademicoDescripcion', 'gradoAcademicoDesc']
        );
        const control = this.formAcademico.get('programa');
        const actual = preseleccion ?? (control?.value as string | null) ?? null;
        let valor = actual && this.opcionesProgramaAcademico.some((opt) => opt.value === actual) ? actual : null;
        if (!valor && this.opcionesProgramaAcademico.length === 1) {
            valor = this.opcionesProgramaAcademico[0].value;
        }
        control?.setValue(valor, { emitEvent: false });
    }

    private actualizarEspecialidades(
        programa: string | null,
        preseleccion?: string | null,
        preseleccionCiclo?: string | null
    ): void {
        this.opcionesEspecialidadAcademica = this.extraerOpciones(
            'carrera',
            ['descripcionCarrera', 'carreraDescripcion', 'carreraDesc'],
            programa ?? null
        );
        const control = this.formAcademico.get('especialidad');
        const actual = control?.value as string | null;
        let valor = preseleccion ?? (actual && this.opcionesEspecialidadAcademica.some((opt) => opt.value === actual) ? actual : null);
        if (!valor && this.opcionesEspecialidadAcademica.length === 1) {
            valor = this.opcionesEspecialidadAcademica[0].value;
        }
        control?.setValue(valor, { emitEvent: false });
        this.actualizarCiclos(programa, valor ?? null, preseleccionCiclo ?? null);
    }

    private actualizarCiclos(
        programa: string | null,
        especialidad: string | null,
        preseleccion?: string | null
    ): void {
        this.opcionesCicloAcademico = this.extraerOpciones(
            'cicloNivel',
            ['descripcionCicloNivel', 'cicloNivelDescripcion', 'cicloDescripcion'],
            programa ?? null,
            especialidad ?? null
        );
        const control = this.formAcademico.get('ciclo');
        const actual = control?.value as string | null;
        let valor = preseleccion ?? (actual && this.opcionesCicloAcademico.some((opt) => opt.value === actual) ? actual : null);
        if (!valor && this.opcionesCicloAcademico.length === 1) {
            valor = this.opcionesCicloAcademico[0].value;
        }
        control?.setValue(valor, { emitEvent: false });
    }

    private extraerOpciones(
        campo: 'gradoAcademico' | 'carrera' | 'cicloNivel',
        clavesDescripcion: string[],
        programa?: string | null,
        especialidad?: string | null
    ): { label: string; value: string }[] {
        const mapa = new Map<string, string>();
        this.informacionAcademicaDisponible.forEach((item) => {
            if (programa && item.gradoAcademico !== programa) {
                return;
            }
            if (especialidad && item.carrera !== especialidad) {
                return;
            }
            const valor = (item as any)[campo];
            if (typeof valor !== 'string' || !valor) {
                return;
            }
            if (!mapa.has(valor)) {
                mapa.set(valor, this.obtenerEtiqueta(item, clavesDescripcion, valor));
            }
        });
        return Array.from(mapa.entries()).map(([value, label]) => ({ value, label }));
    }

    private obtenerEtiqueta(det: InformacionAcademicaDetalle, claves: string[], fallback: string): string {
        for (const clave of claves) {
            const valor = (det as any)?.[clave];
            if (typeof valor === 'string' && valor.trim()) {
                return valor.trim();
            }
        }
        return fallback;
    }

    private obtenerValorCadena(
        det: InformacionAcademicaDetalle | undefined,
        claves: string[]
    ): string | undefined {
        if (!det) {
            return undefined;
        }
        for (const clave of claves) {
            const valor = (det as any)?.[clave];
            if (typeof valor === 'string' && valor.trim()) {
                return valor.trim();
            }
        }
        return undefined;
    }

    private construirResumenSeleccion(seleccion: SeleccionAcademica): { programa: string; especialidad: string; ciclo: string } {
        const programa =
            this.extraerOpciones('gradoAcademico', ['descripcionGradoAcademico', 'gradoAcademicoDescripcion', 'gradoAcademicoDesc'])
                .find((opt) => opt.value === seleccion.programa)?.label ?? seleccion.programa;
        const especialidad =
            this.extraerOpciones('carrera', ['descripcionCarrera', 'carreraDescripcion', 'carreraDesc'], seleccion.programa)
                .find((opt) => opt.value === seleccion.especialidad)?.label ?? seleccion.especialidad;
        const ciclo =
            this.extraerOpciones('cicloNivel', ['descripcionCicloNivel', 'cicloNivelDescripcion', 'cicloDescripcion'], seleccion.programa, seleccion.especialidad)
                .find((opt) => opt.value === seleccion.ciclo)?.label ?? seleccion.ciclo;
        return { programa, especialidad, ciclo };
    }

    private obtenerCorreoUsuario(): string | null {
        const actual = this.authService.currentUserValue as any;
        if (actual?.email && typeof actual.email === 'string' && actual.email.includes('@')) {
            return actual.email;
        }
        const tokenUser: any = this.authService.getUser();
        const posibles = ['email', 'correo', 'upn', 'preferred_username', 'userprincipalname', 'unique_name', 'sub'];
        for (const clave of posibles) {
            const valor = tokenUser?.[clave];
            if (typeof valor === 'string' && valor.includes('@')) {
                return valor;
            }
        }
        return null;
    }

    private obtenerEquipoId(item: any): number | null {
        if (!item) {
            return null;
        }
        const posibles = [item.idEquipo, item.id, item.equipoId, item?.equipo?.id, item?.equipoLaboratorio?.id];
        for (const posible of posibles) {
            const id = Number(posible);
            if (Number.isFinite(id) && id > 0) {
                return id;
            }
        }
        return null;
    }

    private enviarSolicitudPrestamo(dtInicio: Date, dtFin: Date, seleccion: SeleccionAcademica): void {
        const correo = this.obtenerCorreoUsuario() ?? this.authService.getEmail();
        if (!correo) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Usuario sin correo',
                detail: 'No se pudo determinar el correo electrónico del usuario autenticado.'
            });
            return;
        }

        const equipoId = this.obtenerEquipoId(this.selectedItem);
        if (!equipoId) {
            this.messageService.add({ severity: 'error', detail: 'No se pudo determinar el equipo seleccionado.' });
            return;
        }

        const sedeId = this.selectedItem?.sede?.id ?? this.sedeFiltro?.id ?? null;
        const dto: any = {
            equipoId,
            tipoPrestamo: this.selectedTipo,
            tipoUsuario: 1,
            codigoUsuario: correo,
            codigoPrograma: seleccion.programa,
            codigoEscuela: seleccion.especialidad,
            codigoCiclo: seleccion.ciclo,
            fechaInicio: this.formatLocalDateTime(dtInicio),
            fechaFin: this.formatLocalDateTime(dtFin)
        };
        if (seleccion.estadoPrograma) {
            dto.estadoPrograma = seleccion.estadoPrograma;
        }
        if (seleccion.motaccion) {
            dto.motaccion = seleccion.motaccion;
        }
        if (sedeId != null) {
            dto.codigoSede = String(sedeId);
        }
        dto.codigoSemestre = this.selectedItem?.codigoSemestre ?? '2025-I';
        dto.codigoTurno = this.selectedItem?.codigoTurno ?? 'Mañana';

        this.bibliotecaVirtualService.solicitar(dto).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', detail: 'Solicitud enviada.' });
                this.listar(this.sedeFiltro?.id);
                this.closeDialog();
                this.acceptedTerms = false;
                this.selectedTipo = undefined;
            },
            error: () => {
                this.messageService.add({ severity: 'error', detail: 'Error al solicitar.' });
            }
        });
    }
}
