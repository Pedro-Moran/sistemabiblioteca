import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TemplateModule } from '../../../template.module';
import { BibliotecaDTO, DetalleBibliotecaDTO } from '../../../interfaces/material-bibliografico/biblioteca.model';
import { MaterialBibliograficoService } from '../../../services/material-bibliografico.service';

@Component({
    selector: 'portal-disponible-ejemplar',
    imports: [ButtonModule, RippleModule, TemplateModule],
    template: `
       <p-dialog [(visible)]="displayDialog" [modal]="true" [closable]="false" [style]="{width: '80vw'}" position:right>
    <ng-template pTemplate="header">
        <div class="flex justify-between items-center w-full">
            <span class="text-lg font-semibold">LISTA DE MATERIAL BIBLIOGRÁFICO</span>
            <button pButton icon="pi pi-times" class="p-button-rounded p-button-text" (click)="displayDialog = false"></button>
        </div>
    </ng-template>

    <div class="p-4 grid md:grid-cols-3 lg:grid-cols-12 gap-4">
    <!-- Imagen del libro -->


    <!-- Detalles del libro -->
    <div class="col-span-12 space-y-3">

        <p-table [value]="detalle" showGridlines>
            <ng-template pTemplate="header">
                <tr>
                    <th>Local/Filial</th>
                    <th>Tipo de Material</th>
                    <th>Nro Ingreso</th>
                    <th>Estado</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-objetoDetalle>
                <tr>
                    <td>{{ objetoDetalle.sede?.descripcion || '—' }}</td>
                    <td>{{ objetoDetalle.tipoMaterial?.descripcion || '—' }}</td>
                    <td>{{ objetoDetalle.numeroIngreso || '—' }}</td>
                    <td>{{ objetoDetalle.estadoDescripcion || '—' }}</td>
                </tr>
            </ng-template>
        </p-table>
        <div class="text-gray-700">
            <h4><b>Total de registros: </b>{{ detalle.length }}</h4>
        </div>
    </div>
</div>

</p-dialog>

    `
})
export class PortalDisponibleEjemplar implements OnChanges {
    @Input() displayDialog: boolean = false;
    @Input() objeto: BibliotecaDTO | null = null;

    detalle: DetalleBibliotecaDTO[] = [];

    constructor(private materialService: MaterialBibliograficoService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['objeto'] && this.objeto) {
            if (this.objeto.detalles && this.objeto.detalles.length) {
                this.detalle = this.objeto.detalles;
            } else if (this.objeto.id != null) {
                this.materialService
                    .listarDetallesPorBiblioteca(this.objeto.id, false)
                    .subscribe(list => (this.detalle = list));
            }

        }
    }
}
