import { Tipo } from "./tipo";

export class LibroElectronico {
    id: number;
    tipo:Tipo | null;
    titulo: string;
    descripcion: string;
    urlPortada:string;
    link:string;
    activo:boolean;
    enlace?: string;
    autor?: string;
    tipoId?:number;
    constructor(init?: Partial<LibroElectronico>) {
        this.id = 0;
        this.tipo=null;
        this.titulo='';
        this.descripcion='';
        this.activo=false;
        this.urlPortada='';
        this.link='';
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
