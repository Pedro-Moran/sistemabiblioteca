export interface EjemplarPrestadoDTO {
  idDetalle: number;
  titulo: string;
  ciclo: number | null;
  codigoLocalizacion: string;
  numeroIngreso: number | null;
  anio: number | null;
  autor: string;
  totalPrestamos: number;
}
