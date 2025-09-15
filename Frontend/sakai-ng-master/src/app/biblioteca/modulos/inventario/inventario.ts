import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { InputValidation } from '../../input-validation';
import { InventarioItem, EstadoInventario } from '../../interfaces/inventario-item';
import { InventarioService } from '../../services/inventario.service';
import { TemplateModule } from '../../template.module';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-inventario-material',
    standalone: true,
    imports: [TemplateModule, InputValidation],
    template: ` <div class="">
            <div class="">
                <div class="card flex flex-col gap-4 w-full">
                    <p-toast></p-toast>
                    <p-confirmDialog [style]="{ width: '450px' }"></p-confirmDialog>
                    <h5>{{ titulo }}</h5>
                    <form [formGroup]="form" (ngSubmit)="buscar()" class="flex flex-col gap-4">
                        <p-toolbar styleClass="mb-6">
                            <ng-template #start>
                                <div class="flex flex-wrap gap-4 items-end w-full">
                                    <div class="flex flex-col grow basis-0 gap-2 sm:max-w-96">
                                        <label for="codigoBarra" class="block text-sm font-medium">Código de barras</label>
                                        <input
                                            #codigoInput
                                            pInputText
                                            id="codigoBarra"
                                            type="text"
                                            formControlName="codigoBarra"
                                            autocomplete="off"
                                            placeholder="Escanee o ingrese el código"
                                        />
                                        <app-input-validation [form]="form" modelo="codigoBarra" ver="Código de barras"></app-input-validation>
                                    </div>
                                    <div class="flex flex-row gap-2">
                                        <button
                                            pButton
                                            type="submit"
                                            label="Buscar"
                                            icon="pi pi-search"
                                            class="p-button-rounded p-button-primary"
                                            [disabled]="loading"
                                        ></button>
                                        <button
                                            pButton
                                            type="button"
                                            label="Limpiar"
                                            icon="pi pi-trash"
                                            class="p-button-rounded p-button-secondary"
                                            (click)="limpiar()"
                                            [disabled]="loading && resultados.length === 0 && !form.value.codigoBarra"
                                        ></button>
                                    </div>
                                </div>
                            </ng-template>
                            <ng-template #end>
                                @if (ultimaBusqueda) {
                                    <span class="text-sm text-surface-500 dark:text-surface-300">
                                        Último código: <strong>{{ ultimaBusqueda }}</strong>
                                    </span>
                                }
                            </ng-template>
                        </p-toolbar>
                    </form>

                    <p-table
                        #dt
                        [value]="resultados"
                        dataKey="codigoBarra"
                        [rows]="10"
                        [showCurrentPageReport]="true"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
                        [rowsPerPageOptions]="[10, 25, 50]"
                        [loading]="loading"
                        [rowHover]="true"
                        styleClass="p-datatable-gridlines"
                        [paginator]="true"
                        [globalFilterFields]="['codigoBarra','codigoLocalizacion','titulo','autor','estadoInventario']"
                        responsiveLayout="scroll"
                    >
                        <ng-template pTemplate="caption">
                            <div class="flex items-center justify-between">
                                <p-button [outlined]="true" icon="pi pi-filter-slash" label="Limpiar" (click)="dt.clear()" />

                                <p-iconfield>
                                    <input
                                        pInputText
                                        type="text"
                                        placeholder="Filtrar"
                                        (input)="onGlobalFilter(dt, $event)"
                                    />
                                </p-iconfield>
                            </div>
                        </ng-template>
                        <ng-template pTemplate="header">
                            <tr>
                                <th pSortableColumn="codigoBarra" style="min-width: 10rem">
                                    Código barras<p-sortIcon field="codigoBarra"></p-sortIcon>
                                </th>
                                <th pSortableColumn="codigoLocalizacion" style="min-width: 8rem">
                                    Código localización<p-sortIcon field="codigoLocalizacion"></p-sortIcon>
                                </th>
                                <th pSortableColumn="titulo" style="min-width: 16rem">
                                    Título<p-sortIcon field="titulo"></p-sortIcon>
                                </th>
                                <th pSortableColumn="autor" style="min-width: 12rem">
                                    Autor<p-sortIcon field="autor"></p-sortIcon>
                                </th>
                                <th pSortableColumn="estadoInventario" style="min-width: 10rem">
                                    Estado inventario<p-sortIcon field="estadoInventario"></p-sortIcon>
                                </th>
                                <th pSortableColumn="fechaVerificacion" style="min-width: 11rem">
                                    Última verificación<p-sortIcon field="fechaVerificacion"></p-sortIcon>
                                </th>
                                <th style="width: 8rem">Acciones</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-registro>
                            <tr>
                                <td>{{ registro.codigoBarra || '—' }}</td>
                                <td>{{ registro.codigoLocalizacion || '—' }}</td>
                                <td>{{ registro.titulo || '—' }}</td>
                                <td>{{ registro.autor || '—' }}</td>
                                <td>
                                    <p-tag
                                        [value]="formatearEstado(registro.estadoInventario)"
                                        [severity]="obtenerSeveridadEstado(registro.estadoInventario)"
                                    ></p-tag>
                                </td>
                                <td>{{ formatearFecha(registro.fechaVerificacion) }}</td>
                                <td class="flex gap-2">
                                    <button
                                        pButton
                                        type="button"
                                        icon="pi pi-check"
                                        class="p-button-rounded p-button-success"
                                        pTooltip="Confirmar presencia"
                                        tooltipPosition="bottom"
                                        (click)="marcarEncontrado(registro)"
                                        [disabled]="estaProcesando(registro) || esEstadoActual(registro, 'ENCONTRADO')"
                                    ></button>
                                    <button
                                        pButton
                                        type="button"
                                        icon="pi pi-times"
                                        class="p-button-rounded p-button-danger"
                                        pTooltip="Marcar como no encontrado"
                                        tooltipPosition="bottom"
                                        (click)="marcarNoEncontrado(registro)"
                                        [disabled]="estaProcesando(registro) || esEstadoActual(registro, 'NO_ENCONTRADO')"
                                    ></button>
                                </td>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="emptymessage">
                            <tr>
                                <td colspan="7" class="text-center">No hay registros por mostrar</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </div>`,
    providers: [MessageService, ConfirmationService]
})
export class InventarioMaterial implements AfterViewInit {
    titulo = 'Inventario de material bibliográfico';
    form: FormGroup;
    loading = false;
    resultados: InventarioItem[] = [];
    ultimaBusqueda: string | null = null;
    private indices = new Map<string, number>();
    private clavesFallback = new WeakMap<InventarioItem, string>();
    private secuencia = 0;
    procesando: Record<string, boolean> = {};

