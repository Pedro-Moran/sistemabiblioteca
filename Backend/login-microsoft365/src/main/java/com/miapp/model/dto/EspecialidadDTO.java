package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EspecialidadDTO {
    private Long idEspecialidad;
    private String codigoEspecialidad;
    private String descripcion;
    private Long idPrograma;
    private String codigoPrograma;
    private String descripcionPrograma;
}