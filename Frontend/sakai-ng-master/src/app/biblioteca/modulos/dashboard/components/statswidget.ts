import { Component } from '@angular/core';
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
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Material bibliográfico</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ datos.materiales }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ datos.prestadosMateriales }} </span>
                <span class="text-muted-color">prestados</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3" *ngIf="hasRole('ROLE_SALA_EQUIPOS_COMPUTO')">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Equipos de cómputo</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ datos.equipos }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-desktop text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ datos.prestadosEquipos }} </span>
                <span class="text-muted-color">prestados</span>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3" *ngIf="hasRole('ROLE_USUARIOS')">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Usuarios</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ datos.usuarios }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">{{ datos.nuevosUsuarios }} </span>
                <span class="text-muted-color">registrados</span>
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
export class StatsWidget {
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
        this.dashboardService.stats().subscribe((res) => (this.datos = res));
    }

    hasRole(role: string): boolean {
        return this.roles.includes(role);
    }
}
