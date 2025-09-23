import { ClaseGeneral } from "./clase-general";
import { EstadoRecurso } from "./estado-recurso";
import { Sedes } from "./sedes";
import { TipoRecurso } from "./tipo-recurso";

export class Material {
    id: number;
    tipoRecurso: TipoRecurso | null;
    titulo: string;
    descripcion: string;
    autorPrincipal:string;
    autorSecundario:string;
    ciudad:string;
    genero:String;
    editorial:string;
    anioPublicacion:String;
    numPaginas:number;
    img:string;
    url:string;
    tipoActivo:ClaseGeneral | null;
    idMaterial?: number;
    codigo?: string;

    autor?: string;
    anio?: number;
    coleccion?: string;
    numeroIngreso?: string;
    idSede?: number;
    tipoAdquisicion?: string;
    tipoMaterial?: string;
    fechaIngreso?: Date;
    estado?: string;
    tema?: string;



    imagenUrl?: string;
    fechaCreacion?: Date;
    usuarioCreacion?: string;
    fechaModificacion?: Date;
    usuarioModificacion?: string;
    constructor(init?: Partial<Material>) {
        this.id = 0;
        this.tipoRecurso=null;
        this.titulo='';
        this.descripcion='';
        this.autorPrincipal='';
        this.autorSecundario='';
        this.ciudad='';
        this.genero='';
        this.editorial='';
        this.anioPublicacion='';
        this.numPaginas=0;
        this.img='';
        this.url='';
        this.tipoActivo=null;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
