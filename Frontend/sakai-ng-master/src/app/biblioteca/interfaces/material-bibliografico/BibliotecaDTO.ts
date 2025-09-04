import { Pais } from './pais';
import { Ciudad } from './ciudad';
import { Especialidad } from './especialidad';
import { Sedes } from '../sedes';
import { TipoAdquisicion } from './tipo-adquisicion'

export interface BibliotecaDTO {
  /** Equivale a id (Long) */
  id: number;

  /** Equivale a codigoLocalizacion (String) */
  codigoLocalizacion?: string | null;

  /** Equivale a tipoBibliotecaId (Long) */
  tipoBibliotecaId?: number | null;

  /** Equivale a autorPersonal (String) */
  autorPersonal?: string | null;

  /** Equivale a autorInstitucional (String) */
  autorInstitucional?: string | null;

  /** Equivale a autorSecundario (String) */
  autorSecundario?: string | null;

  /** Equivale a traductor (String) */
  traductor?: string | null;

  /** Equivale a director (String) */
  director?: string | null;

  /** Equivale a coordinador (String) */
  coordinador?: string | null;

  /** Equivale a compilador (String) */
  compilador?: string | null;

  /** Equivale a productor (String) */
  productor?: string | null;

  /** Equivale a titulo (String) */
  titulo?: string | null;

  /** Equivale a tituloAnterior (String) */
  tituloAnterior?: string | null;

  /** Equivale a editorialPublicacion (String) */
  editorialPublicacion?: string | null;

  /** Equivale a tipoAnioPublicacion (Integer → number) */
  tipoAnioPublicacion?: number | null;

  /** Equivale a anioPublicacion (Integer → number) */
  anioPublicacion?: number | null;

  /** Equivale a idEspecialidad (Long) */
  idEspecialidad?: number | null;

  /** Equivale a isbn (String) */
  isbn?: string | null;

  /** Equivale a issn (String) */
  issn?: string | null;

  /** Equivale a serie (String) */
  serie?: string | null;

  /** Equivale a tipoReproduccion (Integer → number) */
  tipoReproduccion?: number | null;

  /** Equivale a tipoMaterialId (Long) */
  tipoMaterialId?: number | null;

  /** Equivale a tipoConteo (Integer → number) */
  tipoConteo?: number | null;

  /** Equivale a numeroConteo (String) */
  numeroConteo?: string | null;

  /** Equivale a numeroConteo2 (String) */
  numeroConteo2?: string | null;

  /** Equivale a edicion (String) */
  edicion?: string | null;

  /** Equivale a reimpresion (Integer → number) */
  reimpresion?: number | null;

  /** Equivale a descriptor (String) */
  descriptor?: string | null;

  /** Equivale a notaContenido (String) */
  notaContenido?: string | null;

  /** Equivale a notaGeneral (String) */
  notaGeneral?: string | null;

  /** Equivale a notaResumen (String) */
  notaResumen?: string | null;

  /** Equivale a idiomaId (Long) */
  idiomaId?: number | null;

  /** Equivale a paisId (String) */
  paisId?: string | null;

  /** Equivale a ciudadCodigo (String) */
  ciudadCodigo?: string | null;

  /** Equivale a periodicidadId (Long) */
  periodicidadId?: number | null;

  /** Equivale a numeroExpediente (String) */
  numeroExpediente?: string | null;

  /** Equivale a juzgado (String) */
  juzgado?: string | null;

  /** Equivale a fechaInicioExpediente (LocalDateTime → string o Date) */
  fechaInicioExpediente?: string | null;

  /** Equivale a motivo (String) */
  motivo?: string | null;

  /** Equivale a proceso (String) */
  proceso?: string | null;

  /** Equivale a materia (String) */
  materia?: string | null;

  /** Equivale a observacion (String) */
  observacion?: string | null;

  /** Equivale a demandado (String) */
  demandado?: string | null;

  /** Equivale a demandante (String) */
  demandante?: string | null;

  /** Equivale a rutaImagen (String) */
  rutaImagen?: string | null;

  /** Equivale a nombreImagen (String) */
  nombreImagen?: string | null;

  /** Equivale a estadoId (Long) */
  estadoId?: number | null;

  /** Equivale a flasyllabus (Boolean) */
  flasyllabus?: boolean | null;

  /** Equivale a fladigitalizado (Boolean) */
  fladigitalizado?: boolean | null;

  /** Equivale a linkPublicacion (String) */
  linkPublicacion?: string | null;

  /** Equivale a numeroPaginas (Integer → number) */
  numeroPaginas?: number | null;

  /** Equivale a numeroDeIngreso (Long) */
  numeroDeIngreso?: number | null;

  /** Equivale a sedeId (Long) */
  sedeId?: number | null;

  /** Equivale a tipoAdquisicionId (Long) */
  tipoAdquisicionId?: number | null;

  /** Equivale a fechaIngreso (LocalDateTime → string o Date) */
  fechaIngreso?: string | null;

  /** Equivale a costo (BigDecimal → number) */
  costo?: number | null;

  /** Equivale a numeroFactura (String) */
  numeroFactura?: string | null;

  /** Equivale a existencias (Integer → number) */
  existencias?: number | null;

  /** Equivale a usuarioCreacion (String) */
  usuarioCreacion?: string | null;

  /** Equivale a fechaCreacion (LocalDateTime → string o Date) */
  fechaCreacion?: string | null;

  /** Equivale a usuarioModificacion (String) */
  usuarioModificacion?: string | null;

  /** Equivale a fechaModificacion (LocalDateTime → string o Date) */
  fechaModificacion?: string | null;

  pais?: Pais | null;
  ciudad?: Ciudad | null;
  especialidad?: Especialidad | null;
  sede?: Sedes | null;
  tipoAdquisicion?: TipoAdquisicion | null;


  /** Lista de detalles (mapeará a tu DetalleBibliotecaDTO) */
  detalles?: DetalleBibliotecaDTO[];
}
