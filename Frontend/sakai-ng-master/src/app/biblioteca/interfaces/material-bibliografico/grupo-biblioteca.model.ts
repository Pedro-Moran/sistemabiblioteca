// src/app/interfaces/material-bibliografico/grupo-biblioteca.model.ts

import { DetalleBibliotecaDTO } from './DetalleBibliotecaDTO';

export interface BibliotecaResumen {
  id: number;
  codigoLocalizacion?: string | null;
  tipoBibliotecaId?: number | null;
  autorPersonal?: string | null;
  autorInstitucional?: string | null;
  autorSecundario?: string | null;
  traductor?: string | null;
  director?: string | null;
  coordinador?: string | null;
  compilador?: string | null;
  productor?: string | null;
  titulo?: string | null;
  tituloAnterior?: string | null;
  editorialPublicacion?: string | null;
  tipoAnioPublicacion?: number | null;
  anioPublicacion?: number | null;
  idEspecialidad?: number | null;
  isbn?: string | null;
  issn?: string | null;
  serie?: string | null;
  tipoReproduccion?: number | null;
  tipoConteo?: number | null;
  numeroConteo?: string | null;
  numeroConteo2?: string | null;
  edicion?: string | null;
  reimpresion?: number | null;
  descriptor?: string | null;
  notaContenido?: string | null;
  notaGeneral?: string | null;
  notaResumen?: string | null;
  idiomaId?: number | null;
  paisId?: string | null;
  ciudadCodigo?: string | null;
  periodicidadId?: number | null;
  numeroExpediente?: string | null;
  juzgado?: string | null;
  fechaInicioExpediente?: string | null;
  motivo?: string | null;
  proceso?: string | null;
  materia?: string | null;
  observacion?: string | null;
  demandado?: string | null;
  demandante?: string | null;
  rutaImagen?: string | null;
  nombreImagen?: string | null;
  estadoId?: number | null;
  flasyllabus?: boolean | null;
  fladigitalizado?: boolean | null;
  linkPublicacion?: string | null;
  numeroPaginas?: number | null;
  numeroDeIngreso?: number | null;
  sedeId?: number | null;
  tipoAdquisicionId?: number | null;
  fechaIngreso?: string | null;
  costo?: number | null;
  numeroFactura?: string | null;
  existencias?: number | null;
  usuarioCreacion?: string | null;
  fechaCreacion?: string | null;
  usuarioModificacion?: string | null;
  fechaModificacion?: string | null;
  tipoMaterialId?: number | null;
}

export interface GrupoBiblioteca {
  biblioteca: BibliotecaResumen;
  detalles: DetalleBibliotecaDTO[];
   expandido?: boolean;
}
