import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TemplateModule } from '../../template.module';
import { Sedes } from '../../interfaces/sedes';
import { ClaseGeneral } from '../../interfaces/clase-general';

@Component({
    selector: 'app-reporte-prestamo-lab-virtual',
    standalone: true,
    template: ` 
        <div class="card flex flex-col gap-4 w-full">
    <h5>{{titulo}}</h5>
    <p-toolbar styleClass="mb-6">
    <div class="flex flex-col w-full gap-4">
                <!-- Primera fila: Sede (2 col), Programa (2 col) y Escuela (3 col) -->
                <div class="grid grid-cols-7 gap-4">
                    <div class="flex flex-col gap-2 col-span-1">
                        <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSede" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-2">
                        <label for="programa" class="block text-sm font-medium">Programa</label>
                        <p-select [(ngModel)]="programaFiltro" [options]="dataPrograma" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-4">
                        <label for="escuela" class="block text-sm font-medium">Escuela</label>
                        <p-select [(ngModel)]="escuelaFiltro" [options]="dataEscuela" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                </div>

                <!-- Segunda fila: Año (2 col), Mes (2 col) y Botón (3 col) -->
                <div class="grid grid-cols-7 gap-4 items-end">
                    <div class="flex flex-col gap-2 col-span-1">
                        <label for="anio" class="block text-sm font-medium">Año</label>
                        <p-select [(ngModel)]="anioFiltro" [options]="dataAnio" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex flex-col gap-2 col-span-1">
                        <label for="mes" class="block text-sm font-medium">Mes</label>
                        <p-select [(ngModel)]="mesFiltro" [options]="dataMes" optionLabel="descripcion" placeholder="Seleccionar" />
                    </div>
                    <div class="flex col-span-3">
                        <button pButton type="button" label="Ver reporte" icon="pi pi-search" 
                            class="p-button-danger" [disabled]="loading" (click)="reporte()" 
                            pTooltip="Ver reporte" tooltipPosition="bottom">
                        </button>
                    </div>
                </div>
            </div>
       
    </p-toolbar>
</div>
`,
            imports: [TemplateModule, TooltipModule],
            providers: [MessageService, ConfirmationService]
})
export class ReportePrestamoLaboratorioVirtual {
    titulo: string = "Préstamos en laboratorio virtual";
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
    loading: boolean = true;

    async ngOnInit() {
        await this.reporte();
    }
    reporte(){}
}
