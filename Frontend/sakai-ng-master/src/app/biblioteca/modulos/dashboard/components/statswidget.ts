import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';

interface Estadisticas {
  materiales: number;
  prestadosMateriales: number;
  equipos: number;
  prestadosEquipos: number;
  usuarios: number;
  nuevosUsuarios: number;
  comentarios: number;
  comentariosRespondidos: number;
}

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `

        <div class="col-span-12 lg:col-span-6 xl:col-span-3" *ngIf="hasRole('ROLE_MATERIAL_BIBLIOGRAFICO')">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div class="flex flex-col gap-1">
                        <span class="text-muted-color font-medium">Material bibliográfico</span>
                        <span class="text-muted-color text-xs uppercase tracking-wide">Total</span>
                        <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl">{{ datos.materiales }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <div class="flex items-baseline gap-2">
                    <span class="text-muted-color text-sm">Total prestados:</span>
                    <span class="text-primary font-semibold text-lg">{{ datos.prestadosMateriales }}</span>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3" *ngIf="hasRole('ROLE_SALA_EQUIPOS_COMPUTO')">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div class="flex flex-col gap-1">
                        <span class="text-muted-color font-medium">Equipos de cómputo</span>
                        <span class="text-muted-color text-xs uppercase tracking-wide">Total</span>
                        <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl">{{ datos.equipos }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-desktop text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <div class="flex items-baseline gap-2">
                    <span class="text-muted-color text-sm">Total prestados:</span>
                    <span class="text-primary font-semibold text-lg">{{ datos.prestadosEquipos }}</span>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3" *ngIf="hasRole('ROLE_USUARIOS')">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div class="flex flex-col gap-1">
                        <span class="text-muted-color font-medium">Usuarios</span>
                        <span class="text-muted-color text-xs uppercase tracking-wide">Total</span>
                        <div class="text-surface-900 dark:text-surface-0 font-semibold text-2xl">{{ datos.usuarios }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <div class="flex items-baseline gap-2">
                    <span class="text-muted-color text-sm">Total registrados:</span>
                    <span class="text-primary font-semibold text-lg">{{ datos.nuevosUsuarios }}</span>
                </div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3" *ngIf="hasRole('ROLE_COMENTARIOS')">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Comentarios</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ datos.comentarios }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comment text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ datos.comentariosRespondidos }} </span>
                <span class="text-muted-color">respondidos</span>
            </div>
        </div>`
})
export class StatsWidget implements OnInit {
    datos: Estadisticas = {
        materiales: 0,
        prestadosMateriales: 0,
        equipos: 0,
        prestadosEquipos: 0,
        usuarios: 0,
        nuevosUsuarios: 0,
        comentarios: 0,
        comentariosRespondidos: 0
    };

    private roles: string[] = [];

    constructor(private dashboardService: DashboardService, private authService: AuthService) {}

    ngOnInit() {
        this.roles = this.authService.getRoles();
        this.dashboardService.stats().subscribe({
            next: (res) => {
                const estadisticas = this.normalizarRespuesta(res);
                this.datos = { ...this.datos, ...estadisticas };
            },
            error: () => {
                this.datos = { ...this.datos };
            }
        });
    }

    hasRole(role: string): boolean {
        return this.roles.includes(role);
    }

    private normalizarRespuesta(respuesta: unknown): Partial<Estadisticas> {
        const origen = this.desenvolverRespuesta(respuesta);
        if (!origen || typeof origen !== 'object') {
            return {};
        }

        const datos = origen as Record<string, unknown>;
        const resultado: Partial<Estadisticas> = {};

        this.asignarSiTiene(resultado, 'materiales', datos, [
            'materiales',
            'totalMateriales',
            'materialBibliografico',
            'totalMaterialBibliografico'
        ]);
        this.asignarSiTiene(resultado, 'prestadosMateriales', datos, [
            'prestadosMateriales',
            'materialesPrestados',
            'totalPrestamosMateriales',
            'totalMaterialesPrestados'
        ]);
        this.asignarSiTiene(resultado, 'equipos', datos, [
            'equipos',
            'totalEquipos',
            'equiposComputo',
            'totalEquiposComputo'
        ]);
        this.asignarSiTiene(resultado, 'prestadosEquipos', datos, [
            'prestadosEquipos',
            'equiposPrestados',
            'totalPrestamosEquipos',
            'equiposComputoPrestados'
        ]);
        this.asignarSiTiene(resultado, 'usuarios', datos, [
            'usuarios',
            'totalUsuarios',
            'usuariosRegistrados',
            'totalRegistrados'
        ]);
        this.asignarSiTiene(resultado, 'nuevosUsuarios', datos, [
            'nuevosUsuarios',
            'registrados',
            'usuariosNuevos',
            'totalUsuariosRegistrados'
        ]);
        this.asignarSiTiene(resultado, 'comentarios', datos, ['comentarios', 'totalComentarios']);
        this.asignarSiTiene(resultado, 'comentariosRespondidos', datos, [
            'comentariosRespondidos',
            'totalComentariosRespondidos',
            'respondidos'
        ]);

        return resultado;
    }

    private desenvolverRespuesta(valor: unknown): unknown {
        if (!valor || typeof valor !== 'object') {
            return valor;
        }

        const posible = valor as Record<string, unknown>;
        const llaves = ['data', 'resultado', 'result', 'payload', 'estadisticas'];

        for (const llave of llaves) {
            if (posible[llave] !== undefined && posible[llave] !== null) {
                return this.desenvolverRespuesta(posible[llave]);
            }
        }

        if (Array.isArray(valor)) {
            return valor.length > 0 ? this.desenvolverRespuesta(valor[0]) : {};
        }

        return valor;
    }

    private asignarSiTiene(
        destino: Partial<Estadisticas>,
        propiedad: keyof Estadisticas,
        origen: Record<string, unknown>,
        posiblesLlaves: string[]
    ): void {
        const numero = this.extraerNumero(origen, posiblesLlaves);
        if (numero !== undefined) {
            destino[propiedad] = numero;
        }
    }

    private extraerNumero(origen: Record<string, unknown>, llaves: string[]): number | undefined {
        for (const llave of llaves) {
            const valor = origen[llave];
            if (valor !== undefined && valor !== null) {
                const numero = Number(valor);
                if (Number.isFinite(numero)) {
                    return numero;
                }
            }
        }
        return undefined;
    }
}
