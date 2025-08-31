package com.miapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TipoAdquisicionDTO {
    private Long id;
    private String descripcion;
    private Boolean activo;
}