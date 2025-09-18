export class Especialidad {
    id: number;
    codigo: string;
    descripcion: string;
    activo: boolean;
    programaId: number | null;
    programaCodigo: string;
    programaDescripcion: string;
    constructor(init?: Partial<Especialidad>) {
        this.id = 0;
        this.codigo = '';
        this.descripcion = '';
        this.activo = true;
        this.programaId = null;
        this.programaCodigo = '';
        this.programaDescripcion = '';
        Object.assign(this, init);
    }
}
