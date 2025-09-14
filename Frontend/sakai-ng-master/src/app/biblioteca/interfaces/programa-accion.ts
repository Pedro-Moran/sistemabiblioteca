export class ProgramaAccion {
    id: number;
    descripcion: string;
    estado: boolean;
    constructor(init?: Partial<ProgramaAccion>) {
        this.id = 0;
        this.descripcion = '';
        this.estado = true;
        Object.assign(this, init);
    }
}
