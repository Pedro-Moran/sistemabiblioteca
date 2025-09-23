// src/app/interfaces/OcurrenciaMaterial.ts
export interface OcurrenciaMaterial {
  // Este ID corresponde al PK de OCCURRENCIA_MATERIAL en la BD:
  idMaterial?:   number;

  // El resto de campos que necesitas en la vista:
  idEquipo:      number;
  nombreEquipo:  string;
  cantidad:      number;
  ip?:           string;

  // Almacenas el costo unitario que el usuario ingrese:
  costo?:        number;

  // Opción: subTotal = costo * cantidad
  subTotal?:     number;
  esBiblioteca?: boolean;
}
