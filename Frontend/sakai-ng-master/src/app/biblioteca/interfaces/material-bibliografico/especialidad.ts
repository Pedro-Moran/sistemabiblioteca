export class Especialidad {
    idEspecialidad: number;
    descripcion: string;
    activo:boolean;
    constructor(init?: Partial<Especialidad>) {
        this.idEspecialidad = 0;
        this.descripcion='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
