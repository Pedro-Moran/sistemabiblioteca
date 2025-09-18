export class Programa {
    id: number;
    programa: string;
    descripcionPrograma: string;
    activo: boolean;
    constructor(init?: Partial<Programa>) {
        this.id = 0;
        this.programa = '';
        this.descripcionPrograma = '';
        this.activo = true;
        Object.assign(this, init);
    }
}
