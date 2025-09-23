export class Idioma {
    id: number;
    idiomaId?: string;
    nombre?: string;
    descripcion: string;
    activo:boolean;
    constructor(init?: Partial<Idioma>) {
        this.id = 0;
        this.descripcion='';
        this.activo=false;
        // Inicialización opcional si se pasa un objeto
        Object.assign(this, init);
    }
  }
