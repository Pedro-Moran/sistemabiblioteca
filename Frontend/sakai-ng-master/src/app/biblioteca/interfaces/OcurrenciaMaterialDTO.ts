// src/app/interfaces/ocurrencia-material-dto.ts
export interface OcurrenciaMaterialDTO {
  idMaterial:    number | null;
  codigoEquipo:  string;
  nombreEquipo:  string;
  cantidad:      number;
  costo:         number | null;
  esBiblioteca:  boolean | null;
}
