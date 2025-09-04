export interface UsuarioPrestamosDTO {
    /** Identificador del último préstamo */
    id: number;
    usuario: string;
    sede: string | null;
    totalPrestamos: number;
}
