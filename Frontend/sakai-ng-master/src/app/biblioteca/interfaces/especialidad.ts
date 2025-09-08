export class Especialidad {
    id: number;
    descripcion: string;
    activo: boolean;
    constructor(init?: Partial<Especialidad>) {
        this.id = 0;
        this.descripcion = '';
        this.activo = false;
        Object.assign(this, init);
    }
}
