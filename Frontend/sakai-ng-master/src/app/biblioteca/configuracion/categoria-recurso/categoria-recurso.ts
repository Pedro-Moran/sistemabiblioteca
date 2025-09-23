import { Component } from '@angular/core';
import { ConfListaComponent } from "../conf-lista";
import { ClaseGeneral } from '../../interfaces/clase-general';
import { GenericoService } from '../../services/generico.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-categoria-recurso',
    standalone: true,
    template: ` @if (data.length > 0) {
        <app-conf-lista 
          [titulo]="titulo" 
          [loading]="loading"  
          [data]="data" 
          [modulo]="modulo">
        </app-conf-lista>
      }`,
    imports: [ConfListaComponent]
})
export class CategoriaRecurso {
    titulo:string="Catergorias recurso";
    data: ClaseGeneral[]= [];;
    modulo:string="categoria-recurso";
    loading: boolean = true;
    constructor(private genericoService: GenericoService) { }
    ngOnInit() {
      this.genericoService.categoriarecurso_get(this.modulo+'/lista')
      .subscribe(
        (result: any) => {
          this.loading=false;
          if(result.status=="0"){
            this.data=result.data;
          }
        }
        , (error: HttpErrorResponse) => {
          this.loading=false;
        }
      );
    }
  }
