export class MotivoAccion {
    id: number;
    descripcion: string;
    estado: boolean;
    constructor(init?: Partial<MotivoAccion>) {
        this.id = 0;
        this.descripcion = '';
        this.estado = true;
        Object.assign(this, init);
    }
}
