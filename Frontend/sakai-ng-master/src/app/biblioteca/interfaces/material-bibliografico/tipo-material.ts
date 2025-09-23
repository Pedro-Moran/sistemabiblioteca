export class TipoMaterial {
    id: number;
    descripcion: string;
    activo:boolean;
    idTipoMaterial?: number;
    constructor(init?: Partial<TipoMaterial>) {
        this.id = 0;
        this.descripcion='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
