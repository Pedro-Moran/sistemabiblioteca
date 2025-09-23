import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ClaseGeneral } from '../../interfaces/clase-general';
import { GenericoService } from '../../services/generico.service';
import { ConfListaComponent } from '../conf-lista';

@Component({
    selector: 'app-programa-academico',
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
export class ProgramaAcademico {
    
                titulo:string="Programa académico";
                data: ClaseGeneral[]= [];;
                modulo:string="programa-academico";
                loading: boolean = true;
                constructor(private genericoService: GenericoService) { }
                ngOnInit() {
                  this.genericoService.conf_event_get(this.modulo+'/lista')
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
