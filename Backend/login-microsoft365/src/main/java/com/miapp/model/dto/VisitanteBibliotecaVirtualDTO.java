package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** DTO para reporte de visitantes de biblioteca virtual */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisitanteBibliotecaVirtualDTO {
    private String sede;
    private String tipoDocumento;
    private String numeroDocumento;
    private String apellidosNombres;
    private String tipoUsuario;
    private Long   totalVisitas;
}