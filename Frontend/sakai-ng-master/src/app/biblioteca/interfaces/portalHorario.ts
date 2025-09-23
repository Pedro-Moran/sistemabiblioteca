import { Sedes } from "./sedes";

export class PortalHorario {
    id: number;
    sede?: Sedes;
    descripcion: string;
    activo?:boolean;
    estado?: boolean;
    estadoId?:  number;
    estadoDescripcion?: string;
    sedeId: number;
    sedeDescripcion?: string;
    usuarioCreacion?: string;
    usuarioModificacion?: string;
    fechaCreacion?: string;
    fechaModificacion?: string;
    constructor(init?: Partial<PortalHorario>) {
        this.id = 0;
        this.sede = new Sedes();
        this.descripcion = '';
        this.activo = false;
        this.sedeId = 0;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
