package com.miapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDTO {
    private String codigo;
    private String titulo;
    private Long especialidadId;  // ID de la especialidad seleccionada
    private String ciclo;
    private String linkPublicacion;
    private String descripcion;
    private String notasContenido;
    private String notaGeneral;
}

