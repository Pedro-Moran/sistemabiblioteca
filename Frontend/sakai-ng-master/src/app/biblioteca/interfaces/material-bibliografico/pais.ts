export class Pais {
    id: number;
    descripcion: string;
    activo:boolean;
    paisId?: string;
    paisCodigo?: string;
    codigoPais?: string;
    nombrePais?: string;
    constructor(init?: Partial<Pais>) {
        this.id = 0;
        this.descripcion='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
