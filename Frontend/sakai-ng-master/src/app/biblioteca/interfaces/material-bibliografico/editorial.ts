import { EscuelaProfesional } from "../escuela-profesional";


export class Editorial {
    id: number;
    autorPrincipal:string;
    autorSecundario:string;
    autorInstitucional:string;
    editorial:string;
    coordinador:string;
    director:string;
    compilador:string;
    pais:any;
    ciudad:any;
    idioma:any;
    serie:string;
    descripcionFisica:any;
    cantidad:number;
    anioPublicacion:any;
    anio:string;
    edicion:any;
    reimpresion:any;
    isbn:any;
    issn:any;


    constructor(init?: Partial<Editorial>) {
        this.id = 0;
        this.autorPrincipal='';
        this.autorSecundario='';
        this.autorInstitucional='';
        this.editorial='';
        this.coordinador='';
        this.director='';
        this.compilador='';
        this.pais=null;
        this.ciudad=null;
        this.idioma=null;
        this.serie='';
        this.descripcionFisica=null;
        this.cantidad=0;
        this.anioPublicacion=null;
        this.anio='';
        this.edicion=null;
        this.reimpresion=null;
        this.isbn=null;
        this.issn=null;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
