export class TipoAdquisicion {
    id: number;
    descripcion: string;
    activo:boolean;
    idTipoAdquisicion?: number;
    constructor(init?: Partial<TipoAdquisicion>) {
        this.id = 0;
        this.descripcion='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
