import { EstadoRecurso } from "./estado-recurso";
import { Sedes } from "./sedes";
import { TipoRecurso } from "./tipo-recurso";

export class Recurso {
    id: number;
    tipoRecurso: TipoRecurso | null;
    sede: Sedes;
    nombre: string;
    descripcion: string;
    estado:EstadoRecurso;
    codigo:string;
    capacidad:number;
    ubicacion:string;
    caracteristicas:string;
    activo:boolean;
    constructor(init?: Partial<Recurso>) {
        this.id = 0;
        this.tipoRecurso=new TipoRecurso();
        this.sede=new Sedes();
        this.nombre='';
        this.descripcion='';
        this.estado=new EstadoRecurso();
        this.codigo='';
        this.capacidad=0;
        this.ubicacion='';
        this.caracteristicas='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
  