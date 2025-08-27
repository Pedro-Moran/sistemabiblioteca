import { Component } from '@angular/core';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Ventas recientes</div>
        <p-table [value]="productos" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template #header>
                <tr>
                    <th>Imagen</th>
                    <th pSortableColumn="nombre">Nombre <p-sortIcon field="nombre"></p-sortIcon></th>
                    <th pSortableColumn="precio">Precio <p-sortIcon field="precio"></p-sortIcon></th>
                    <th>Ver</th>
                </tr>
            </ng-template>
            <ng-template #body let-producto>
                <tr>
                    <td style="width: 15%; min-width: 5rem;">
                        <img [src]="producto.imagen" class="shadow-lg" [alt]="producto.nombre" width="50" />
                    </td>
                    <td style="width: 35%; min-width: 7rem;">{{ producto.nombre }}</td>
                    <td style="width: 35%; min-width: 8rem;">{{ producto.precio | currency: 'USD' }}</td>
                    <td style="width: 15%;">
                        <button pButton pRipple type="button" icon="pi pi-search" class="p-button p-component p-button-text p-button-icon-only"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    </div>`
})
export class RecentSalesWidget {
    productos: any[] = [];

    constructor(private dashboardService: DashboardService) {}

    ngOnInit() {
        this.dashboardService.recientes().subscribe((res) => (this.productos = res));
    }
}
