export class Tipo {
    id: number;
    descripcion: string;
    activo:boolean;
    /** Valor que se envía al backend, por ejemplo "PRESTAMO_EN_SALA" */
    codigo?: string | null;
    constructor(init?: Partial<Tipo>) {
        this.id = 0;
        this.descripcion='';
        this.activo=false;
        this.codigo=null;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
