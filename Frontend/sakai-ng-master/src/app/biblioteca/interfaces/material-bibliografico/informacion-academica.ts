export interface InformacionAcademicaDetalle {
  gradoAcademico: string;
  carrera: string;
  cicloNivel: string;
  estadoPrograma?: string;
  motaccion?: string;
  [key: string]: unknown;
}

export interface InformacionAcademicaResponse {
  detalleInformacionAcademica?: InformacionAcademicaDetalle[];
  [key: string]: unknown;
}

export interface SeleccionAcademica {
  programa: string;
  especialidad: string;
  ciclo: string;
  estadoPrograma?: string;
  motaccion?: string;
}
