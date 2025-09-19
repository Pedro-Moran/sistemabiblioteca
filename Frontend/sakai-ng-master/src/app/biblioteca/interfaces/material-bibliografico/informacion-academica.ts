export interface InformacionAcademicaDetalle {
  gradoAcademico: string;
  carrera: string;
  cicloNivel: string;
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
}
