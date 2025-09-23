import { Tipo } from "./tipo";

export class TipoRecurso {
    id: number;
    tipo:Tipo;
    descripcion: string;
    activo:boolean;
    estado?: number;
    constructor(init?: Partial<TipoRecurso>) {
        this.id = 0;
        this.tipo=new Tipo();
        this.descripcion='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
