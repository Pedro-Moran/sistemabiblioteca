import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { Sedes } from '../../interfaces/sedes';
import { GenericoService } from '../../services/generico.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TemplateModule } from '../../template.module';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget,TemplateModule],
    template: `
    <div class="flex flex-col grow basis-0 gap-2 mb-8">
                        <label for="sede" class="block text-sm font-medium">Local/Filial</label>
                        <p-select [(ngModel)]="sedeFiltro" [options]="dataSedesFiltro" optionLabel="descripcion" placeholder="Seleccionar" />

                        </div>



        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents" />
            <div class="col-span-12 xl:col-span-6">
                <app-recent-sales-widget />
                <app-best-selling-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div>
        </div>
        <p-confirmDialog [style]="{width: '450px'}"></p-confirmDialog>
        <p-toast></p-toast>
    `,
      providers: [MessageService, ConfirmationService]
})
export class Dashboard {
    dataSedesFiltro: Sedes[] = [];
    sedeFiltro: Sedes = new Sedes();
    constructor(private genericoService: GenericoService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

    async ngOnInit() {
        await this.ListaSede();
    }
  async ListaSede() {
    try {
      const result: any = await this.genericoService.sedes_get('sede/lista-activo').toPromise();
      if (result.status === "0") {

        this.dataSedesFiltro = result.data;
        this.sedeFiltro = this.dataSedesFiltro[0];
      }
    } catch (error) {
      console.log(error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error. No se pudo cargar roles' });
    }

  }
}