    @ViewChild('codigoInput') codigoInput?: ElementRef<HTMLInputElement>;

    constructor(
        private formBuilder: FormBuilder,
        private inventarioService: InventarioService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        this.form = this.formBuilder.group({
            codigoBarra: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9-]+$/)]]
        });
    }

    ngAfterViewInit(): void {
        this.enfocarCodigo();
    }

    buscar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const codigo = (this.form.value.codigoBarra || '').trim();
        if (!codigo) {
            this.form.get('codigoBarra')?.setValue('');
            this.enfocarCodigo();
            return;
        }
        this.loading = true;
        this.ultimaBusqueda = codigo;
        this.inventarioService
            .buscarPorCodigo(codigo)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.enfocarCodigo();
                })
            )
            .subscribe({
                next: lista => {
                    if (!lista.length) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Sin resultados',
                            detail: 'No se encontraron materiales para el código indicado.'
                        });
                        return;
                    }
                    this.fusionarResultados(lista);
                },
                error: (error: HttpErrorResponse) => {
                    const detail =
                        error.error?.message ||
                        error.message ||
                        'No fue posible completar la búsqueda. Intente nuevamente.';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail });
                }
            });
    }

    limpiar(): void {
        this.form.reset({ codigoBarra: '' });
        this.resultados = [];
        this.indices.clear();
        this.clavesFallback = new WeakMap<InventarioItem, string>();
        this.secuencia = 0;
        this.procesando = {};
        this.ultimaBusqueda = null;
        this.enfocarCodigo();
    }

    marcarEncontrado(item: InventarioItem): void {
        this.actualizarEstado(item, 'ENCONTRADO', 'Material verificado como presente.');
    }

    marcarNoEncontrado(item: InventarioItem): void {
        this.confirmationService.confirm({
            message: '¿Confirma que el material no se encuentra físicamente en inventario?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => this.actualizarEstado(item, 'NO_ENCONTRADO', 'Material marcado como no encontrado.')
        });
    }

    private actualizarEstado(item: InventarioItem, estado: EstadoInventario, mensaje: string): void {
        const clave = this.obtenerClaveProcesando(item);
        if (this.procesando[clave]) {
            return;
        }
        this.procesando[clave] = true;
        this.inventarioService
            .actualizarEstado(item, estado)
            .pipe(
                finalize(() => {
                    delete this.procesando[clave];
                })
            )
            .subscribe({
                next: actualizado => {
                    if (actualizado) {
                        this.fusionarResultados([actualizado]);
                    } else {
                        this.aplicarEstadoLocal(item, estado);
                    }
                    this.messageService.add({ severity: 'success', summary: 'Inventario', detail: mensaje });
                },
                error: (error: HttpErrorResponse) => {
                    const detail =
                        error.error?.message ||
                        error.message ||
                        'No se pudo actualizar el estado del material.';
                    this.messageService.add({ severity: 'error', summary: 'Error', detail });
                }
            });
    }

    private fusionarResultados(nuevos: InventarioItem[]): void {
        if (!nuevos.length) {
            return;
        }
        nuevos.forEach(nuevo => {
            const clave = this.claveDatos(nuevo);
            if (clave && this.indices.has(clave)) {
                const posicion = this.indices.get(clave)!;
                Object.assign(this.resultados[posicion], nuevo);
            } else {
                const copia = { ...nuevo };
                this.resultados.push(copia);
                const nuevaClave = this.claveDatos(copia);
                if (nuevaClave) {
                    this.indices.set(nuevaClave, this.resultados.length - 1);
                } else {
                    this.obtenerClaveProcesando(copia);
                }
            }
        });
        this.reconstruirIndices();
    }

    private reconstruirIndices(): void {
        this.indices.clear();
        this.resultados.forEach((item, indice) => {
            const clave = this.claveDatos(item);
            if (clave) {
                this.indices.set(clave, indice);
            }
        });
    }

    private aplicarEstadoLocal(item: InventarioItem, estado: EstadoInventario): void {
        item.estadoInventario = estado;
        item.fechaVerificacion = new Date().toISOString();
    }

    private claveDatos(item: InventarioItem): string | null {
        if (item.codigoBarra && item.codigoBarra.trim()) {
            return `cb-${item.codigoBarra.trim()}`;
        }
        if (Number.isFinite(item.id) && item.id) {
            return `id-${item.id}`;
        }
        if (item.codigoLocalizacion && item.codigoLocalizacion.trim()) {
            return `cl-${item.codigoLocalizacion.trim()}`;
        }
        return null;
    }

    private obtenerClaveProcesando(item: InventarioItem): string {
        const clave = this.claveDatos(item);
        if (clave) {
            return clave;
        }
        let fallback = this.clavesFallback.get(item);
        if (!fallback) {
            fallback = `tmp-${this.secuencia++}`;
            this.clavesFallback.set(item, fallback);
        }
        return fallback;
    }

    estaProcesando(item: InventarioItem): boolean {
        const clave = this.obtenerClaveProcesando(item);
        return !!this.procesando[clave];
    }

    esEstadoActual(item: InventarioItem, estado: EstadoInventario): boolean {
        const actual = (item.estadoInventario || '').toUpperCase();
        return actual === estado.toUpperCase();
    }

    formatearEstado(estado?: string | null): string {
        if (!estado) {
            return 'Pendiente';
        }
        const normalizado = estado.replace(/_/g, ' ').toLowerCase();
        return normalizado.charAt(0).toUpperCase() + normalizado.slice(1);
    }

    obtenerSeveridadEstado(estado?: string | null): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch ((estado || '').toUpperCase()) {
            case 'ENCONTRADO':
                return 'success';
            case 'NO_ENCONTRADO':
                return 'danger';
            case 'PENDIENTE':
            case 'POR_VERIFICAR':
                return 'warn';
            default:
                return 'info';
        }
    }

    formatearFecha(valor?: string | null): string {
        if (!valor) {
            return '—';
        }
        const fecha = new Date(valor);
        if (Number.isNaN(fecha.getTime())) {
            return valor;
        }
        return new Intl.DateTimeFormat('es-PE', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }).format(fecha);
    }

    private enfocarCodigo(): void {
        setTimeout(() => {
            if (this.codigoInput?.nativeElement) {
                this.codigoInput.nativeElement.focus();
                this.codigoInput.nativeElement.select();
            }
        }, 100);
    }

    onGlobalFilter(table: Table, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
