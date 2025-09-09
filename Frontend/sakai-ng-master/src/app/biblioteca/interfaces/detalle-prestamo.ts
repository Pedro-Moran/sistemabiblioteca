export interface DetallePrestamo {
  id: number;
  alcance?: string;
  usuario?: string;
  especialidad?: string;
  equipo?: {
    idEquipo: number;
    nombreEquipo: string;
    ip: string;
    sede: {
      descripcion: string;
    };
  };
  material?: {
    /** Título o nombre del material */
    titulo?: string;
    /** Número de ingreso del material */
    numeroIngreso?: string;
    /** Especialidad asociada al material */
    especialidad?: {
      descripcion: string;
    };
  };
  titulo?: string;
  numeroIngreso?: string;
  usuarioPrestamo: string;
  codigoUsuario: string;
  /** Código de sede cuando no se incluye información de equipo */
  codigoSede?: string;
  tipoPrestamo: string;
  fechaPrestamo: string;
  usuarioRecepcion?: string;
  fechaRecepcion?: string;
  estado?: {
    descripcion: string;
  };
}
