export class ClaseGeneral {
    id: number;
    descripcion: string;
    idRol?: number;
    idTipoDocumento?: number;
    activo:boolean;
    estado:number;
    constructor(init?: Partial<ClaseGeneral>) {
        this.id = 0;
        this.descripcion='';
        this.activo=false;
        this.estado=0;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
