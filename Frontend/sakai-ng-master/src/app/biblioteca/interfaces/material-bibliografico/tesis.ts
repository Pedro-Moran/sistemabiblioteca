import { Especialidad } from "./especialidad";
import { Detalle } from "./detalle";

export class Tesis {
    id: number;
    codigo:string;
    titulo:string;
    autorPrincipal:string;
    pais:any;
    ciudad:any;

    descripcionFisica:any;
    numeroPaginas:any;
    cantidad:number;
    anioPublicacion:any;
    anio:string;
    especialidad:Especialidad | null;
    formatoDigital:boolean;
    urlPublicacion:string;
    descriptores:string;
    notasTesis:string;
    notasGeneral:string;
    portada:boolean;
    detalle: Detalle[];
    constructor(init?: Partial<Tesis>) {
        this.id = 0;
        this.codigo='';
        this.titulo='';
        this.autorPrincipal='';
        this.pais=null;
        this.ciudad=null;
        this.descripcionFisica=null;
        this.numeroPaginas=null;
        this.cantidad=0;
        this.anioPublicacion=null;
        this.anio='';
        this.especialidad=null;
        this.formatoDigital=false;
        this.urlPublicacion='';
        this.descriptores='';
        this.notasTesis='';
        this.notasGeneral='';
        this.portada=false;
        this.detalle=[];
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
