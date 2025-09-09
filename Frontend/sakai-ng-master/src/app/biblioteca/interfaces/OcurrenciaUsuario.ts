export interface OcurrenciaUsuario {
  /** Código de usuario (login) */
  codigoUsuario: string;
  /** Tipo de usuario */
  tipoUsuario: number;
  /** Identificador numérico del usuario */
  idUsuario?: number;
  /** Nombres del usuario */
  nombres?: string;
  /** Apellido paterno */
  apellidoPaterno?: string;
  /** Apellido materno */
  apellidoMaterno?: string;
}
