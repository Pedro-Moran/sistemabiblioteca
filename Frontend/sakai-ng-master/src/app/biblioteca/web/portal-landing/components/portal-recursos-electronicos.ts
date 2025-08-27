import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';
import { SplitterModule } from 'primeng/splitter';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { Product, ProductService } from '../../../../pages/service/product.service';
import { PhotoService } from '../../../../pages/service/photo.service';
import { DividerModule } from 'primeng/divider';
import { PortalService } from '../../../services/portal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PortalNoticia } from '../../../interfaces/portalNoticias';
import { AuthService } from '../../../services/auth.service';
import { TipoRecurso } from '../../../interfaces/tipo-recurso';
import { RecursoDigitalDTO } from '../../../interfaces/RecursoDigitalDTO';

@Component({
    selector: 'portal-recursos-electronicos',
    standalone: true,
    imports: [CommonModule,TabsModule,SplitterModule,CarouselModule, ButtonModule,TagModule,DividerModule],
    encapsulation: ViewEncapsulation.None,
    template: ` <div id="portal-recursos-electronicos" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
    <div class="grid grid-cols-12 gap-4 justify-center">

    <div class="col-span-12 flex justify-center items-center mt-20 mb-6">

    <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Recursos electr&oacute;nicos</div>

    </div>
        <div class="col-span-12 md:col-span-12 lg:col-span-12 p-0 lg:pb-8 mt-6 lg:mt-0">
        <p-tabs [value]="activeIndex" scrollable (valueChange)="cambiarTipo($event)">
                            <p-tablist>
                                <p-tab *ngFor="let t of tipos; let i = index" [value]="i">{{t.descripcion}}</p-tab>
                            </p-tablist>
                            <p-tabpanels>
                                <p-tabpanel *ngFor="let t of tipos; let i = index" [value]="i">
                                <section class="">
                                    <ng-container *ngIf="data.length; else noRecursos">
                                    <div class="grid grid-cols-12 gap-4 justify-between mt-20 md:mt-0">
                                            <div class="col-span-12 lg:col-span-4 p-0 md:p-4" *ngFor="let item of data">
                                                <div class="p-4 flex flex-col border-surface-200 dark:border-surface-600 pricing-card cursor-pointer border-2 hover:border-primary duration-300 transition-all" style="border-radius: 10px">
                                                <a (click)="abrir(item)">
                                                <img class="w-full h-56 object-cover" [src]="item.imagenUrl" [alt]="item.titulo" >
                                                </a>
                                                <p class="mt-2 text-center font-semibold">{{item.titulo}}</p>

                                                </div>
                                            </div>
                                        </div>
                                    </ng-container>
                                    <ng-template #noRecursos>
                                        <p class="text-center text-gray-500">No hay registros</p>
                                    </ng-template>
                                </section>
                                </p-tabpanel>
                                <p-tabpanel value="1">
                                </p-tabpanel>
                                <p-tabpanel value="2">
                                </p-tabpanel>
                                <p-tabpanel value="3">
                                </p-tabpanel>
                            </p-tabpanels>
        </p-tabs>
        </div>
    </div>
</div>
`,
                    providers: [MessageService, ConfirmationService,ProductService,PhotoService]
})

export class PortalRecursosElectronicos implements OnInit{
    loading: boolean = true;
    modulo: string = "catalogo";
   data: RecursoDigitalDTO[] = [];
   tipos: TipoRecurso[] = [];
   activeIndex: number = 0;
   constructor(private router: Router,private portalService: PortalService, private authService: AuthService) { }

   ngOnInit() {
      this.portalService.listarTipoRecursos()
        .subscribe(res => {
          if(res.p_status === 0){
            this.tipos = res.data;
            if(this.tipos.length){
              const idx = this.tipos.findIndex(t => t.descripcion.toLowerCase().includes('base de datos virtual'));
              this.activeIndex = idx >= 0 ? idx : 0;
              this.cambiarTipo(this.activeIndex);
            }
          }
        });
   }

      cambiarTipo(index: any){
        const i = Number(index);
        this.activeIndex = i;
        const tipo = this.tipos[i];
        if(!tipo) return;
        this.loading = true;
        this.portalService.listarRecursosDigitalesPorTipo(tipo.id)
          .subscribe({
            next: res => {
              this.loading = false;
              if(res.p_status === 0){
                this.data = res.data;
              } else {
                this.data = [];
              }
            },
            error: () => this.loading = false
          });
      }

      abrir(obj: RecursoDigitalDTO){
        if(!this.authService.idAuthenticated()){
          if(obj.id){
            localStorage.setItem('redirectRecurso', obj.id.toString());
          }
          alert('Debe iniciar sesi\u00f3n para acceder al recurso');
          this.router.navigate(['/login']);
          return;
        }
        if(!obj.id) return;
        this.portalService.obtenerEnlaceRecurso(obj.id).subscribe(res => {
          if(res.p_status === 0){
            window.open(res.data, '_blank');
          }
        });
      }
}
