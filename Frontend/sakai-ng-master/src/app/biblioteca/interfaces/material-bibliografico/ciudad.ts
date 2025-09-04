export class Ciudad {
    id: number;
    descripcion: string;
    activo:boolean;
    ciudadCodigo?: string;
    nombreCiudad?: string;
    paisId?: string;
    constructor(init?: Partial<Ciudad>) {
        this.id = 0;
        this.descripcion='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
