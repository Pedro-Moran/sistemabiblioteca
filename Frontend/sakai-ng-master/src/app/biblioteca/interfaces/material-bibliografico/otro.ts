import { Especialidad } from "./especialidad";
import { Detalle } from "./detalle";

export class Otro {
    id: number;
    codigo: string;
    tituloArticulo:string;
    tituloRevista:string;
    autorPrincipal:string;
    descripcionRevista:string;

    descripcionFisica:any;
    cantidad:number;
    formatoDigital:boolean;
    urlPublicacion:string;
    descriptores:string;
    notasGeneral:string;
    portada:boolean;
    detalle: Detalle[];
    constructor(init?: Partial<Otro>) {
        this.id = 0;
        this.codigo='';
        this.tituloArticulo='';
        this.tituloRevista='';
        this.autorPrincipal='';
        this.descripcionRevista='';
        this.descripcionFisica=null;
        this.cantidad=0;
        this.formatoDigital=false;
        this.urlPublicacion='';
        this.descriptores='';
        this.notasGeneral='';
        this.portada=false;
        this.detalle=[];
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
