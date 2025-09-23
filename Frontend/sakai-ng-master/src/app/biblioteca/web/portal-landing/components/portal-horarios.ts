import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { PortalService } from '../../../services/portal.service';
import { PortalHorario } from '../../../interfaces/portalHorario';
import { LineBreakPipe } from '../pipes/line-break.pipe';

@Component({
    selector: 'portal-horarios',
    standalone: true,
    imports: [CommonModule, LineBreakPipe],
    template: `
    <div id="portal-horarios" class="py-10">
        <div class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
            <div class="text-surface-900 text-center dark:text-surface-0 font-normal mb-2 text-4xl">Horarios</div>
            <div class="grid grid-cols-12 gap-4 justify-center">
                <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0" *ngFor="let horario of data">
                    <div style="min-height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))">
                        <div class="p-4 bg-surface-0 dark:bg-surface-900" style="border-radius: 8px">
                            <div class="flex items-center justify-center bg-rose-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
                                <i class="pi pi-fw pi-map-marker !text-2xl text-rose-700"></i>
                            </div>
                            <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-l font-semibold">{{ horario.sedeDescripcion }}</div>
                            <span class="text-surface-600 dark:text-surface-200 block break-words">
                                <i class="pi pi-fw pi-clock text-primary"></i>
                                <span [innerHTML]="horario.descripcion | lineBreak"></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    providers: [MessageService]
})
export class PortalHorarios implements OnInit {
    data: PortalHorario[] = [];

    constructor(private portalService: PortalService, private messageService: MessageService) {}

    ngOnInit() {
        this.listar();
    }

    replaceLineBreaks(value: string): string {
        return (value ?? '').replace(/\n|\/n/g, '\n');
    }

    listar() {
        this.portalService.listarHorarios().subscribe({
            next: res => {
                if (res.p_status === 0) {
                    // Solo mostrar los horarios disponibles (estadoId === 2)
                    this.data = res.data.filter(h => h.estadoId === 2);
                } else {
                    this.messageService.add({ severity: 'warn', detail: res.message });
                }
            },
            error: () => {
                this.messageService.add({ severity: 'error', detail: 'Error al cargar horarios' });
            }
        });
    }
}
