import { Equipo } from './biblioteca-virtual/equipo';
export interface DetallePrestamo {
  id: number;
  alcance: string;
  usuario: string;
  especialidad: string;
  equipo: {
      idEquipo: number; nombreEquipo: string; ip: string;
    sede: {
      descripcion: string;
    };
  };
    material?: {
      /** Título o nombre del material */
      titulo: string;
    };
  usuarioPrestamo: string;
  codigoUsuario: string;
  tipoPrestamo: string;
  fechaPrestamo: string;
  usuarioRecepcion?: string;
  fechaRecepcion?: string;
    estado?: {
      descripcion: string;
    };
}
