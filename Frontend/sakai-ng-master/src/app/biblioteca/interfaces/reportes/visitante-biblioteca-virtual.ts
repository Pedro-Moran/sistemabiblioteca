export interface VisitanteBibliotecaVirtualDTO {
    sede: string;
    baseDatos: string;
    codigo: string;
    apellidosNombres: string;
    tipoUsuario: string;
    especialidad: string;
    programa: string;
    ciclo: string;
    correo: string;
    totalVisitas: number;
    totalSesiones: number;
    flgUsuario?: number | string;
}
