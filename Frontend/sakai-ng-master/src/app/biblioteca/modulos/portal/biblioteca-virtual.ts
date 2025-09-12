import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BibliotecaVirtualService } from '../../services/biblioteca-virtual.service';
import { GenericoService } from '../../services/generico.service';

import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    imports: [CommonModule, FormsModule, ToolbarModule, DataViewModule, SelectModule, SelectButtonModule, DialogModule, RadioButtonModule, CheckboxModule, CalendarModule, ButtonModule, TagModule, TooltipModule, ToastModule],
    providers: [MessageService, ConfirmationService],
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
                            <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col">
                                <div class="flex justify-between mb-4">
                                    <div>
                                        <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">EQUIPO: {{ item.nombreEquipo }}</span>
                                        <div class="text-lg font-medium mt-1">NRO: {{ item.numeroEquipo }}</div>
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
                                <div class="">
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
                    </div>
                </ng-template>

                <ng-template pTemplate="footer">
                    <button pButton label="Confirmar" (click)="confirmarPrestamo()" [disabled]="!selectedTipo" class="p-button-success mr-2"></button>
                    <button pButton label="Cancelar" (click)="closeDialog()" class="p-button-secondary"></button>
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
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}
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
                    const id = eq?.id ?? eq?.equipo?.id ?? eq?.equipoLaboratorio?.id;
                    return id ? this.bibliotecaVirtualService.obtenerProximoFin(id) : of(null);
                });

                if (solicitudes.length) {
                    forkJoin(solicitudes).subscribe(
                        (fechas) => {
                            (fechas as any[]).forEach((fecha, index) => {
                                const equipo = equipos[index];
                                if (fecha) {
                                    equipo.detallePrestamo = { fechaFin: fecha };
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
        switch (product.estado.descripcion) {
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
        switch (estado) {
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
        switch (estado) {
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
        const estadosConHora = ['PRESTADO EN SALA', 'PRESTADO A DOMICILIO', 'RESERVADO'];
        if (estadosConHora.includes(estado)) {
            const fin = item?.detallePrestamo?.fecha_fin || item?.detallePrestamo?.fechaFin;

            if (fin) {
                const fechaFin = typeof fin === 'string' ? new Date(/^\d{2}:\d{2}$/.test(fin) ? `1970-01-01T${fin}` : fin.replace(' ', 'T')) : fin;
                const hora = formatDate(fechaFin, 'HH:mm', 'es-PE');
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

        // 2) validamos que acepte términos
        if (!this.prestamo.fechaInicioDate || !this.prestamo.fechaInicioTime || !this.prestamo.fechaFinDate || !this.prestamo.fechaFinTime) {
            this.messageService.add({ severity: 'warn', detail: 'Por favor selecciona fecha y hora de inicio y de devolución' });
            return;
        }

        if (!this.acceptedTerms) {
            this.showTerms = true;
            return;
        }

        const email = this.authService.getEmail();

        // 2) Ahora TS sabe que no son null/undefined
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
                // rango cruza medianoche
                if (dtFin < inicioPermitido) {
                    finPermitido.setDate(finPermitido.getDate() + 1);
                } else {
                    inicioPermitido.setDate(inicioPermitido.getDate() - 1);
                }
            }
            if (dtInicio < inicioPermitido || dtFin > finPermitido) {
                this.messageService.add({ severity: 'warn', detail: 'El horario seleccionado est\u00e1 fuera del rango permitido.' });
                return;
            }
        }

        if (this.selectedItem.maxHoras) {
            const diff = (dtFin.getTime() - dtInicio.getTime()) / 3600000;
            if (diff > this.selectedItem.maxHoras) {
                this.messageService.add({ severity: 'warn', detail: `M\u00e1ximo ${this.selectedItem.maxHoras} horas de pr\u00e9stamo.` });
                return;
            }
        }
        const dto = {
            equipoId: this.selectedItem.idEquipo,
            tipoPrestamo: this.selectedTipo,
            tipoUsuario: 1, // por ejemplo
            codigoUsuario: email,
            codigoSede: this.selectedItem.sede.id, // o item.sede.descripcion si es string
            codigoSemestre: '2025-I',
            codigoPrograma: 'ISC',
            codigoEscuela: 'FISI',
            codigoTurno: 'Mañana',
            codigoCiclo: '1',
            fechaInicio: this.formatLocalDateTime(dtInicio),
            fechaFin: this.formatLocalDateTime(dtFin)
        };
        this.bibliotecaVirtualService.solicitar(dto).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', detail: 'Solicitud enviada.' });
                this.listar(); // refresca lista para ver nuevo estado
            },
            error: () => {
                this.messageService.add({ severity: 'error', detail: 'Error al solicitar.' });
            }
        });
        this.closeDialog();
    }
}
