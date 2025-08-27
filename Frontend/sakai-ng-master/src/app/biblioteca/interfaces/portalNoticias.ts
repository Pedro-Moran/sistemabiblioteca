import { Sedes } from "./sedes";

export class PortalNoticia {
    id: number;
    urlPortada:string;
    link:string;
    titulo:string;
    subtitulo:string;
    detalle:string;
    anunciante:string;
    fecha: string;
    activo:boolean;
    idnoticia?: number;
      titular?:   string;

      autor?:     string;
      descripcion?: string;
      imagen?:     string;
      imagenUrl?:  string;
      enlace?:    string;
      estadoId?:  number;
      estadoDescripcion?: string;
      usuariocreacion?: string;
      usuariomodificacion?: string;
      fechacreacion?:     string; // ISO
      fechamodificacion?: string;
    constructor(init?: Partial<PortalNoticia>) {
        this.id = 0;
        this.urlPortada='';
        this.link='';
        this.titulo='';
        this.subtitulo='';
        this.detalle='';
        this.anunciante='';
        this.fecha='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
