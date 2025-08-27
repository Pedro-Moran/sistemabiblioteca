import { Especialidad } from "./especialidad";
import { Detalle } from "./detalle";

export class Revista {
    id: number;
    codigo:string;
    director:string;
    institucion:string;
    especialidad:Especialidad | null;
    titulo:string;
    tituloAnterior:string;
    editorialPublicacion:string;
    periodicidad:any;
    pais:any;
    ciudad:any;

    descripcionFisica:any;
    cantidad:number;
    anioPublicacion:any;
    anio:string;
    isbn:any;
    formatoDigital:boolean;
    urlPublicacion:string;
    descriptores:string;
    portada:boolean;
    detalle: Detalle[];
    constructor(init?: Partial<Revista>) {
        this.id = 0;
        this.codigo='';
        this.director='';
        this.institucion='';
        this.especialidad=null;
        this.titulo='';
        this.tituloAnterior='';
        this.editorialPublicacion='';
        this.periodicidad=null;
        this.pais=null;
        this.ciudad=null;
        this.descripcionFisica=null;
        this.cantidad=0;
        this.anioPublicacion=null;
        this.anio='';
        this.isbn=null;
        this.formatoDigital=false;
        this.urlPublicacion='';
        this.descriptores='';
        this.portada=false;
        this.detalle=[];
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
