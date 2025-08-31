export class Tipo {
    id: number;
    descripcion: string;
    activo:boolean;
    constructor(init?: Partial<Tipo>) {
        this.id = 0;
        this.descripcion='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
  