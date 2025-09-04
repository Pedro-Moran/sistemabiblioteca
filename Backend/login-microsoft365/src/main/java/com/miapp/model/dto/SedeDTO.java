package com.miapp.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SedeDTO {
    private Long id;
    private String descripcion;
    private Boolean activo;
}