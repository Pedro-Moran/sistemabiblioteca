import { Component } from '@angular/core';
import { TemplateModule } from '../../template.module';
import { MessageService } from 'primeng/api';
import { VisitasBibliotecaService } from '../../services/visitas-biblioteca.service';

@Component({
    selector: 'app-visitas-biblioteca',
    standalone: true,
    imports: [TemplateModule],
    template: `
    <p-toast></p-toast>
    <div class="card flex flex-col gap-4 w-full">
        <h5>Registro de visitas a biblioteca</h5>
        <form (ngSubmit)="registrar()" #f="ngForm" class="flex flex-col gap-4 w-full">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="codigo">Código de usuario</label>
                    <input id="codigo" type="text" pInputText [(ngModel)]="codigoUsuario" name="codigoUsuario" required />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="estado">Estado</label>
                    <p-select id="estado" [(ngModel)]="estado" name="estado" [options]="estados" optionLabel="label" optionValue="value" placeholder="Seleccionar" required></p-select>
                </div>
            </div>
            <div>
                <button pButton type="submit" label="Registrar" [disabled]="loading || f.invalid"></button>
            </div>
        </form>
    </div>
    `,
    providers: [MessageService]
})
export class VisitasBiblioteca {
    codigoUsuario = '';
    estado = 1;
    loading = false;
    estados = [
        { label: 'Ingreso', value: 1 },
        { label: 'Salida', value: 2 }
    ];

    constructor(private svc: VisitasBibliotecaService, private msg: MessageService) {}

    registrar() {
        if (!this.codigoUsuario || !this.estado) {
            this.msg.add({ severity: 'warn', detail: 'Complete los campos requeridos.' });
            return;
        }
        this.loading = true;
        this.svc.registrarVisita(this.codigoUsuario, this.estado).subscribe({
            next: () => {
                this.msg.add({ severity: 'success', detail: 'Visita registrada correctamente.' });
                this.codigoUsuario = '';
                this.estado = 1;
            },
            error: () => this.msg.add({ severity: 'error', detail: 'No se pudo registrar la visita.' }),
            complete: () => (this.loading = false)
        });
    }
}
