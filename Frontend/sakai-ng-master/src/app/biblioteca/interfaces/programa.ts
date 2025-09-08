export class Programa {
    id: number;
    descripcion: string;
    activo: boolean;
    constructor(init?: Partial<Programa>) {
        this.id = 0;
        this.descripcion = '';
        this.activo = false;
        Object.assign(this, init);
    }
}
